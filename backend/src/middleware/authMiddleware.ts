import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError";
import { JWT_SECRET } from "../config";


interface AuthRequest extends Request {
    user?: { email: string };
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
        const token = req.headers.authorization?.split(" ")[1]; // Extract Bearer token
        if (!token) {
            throw new AppError("Unauthorized: No token provided", 401);
        }

        const decoded = jwt.verify(token, JWT_SECRET) as { email: string };
        req.user = { email: decoded.email }; // Attach user email to request object
        next();
    } catch (error) {
        next(new AppError("Unauthorized: Invalid token", 401));
    }
};

export default authMiddleware;
