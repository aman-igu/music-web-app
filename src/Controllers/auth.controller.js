const Usermodel = require('../models/user_models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

async function registerUser(req, res) {
    try {
        const { username, email, password, role = 'user' } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const IsUserExist = await Usermodel.findOne({
            $or: [
                { username },
                { email }
            ]
        });

        if (IsUserExist) {
            return res.status(409).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await Usermodel.create({
            username,
            email,
            password: hashedPassword,
            role
        });

        const token = jwt.sign({
            id: user._id,
            role: user.role
        }, process.env.JWT_SECRET);

        res.cookie('token', token, {
            httpOnly: true,
            secure: false, // set to true in production
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        return res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error during registration", error: error.message });
    }
}

async function LoginUser(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email/Username and password are required" });
        }

        const user = await Usermodel.findOne({
            $or: [
                { email: email },
                { username: email }
            ]
        });

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const token = jwt.sign({
            id: user._id,
            role: user.role
        }, process.env.JWT_SECRET);

        res.cookie('token', token, {
            httpOnly: true,
            secure: false, // set to true in production
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        return res.status(200).json({
            message: "Login successful",
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            token
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error during login", error: error.message });
    }
}

async function getProfile(req, res) {
    try {
        const user = await Usermodel.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: "Server error fetching profile", error: error.message });
    }
}

async function logoutUser(req, res) {
    res.clearCookie('token');
    return res.status(200).json({ message: "Logged out successfully" });
}

module.exports = { registerUser, LoginUser, getProfile, logoutUser };