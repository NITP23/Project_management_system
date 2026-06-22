import { asyncHandler } from "../middleWares/asyncHandler.js";
import ErrorHandler from "../middleWares/error.js";
import {User} from "../Models/user.js";
import { generateToken } from "../utils/generateToken.js";
import {generateForgetPasswordEmailTemplate} from "../utils/emailTemplates.js";
import {sendEmail} from "../services/emailService.js";
import crypto from "crypto";

// REGISTER USER
export const registerUser = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
        return next(new ErrorHandler("Please fill all the required fields", 400));
    }
    let user = await User.findOne({ email });
    if (user) {
        return next(new ErrorHandler("User already exists", 400));
    }
    user = new User({email, name, password, role});
    await user.save();
    generateToken(user, 201, "User registered successfully", res);

});

export const login = asyncHandler(async (req, res, next) => {
    const { email, password , role } = req.body;

    if (!email || !password || !role) {
        return next(new ErrorHandler("Please fill all the required fields", 400));
    }
    const user = await User.findOne({ email, role }).select("+password");
    if (!user) {
        return next(new ErrorHandler("Invalid email, password or role", 401));
    }
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid email, password or role", 401));
    }
    generateToken(user, 200, "User logged in successfully", res);
});

export const getUser = asyncHandler(async (req, res, next) => {
    const user = req.user;
    res.status(200).json({
        success: true,
        user,
    }); 
});

export const logout = asyncHandler(async (req, res, next) => {
    res.status(200).cookie("token", "", {
        expires: new Date(Date.now()), // 7 days
        httpOnly: true,
    }).json({
        success: true,
        message: "User logged out successfully",
    });
});

export const forgotPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({email : req.body.email});
    if (!user) {
        return next(new ErrorHandler("User not found with this user", 404));
    }
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
    const message = generateForgetPasswordEmailTemplate(resetPasswordUrl);
    try {
        await sendEmail({
            to: user.email,
            subject: "PMS : Password reset Request",
            message,
        });
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler(error.message || "Email could not be sent", 500));
    }
});

export const resetPassword = asyncHandler(async (req, res, next) => {
    const {token} = req.params;
    const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) {
        return next(new ErrorHandler("Invalid or expired password reset token", 400));
    }
    if(!req.body.password || !req.body.confirmPassword){
        return next(new ErrorHandler("Please provide a new password", 400));
    }
    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler("Password and confirm password do not match", 400));
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    generateToken(user, 200, "Password reset successful", res);
    
});

