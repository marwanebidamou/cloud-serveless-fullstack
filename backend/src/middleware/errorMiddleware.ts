import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction): void => {
    let statusCode = 500;
    let message = "Internal Server Error";

    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    }

    console.error(`[ERROR] ${req.method} ${req.path} - ${message}`, err);


    res.status(statusCode).json({
        success: false,
        message,
    });
};

export default errorMiddleware;
