import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import User from '../models/user.model.js';
import { secret, jwtExpiration } from '../constants.js';
import { validateLogin, validateSignup } from '../utils.js';



export const signup = async (req, res) => {
    try {
        const { email, password, cnfPassword } = req.body;

        const error = await validateSignup(email, password, cnfPassword);

        if (error.length > 0) {
            return res.json({ success: false, message: `${error}` })
        }

        const hasedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            email,
            password: hasedPassword,
        });

        await newUser.save();

        res.json({ success: true, message: "Registered successfully!" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const error = validateLogin(email, password);

        if (error.length > 0) {
            return res.json({ success: false, message: `${error}` })
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User with this email does not exists." });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.json({ success: false, message: "Invalid credentials." });
        }

        const token = jwt.sign({ id: user._id }, secret, { expiresIn: jwtExpiration });

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
