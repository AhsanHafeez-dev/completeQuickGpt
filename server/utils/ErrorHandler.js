import { ApiError } from "./ApiError.js";
const errorHandler = (err, req, res, next) => {
    if (!(err instanceof ApiError)) {
        const statusCode = err.statusCode || 500;
        const message = err.message;
        err = new ApiError(statusCode);
    }
    
    const response = {
        statusCode: err.statusCode,
        success: false,
        message: err.message,
        errors:err.erros || []

    }
    res.status(response.statusCode).json(response);
}

export {errorHandler}