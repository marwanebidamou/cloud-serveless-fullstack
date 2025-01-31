import { Request, Response, NextFunction } from "express";
import userService from "../services/userService";
import { AppError } from "../utils/AppError";

// Extend Request interface to include 'user'
interface AuthRequest extends Request {
    user?: { email: string };
}

const getProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user) {
            throw new AppError("Unauthorized: User not found in request", 401);
        }

        const { email } = req.user;

        const user = await userService.getUserByEmail(email);
        if (!user) {
            throw new AppError("User not found", 404);
        }

        res.json({
            email: user.email,
            name: user.name,
            phone: user.phone,
            address: user.address,
            occupation: user.occupation,
            profileImageUrl: user.profileImageUrl,

        });
    } catch (error) {
        next(error);
    }
};

export default { getProfile };
