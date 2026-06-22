import { asyncHandler } from "../middleWares/asyncHandler.js";
import ErrorHandler from "../middleWares/error.js";
import { User } from "../Models/user.js";
import * as userServices from "../services/userServices.js";
import * as projectServices from "../services/projectServices.js";

export const createStudent = asyncHandler(async (req, res, next) => {
    const { name, email, password, department } = req.body;

    if (!name || !email || !password || !department) {
        return next(new ErrorHandler("Please fill all the required fields", 400));
    }

    const user = await userServices.createUser({
        email,
        name,
        password,
        role: "Student",
        department
    });
    res.status(201).json({
        success: true,
        message: "Student created successfully",
        data: { user },
    });
});

export const updateStudent = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const updateData = { ...req.body };
    delete updateData.role; // Prevent role update

    const user = await userServices.updateUser(id, updateData);
    if (!user) {
        return next(new ErrorHandler("Student not found", 404));
    }
    res.status(200).json({
        success: true,
        message: "Student updated successfully",
        data: { user },
    });
});

export const deleteStudent = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const user = await userServices.getUserById(id);
    if (!user) {
        return next(new ErrorHandler("Student not found", 404));
    }
    if (user.role !== "Student") {
        return next(new ErrorHandler("User is not a student", 400));
    }
    await userServices.deleteUser(id);
    res.status(200).json({
        success: true,
        message: "Student deleted successfully",
    });
});

export const createTeacher = asyncHandler(async (req, res, next) => {
    const { name, email, password, department, maxStudents, experties } = req.body;

    if (!name || !email || !password || !department || !maxStudents || !experties) {
        return next(new ErrorHandler("Please fill all the required fields", 400));
    }

    const user = await userServices.createUser({
        email,
        name,
        password,
        department,
        maxStudents,
        experties: Array.isArray(experties) ? experties : typeof experties === "string" && experties.trim() !== "" ? experties.split(",").map(s => s.trim()) : [],
        role: "Teacher"
    });
    res.status(201).json({
        success: true,
        message: "Teacher created successfully",
        data: { user },
    });
});

export const updateTeacher = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const updateData = { ...req.body };
    delete updateData.role; // Prevent role update

    const user = await userServices.updateUser(id, updateData);
    if (!user) {
        return next(new ErrorHandler("Teacher not found", 404));
    }
    res.status(200).json({
        success: true,
        message: "Teacher updated successfully",
        data: { user },
    });
});

export const deleteTeacher = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const user = await userServices.getUserById(id);
    if (!user) {
        return next(new ErrorHandler("Teacher not found", 404));
    }
    if (user.role !== "Teacher") {
        return next(new ErrorHandler("User is not a Teacher", 400));
    }
    await userServices.deleteUser(id);
    res.status(200).json({
        success: true,
        message: "Teacher deleted successfully",
    });
});

export const getAllUsers = asyncHandler(async (req, res, next) => {
    const users = await userServices.getAllUsers()
    // console.log(users)
    res.status(200).json({
        success: true,
        message: "users fetched sucessfully",
        data: { users }
    })
})

export const getAllProjects = asyncHandler(async (req, res, next) => {
    const projects = await projectServices.getAllProjects()
    res.status(200).json({
        success: true,
        message: "Projects fetched successfully",
        data: { projects }
    })
})
export const getDashboardStats = asyncHandler(async (req, res, next) => { })
export const assignSupervisor = asyncHandler(async (req, res, next) => { })