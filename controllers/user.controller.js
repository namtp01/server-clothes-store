import User from "../models/user.model.js"
import expressAsyncHandler from "express-async-handler"
import generateToken from "../utils/generateToken.js"
import bcrypt from "bcryptjs"
import refreshToken from "../utils/refreshToken.js"
import sendMail from "./email.controller.js"
import jwt from 'jsonwebtoken';

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
const login = expressAsyncHandler(async (req, res) =>
{
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })

        if (user) {
            if (bcrypt.compareSync(password, user.password)) {
                res.json({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    isAdmin: user.isAdmin,
                    token: generateToken(user._id),
                    createdAt: user.createdAt
                })
            } else {
                res.status(401).json({ message: 'Invalid password' })
            }
        } else {
            res.status(401).json({ message: 'Invalid email' })
        }
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// @desc    Register a new user
// @route   POST /api/users/
// @access  Public
const register = expressAsyncHandler(async (req, res) =>
{
    try {
        const { name, email, password } = req.body;
        const userExists = await User.findOne({ email });

        if (userExists) {
            res.status(400)
            throw new Error("User Already Exists")
        } else {
            const user = await User.create({
                name,
                email,
                password: bcrypt.hashSync(password, 10)
            })

            if (user) {
                res.status(201).json({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    isAdmin: user.isAdmin,
                    token: generateToken(user._id)
                })
            } else {
                res.status(400)
                throw new Error('Invalid user data')
            }
        }
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = expressAsyncHandler(async (req, res) =>
{
    const user = await User.findById(req.user._id)
    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            createdAt: user.createdAt
        })
    } else {
        res.status(404)
        throw new Error("User Not Found")
    }
})

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = expressAsyncHandler(async (req, res) =>
{
    try {
        const user = await User.findById(req.user._id)
        if (user) {
            user.name = req.body.name || user.name
            user.email = req.body.email || user.email
            if (req.body.password) {
                user.password = req.body.password
            }
            const updateUser = await user.save()
            res.json({
                _id: updateUser._id,
                name: updateUser.name,
                email: updateUser.email,
                isAdmin: updateUser.isAdmin,
                token: generateToken(updateUser._id)
            })
        } else {
            res.status(404)
            throw new Error("User Not Found")
        }
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// @desc    Admin get all Users
// @route   GET /api/users/
// @access  Private/Admin
const adminGetAllUsers = expressAsyncHandler(async (req, res) =>
{
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = expressAsyncHandler(async (req, res) =>
{
    try {
        const user = await User.findById(req.params.id)
        if (user) {
            res.json({ message: 'User removed' })
        } else {
            res.status(404)
            throw new Error('User not found')
        }
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

const forgotPasswordToken = expressAsyncHandler(async (req, res) =>
{
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) throw new Error('User not found')
    try {
        const token = await refreshToken(user._id)
        await user.save()

        const resetURL = `Hi, Please follow this link to reset your password. This link is valid till 10 minutes from now. 
        <a href='http://localhost:3000/reset-password/${token}'>Click here</a>`;

        const data = {
            to: email,
            text: "Hello User",
            subject: "Forgot Password Link",
            htm: resetURL
        }

        sendMail(data)
        res.json(token)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

const resetPassword = expressAsyncHandler(async (req, res) => {
    const { password } = req.body
    const { token } = req.params

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const userId = decoded.id

        const user = await User.findById(userId)
        if (!user) throw new Error('User not found')

        user.password = bcrypt.hashSync(password, 10)
        await user.save()

        res.json({ message: 'Password changed successfully' })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }

})

const handleRefreshToken = expressAsyncHandler(async (req, res) =>
{
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("No refresh token in cookies");
    const refreshToken = cookie.refreshToken;
    
    const user = await User.findOne({ refreshToken });
    if (!user) throw new Error("No refresh token present in database or not matched");
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) =>
    {
        if (err || user.id !== decoded.id) {
            throw new Error("There is something wrong with refresh token");
        }
        const accessToken = generateToken(user?._id);
        res.json({ accessToken });
    });
});

export { login, register, getUserProfile, updateUserProfile, adminGetAllUsers, deleteUser, forgotPasswordToken, resetPassword }