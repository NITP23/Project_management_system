import { asyncHandler } from "../middlewares/asyncHandler.js";
import ErrorHandler from "../middleWares/error.js";
import { Deadline } from "../models/deadline.js";
import { Project } from "../models/project.js"
import { createProject, getProjectById } from "../services/projectServices.js"


export const createDeadline = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, dueDate } = req.body;

    const project = await getProjectById(id);

    if (!name || !dueDate) {
        throw new ErrorHandler("All fields are required", 400);
    }

    if (!project) {
        return next(new ErrorHandler("Project not found", 404));
    }


    const deadlineData = {
        name,
        dueDate: new Date(dueDate),
        createdBy: req.user._id,
        project: project || null,
    }
    const deadline = await Deadline.create(deadlineData);

    await deadline.populate([{ path: "createdBy", select: "name email" }])

    if (project) {
        await Project.findByIdAndUpdate(project, { deadline: dueDate }, { new: true, runValidators: true })
    }

    return res.status(201).json({
        success: true,
        message: "Deadline created successfully",
        data: { deadline },
    })
})