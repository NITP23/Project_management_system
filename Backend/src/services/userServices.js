import {User} from "../Models/user.js";


export const createUser = async (userData) => {
    try {
        const user = new User(userData);
        return user.save();
    } catch (error) {
        throw new Error(`Error creating user: ${error.message}`);
    }
};

export const updateUser = async (id, updateData) => {
    try {
        return await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).select("-password");
    } catch (error) {
        throw new Error(`Error updating user: ${error.message}`);
    }
};

export const getUserById = async (id) => {
    try {
        return await User.findById(id).select("-password -rresetPasswordToken -resetPasswordExpire");
    } catch (error) {
        throw new Error(`Error fetching user: ${error.message}`);
    }
};

export const getAllUsers = async () => {
    const query = {role: {$ne: "Admin"}}
    const users = await User.find(query).select("-password -resetPasswordToken -confirmPasswordExpire").sort({createdAt: -1});
    
    return users
}

export const deleteUser = async (id) => {
    const user = await getUserById(id);
    if (!user) {
        throw new Error("User not found");
    }
    return await user.deleteOne();
};