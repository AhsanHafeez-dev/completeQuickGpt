import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateAccessToken = async (user) => {
    const accessToken=await jwt.sign({ id: user.id || user._id }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: process.env.ACCCESS_TOKEN_EXPIRY,
    });
    return accessToken

}


const generateRefreshToken = async (user) => {
    return await jwt.sign({ id: user.id || user._id }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    });
};


const generateAccessAndRefreshToken = async (user) => {
    const accessToken=await generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);
    return { accessToken, refreshToken };
}

const encryptPassword = async (password) => {
    return await bcrypt.hash(password, 10);
}

const comparePassword = async (orignalPassword, givenPassword) => {
    return await bcrypt.compare(givenPassword,orignalPassword)
};
export { generateAccessAndRefreshToken, generateAccessToken, generateRefreshToken,encryptPassword,comparePassword };