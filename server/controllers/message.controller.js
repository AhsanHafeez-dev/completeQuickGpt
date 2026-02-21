import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { prisma } from "../prisma/index.js";
import { httpCodes } from "../constants.js";
import { getResponseFromAI } from "../utils/llm.js";
import { generateImage } from "../utils/imageKit.js";
import { generateAndUpload } from "../utils/ImageGeneration.js";
import { APIError } from "openai";


const textMessageController = asyncHandler(async (req, res) => {
    const { chatId, prompt } = req.body;
    if (!(chatId && prompt)) { throw new ApiError(httpCodes.badRequest, "chatId and prompt are required"); }

    if (req.user.credits < 1) { throw new ApiError(httpCodes.forbidden, "Insufficient credits"); }
    
    await prisma.message.create({ data: { isImage: false, content: prompt, timeStamp: Date.now(),role:"user",chatId } }); 
    const reply = await getResponseFromAI([{ content:prompt, role: "user" }]);
    res.status(httpCodes.created).json(new ApiResponse(httpCodes.created,reply,"Message from ai"))
    await prisma.message.create({ data: { content: reply.content, role: reply.role, timeStamp: Date.now(), isImage: false, chatId: chatId } });
    await prisma.user.update({ where: { id: req.user.id }, data: { credits: { decrement: 1 } } });
    return;
    
    
})

const imageMessageController = asyncHandler(async (req, res) => {
    const { chatId, prompt, isPublished } = req.body;
    
    if (!(chatId.trim() && prompt.trim())) { throw new ApiError(httpCodes.badRequest, "required arguments cannot be null (chatId,prompt"); }
    if (req.user.credits < 2) { throw new ApiError(httpCodes.forbidden, "Insufficient credit"); }

    await prisma.message.create({ data: { isImage: false, content: prompt, timeStamp: Date.now(), role: "user", chatId } }); 
         
    const imageUrl = await generateAndUpload(prompt);
    if (!imageUrl) { throw new APIError(httpCodes.serverSideError, "something going wron"); }
    console.log(imageUrl);
    

    
    
    await prisma.message.create({ data: { isImage: true, isPublished, content: imageUrl, timeStamp: Date.now(), role: "assistant", chatId } }); 
    await prisma.user.update({ where: { id: req.user.id }, data: { credits: { decrement:2 } } });

    return res.status(httpCodes.created).json(new ApiResponse(httpCodes.created, { imageUrl }, "image generated successfully"));
    
})  

export { textMessageController, imageMessageController };