import dotenv from "dotenv";
dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET || "default-secret";

export const BUCKET_NAME = process.env.BUCKET_NAME || "authwave-profile-images";
