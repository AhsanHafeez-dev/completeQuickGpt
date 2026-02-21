import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { prisma } from "../prisma/index.js"
import { httpCodes } from "../constants.js";

const createChat = asyncHandler(async (req, res) => {
    const chat=await prisma.chat.create({ data: { userId: req.user.id, name: "new chat" } })
    return res.status(httpCodes.created).json(new ApiResponse(httpCodes.created, chat, "chat created suuccessfully"));
})

const getChats = asyncHandler(async (req, res) => {
    const chats = await prisma.chat.findMany({ where: { userId: req.user.id }, orderBy: { updatedAt: 'desc' }, include: { messages: true, user: { omit: { password: true, refreshToken: true } } } });
    return res.status(httpCodes.ok).json(new ApiResponse(httpCodes.ok, chats, "chats fetched successfully"));

})




const deleteChat = asyncHandler(async (req, res) => {
    try {
        const { chatId } = req.body;
        await prisma.chat.delete({ where: { id: chatId ,userId:req.user.id} });
        return res.status(httpCodes.ok).json(new ApiResponse(httpCodes.ok, {}, "deleted successfully"));
    }
    catch (err) {
        console.log(err);
        
        throw new ApiError(httpCodes.notFound,"chat doesnot exists ")
    }

})

export {createChat,getChats,deleteChat}