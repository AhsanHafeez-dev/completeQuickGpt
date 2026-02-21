// const asyncHandler = (requestHandler) => {
//     return (req, res, next) => {
//         Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
//     }
// }

import { ApiError } from "./ApiError.js"


const asyncHandler = (controller) => async (req, res, next) => {
    try {
        await controller(req, res, next);
        
    } catch (error) {
        console.log(error);
        
        throw new ApiError(error.httpCode || 500, error.message || 'something went wrong');
        
    }
}


export { asyncHandler };