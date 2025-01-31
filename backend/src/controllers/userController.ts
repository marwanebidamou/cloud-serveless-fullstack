import { Request, Response, NextFunction } from "express";
import userService from "../services/userService";
import { AppError } from "../utils/AppError";
import AWS from "aws-sdk";
import { BUCKET_NAME } from "../config";

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


const s3 = new AWS.S3();


const getUploadUrl = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user) {
            throw new AppError("Unauthorized", 401);
        }

        // Generate unique filename using email and timestamp
        const fileName = `profile-${req.user.email}-${Date.now()}.jpg`;

        const params = {
            Bucket: BUCKET_NAME,
            Key: fileName,
            Expires: 360,
            ContentType: "image/jpeg",
        };

        // Get presigned URL
        const uploadUrl = await s3.getSignedUrlPromise("putObject", params);

        res.json({
            uploadUrl, // URL where frontend can upload image
            fileUrl: `https://${BUCKET_NAME}.s3.amazonaws.com/${fileName}`, // Final image URL
        });
    } catch (error) {
        next(error);
    }
};

const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user) {
            throw new AppError("Unauthorized: User not authenticated", 401);
        }

        const { email } = req.user; // Extract email from JWT

        const updatedUser = await userService.updateUserProfile(email, req.body);

        res.json({
            message: "Profile updated successfully",
            user: updatedUser,
        });
    } catch (error) {
        next(error);
    }
};


export default { getProfile, getUploadUrl, updateProfile };
