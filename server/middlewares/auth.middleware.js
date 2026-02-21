import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { httpCodes } from "../constants.js";
import { prisma } from "../prisma/index.js";
export const protect = async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) { throw new ApiError(httpCodes.unauthorized, "please login first"); }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
    if (!decodedToken) { throw new ApiError(httpCodes.unauthorized, "Invalid token"); }

    const user = await prisma.user.findUnique({ where: { id: decodedToken.id } });
    if (!user) { throw new ApiError(httpCodes.notFound, "user not found"); }
    user.password = user.refreshToken = undefined;

    req.user = user;
    next();
}