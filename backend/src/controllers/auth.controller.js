import { User } from "../models/User.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
    generateToken,
    setTokenCookie,
} from "../utils/generateToken.js";

/**
 * اطلاعات امن کاربر را برای Response آماده می‌کند.
 */
export function createPublicUser(user) {
    return {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
}


export const registerUser = asyncHandler(async(req,res)=>{
    const {fullName, email, password} = req.body

    const existingUser = await User.findOne({email})

    if(existingUser){
          throw new ApiError(
            409,
            "An account with this email already exists."
        );
    }

     const user = await User.create({
        fullName,
        email,
        password,
    });

    const token = generateToken(user._id);

    setTokenCookie(res, token);

    return res.status(201).json({
        success: true,
        message: "Registration completed successfully.",
        data: {
            user: createPublicUser(user),
            token,
        },
    });
})


export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        throw new ApiError(
            401,
            "Email or password is incorrect."
        );
    }

    const passwordIsCorrect =
        await user.comparePassword(password);

    if (!passwordIsCorrect) {
        throw new ApiError(
            401,
            "Email or password is incorrect."
        );
    }

    const token = generateToken(user._id);

    setTokenCookie(res, token);

    return res.status(200).json({
        success: true,
        message: "Login completed successfully.",
        data: {
            user: createPublicUser(user),
            token,
        },
    });
});



export const logoutUser = asyncHandler(async (req, res) => {
    res.clearCookie("chat_token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite:
            process.env.NODE_ENV === "production"
                ? "none"
                : "lax",
        path: "/",
    });

    return res.status(200).json({
        success: true,
        message: "Logout completed successfully.",
        data: null,
    });
});

export const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Current user fetched successfully.",
        data: {
            user: createPublicUser(req.user),
        },
    });
});