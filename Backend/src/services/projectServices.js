import ErrorHandler from "../middleWares/error.js";
import { Project } from "../Models/project.js";

export const getProjectByStudent = async (studentId) => {
    return await Project.findOne({ student: studentId }).sort({ createdAt: - 1 })
};

export const createProject = async (projectDate) => {
    const project = new Project(projectDate);
    await project.save();
    return project;
};

export const getProjectById = async (id) => {
    const project = await Project.findById(id).populate("student", "name email").populate("supervisor", "name email").populate("feedback.supervisorId", "name email")

    if (!project) {
        throw new ErrorHandler("Project not found", 404);
    }

    return project;
}

export const addFilesToProject = async (projectId, files) => {
    const project = await Project.findById(projectId)

    if (!project) {
        throw new ErrorHandler("Project not found", 404);
    }
    const filMetaData = files.map((file) => ({
        fileType: file.mimetype,
        fileUrl: file.path,
        originalName: file.originalname,
        uploadedAt: new Date()
    }))

    project.files.push(...filMetaData)
    await project.save();
    return project;
}

export const getAllProjects = async () => {
    const projects = await Project.find().populate("student", "name email").populate("supervisor", "name email").sort({ createdAt: -1 });

    const total = await Project.countDocuments()
    return projects;
}

export const markComplete = async (projectId) => {
    const project = await Project.findByIdAndUpdate(projectId, { status: "completed" }, { new: true, runValidators: true }).populate("student", "name email").populate("supervisor", "name email")
    if (!project) {
        throw new ErrorHandler("Project not found", 404);
    }
    return project;
}


export const addFeedback = async (projectId, supervisorId, message, title, type) => {
    const project = await Project.findById(projectId);
    if (!project) {
        throw new ErrorHandler("Project not found", 404);
    }
    project.feedback.push({
        supervisorId,
        title,
        message,
        type
    });
    await project.save();
    const latestFeedback = project.feedback[project.feedback.length - 1];

    return { project, latestFeedback };
}