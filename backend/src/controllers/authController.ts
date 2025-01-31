import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userService from "../services/userService";
import { JWT_SECRET } from "../config";


const signup = async (req: Request, res: Response) => {
    const { email, password, name, phone, address, occupation } = req.body;
    if (!email || !password || !name) {
        res.status(400).json({ message: "Please provide name, email, and password." });
        return;
    }

    const oldUser = await userService.getUserByEmail(email);
    if (oldUser) {
        res.status(400).json({ message: "Email already exists." });
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
        email,
        name,
        phone,
        address,
        occupation,
        password: hashedPassword,
        profileImageUrl: "",
    };

    await userService.saveUser(newUser);
    res.status(201).json({ message: "User registered successfully!" });
    return;
};

const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await userService.getUserByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
    }

    const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: "1h" });
    res.json({
        message: "Login successful!", token, user:
        {
            email: user.email,
            name: user.name,
            phone: user.phone,
            address: user.address,
            occupation: user.occupation,
            profileImageUrl: user.profileImageUrl,
        }
    });
    return;
};

export default { signup, login };
