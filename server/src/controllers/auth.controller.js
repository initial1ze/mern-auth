import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';

import { secret, jwtExpiration } from '../constants.js';



export const signup = async (req, res) => {
    try {
        const { email, password, cnfPassword } = req.body;

        if (!email || !password || !cnfPassword) {
            return res.json({ success: false, message: "Please fill all the fields." });
        }

        const validEmailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/g;

        if (validEmailRegex.test(email) === false) {
            return res.json({ success: false, message: "Please enter a valid email address." });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Password must be at least 8 characters long." });
        }

        if (password !== cnfPassword) {
            return res.json({ success: false, message: "Password do not match." });
        }

        const userExists = await User.exists({ email });

        if (userExists) {
            return res.json({ success: false, message: "User with this email already exists." });
        }

        const hasedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            email,
            password: hasedPassword,
        });

        await newUser.save();

        res.json({ success: true, message: "User was registered successfully!" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.json({ success: false, message: "Please fill all the fields." });
        }

        const validEmailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/g;

        if (validEmailRegex.test(email) === false) {
            return res.json({ success: false, message: "Please enter a valid email address." });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User with this email does not exists." });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.json({ success: false, message: "Invalid credentials." });
        }

        const token = jwt.sign({ email: user.email, id: user._id }, secret, { expiresIn: jwtExpiration });

        return res.json({
            success: true,
            message: "Logged in successfully!",
            user: {
                id: user._id,
                token
            }
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const getUser = async (req, res) => {
    try {

        // const authorizationHeader = req.headers.authorization;
        // if (!authorizationHeader) return res.json({ success: false, message: "No token, authorization denied." });

        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.json({ success: false, message: "No token, authorization denied." });

        const decoded = jwt.verify(token, secret);
        const userId = decoded.id;

        const user = await User.findById(userId);

        if (!user) {
            return res.json({ success: false, message: "User not found." });
        }

        res.json({
            success: true,
            user: {
                id: user._id,
                email: user.email
            }
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}
