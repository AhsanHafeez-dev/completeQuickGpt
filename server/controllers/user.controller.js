import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { prisma } from "../prisma/index.js"
import { httpCodes } from "../constants.js";

import { comparePassword, encryptPassword, generateAccessAndRefreshToken, generateAccessToken } from "../utils/user.utils.js";

const registerUser = asyncHandler(async (req, res) => {
    let { email, userName, password } = req.body;
    
    if (!(email.trim() && password.trim() && userName.trim())) { throw new ApiError(httpCodes.badRequest, "email password and userName is required for user creation"); }

    const userExists = await prisma.user.findFirst({ where: { email } });

    
    
    if (userExists) { throw new ApiError(httpCodes.badRequest, "User with this email already exists"); }
    password = await encryptPassword(password);

    const createdUser = await prisma.user.create({ data: { email, password, userName } });
    const accessToken = await generateAccessToken(createdUser);
    
    return res.status(httpCodes.created).json(new ApiResponse(httpCodes.created, { token: accessToken }, "user created successfully"));

    

});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!(email.trim() && password.trim())) { throw new ApiError(httpCodes.badRequest, "email password  is required for user login"); }
    
    const userExists = await prisma.user.findFirst({ where: { email } });
    if (!userExists) { throw new ApiError(httpCodes.badRequest, "Invalid user credentials"); }
    const isPasswordCorrect = await comparePassword(userExists.password, password);
    if (!isPasswordCorrect) { throw new ApiError(httpCodes.badRequest, "Invalid user credentials"); }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(userExists);
    return res.status(httpCodes.ok).json(new ApiResponse(httpCodes.ok,{token:accessToken,refreshToken},"logged in successful"))

})


const getUser = asyncHandler(async (req, res) => {
    return res.status(httpCodes.ok).json(new ApiResponse(httpCodes.ok, req.user, "user fetched successfully"));
})

const getPublishedImages = asyncHandler(async (req, res) => {
    let images = await prisma.message.findMany({ where: { isPublished: true }, include: { chat: { include: { user: true } } } });

    images = images.map((image) => ({ id: image.id, userName: image.chat.user.userName, imageUrl: image.content }));
    
    return res.status(httpCodes.ok).json(new ApiResponse(httpCodes.ok, images, "success")); 
})
export { registerUser, loginUser, getUser,getPublishedImages };