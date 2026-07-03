import { asyncHandler } from "../middleWares/asyncHandler.js";
import ErrorHandler from "../middleWares/error.js";
import { User } from "../Models/user.js";
import * as userServices from "../services/userServices.js";
import * as projectServices from "../services/projectServices.js"
import * as requestServices from "../services/requestServices.js"
import * as notificationServices from "../services/notificationServices.js"
import { Project } from "../Models/project.js";
import { Notification } from "../Models/notification.js";
import * as fileServices from "../services/fileServices.js"
import { supervisorRequest } from "../Models/supervisorRequest.js";
import { sendEmail } from "../services/emailService.js"
import { generateRequestAcceptedTemplate, generateRequestRejectedTemplate } from "../utils/emailTemplates.js";


export const getTeacherDashboardStats = asyncHandler(async (req, res, next) => {
    const teacherId = req.user._id;

    const totalPendingRequests = await supervisorRequest.countDocuments({
        status: "pending",
        supervisor: teacherId
    });
    const completedProjects = await Project.countDocuments({
        supervisor: teacherId,
        status: "completed",
    })
    const recentNotifications = await Notification.find({
        user: teacherId
    }).sort({ createdAt: -1 }).limit(5);

    const dashboardStats = {
        totalPendingRequests,
        completedProjects,
        recentNotifications
    }

    return res.status(200).json({
        success: true,
        message: "Dashboard stats fetched for teacher successfully",
        data: { dashboardStats },
    })

})

export const getRequests = asyncHandler(async (req, res, next) => {
    const { supervisor } = req.query;
    const filters = {};
    if (supervisor) {
        filters.supervisor = supervisor;
    }
    const { requests, total } = await requestServices.getAllRequests(filters);
    const updatedRequests = await Promise.all(requests.map(async (reqObj) => {
        const requestObj = reqObj.toObject ? reqObj.toObject() : reqObj;
        if (requestObj?.student?._id) {
            const latestProject = await Project.findOne({
                student: requestObj.student._id,
            })
                .sort({ createdAt: -1 })
                .lean();

            return { ...requestObj, latestProject };
        }
        return requestObj;
    }))

    return res.status(200).json({
        success: true,
        message: "Requests fetched successfully",
        data: { requests: updatedRequests, total },
    })
});

export const acceptRequest = asyncHandler(async (req, res, next) => {
    const { requestId } = req.params;

    const teacherId = req.user._id;

    const request = await requestServices.acceptRequest(requestId, teacherId);

    if (!request) {
        return next(new ErrorHandler("Request not found", 404));
    }

    await notificationServices.notifyUser(request.student._id, `Your supervisor request has been accepted by ${req.user.name}`, "approval", `/requests/${request._id}`, "low")

    const student = await User.findById(request.student._id);

    const studentEmail = student.email;
    const message = generateRequestAcceptedTemplate(req.user.name);

    await sendEmail({ to: studentEmail, subject: "✅ Your Supervisor Request has been Accepted", message });

    return res.status(200).json({
        success: true,
        message: "Request accepted successfully",
        data: { request },
    })
})

export const rejectRequest = asyncHandler(async (req, res, next) => {
    const { requestId } = req.params;

    const teacherId = req.user._id;
    const request = await requestServices.rejectRequest(requestId, teacherId);

    if (!request) {
        return next(new ErrorHandler("Request not found", 404));
    }
    await notificationServices.notifyUser(request.student._id, `Your supervisor request has been rejected by ${req.user.name}`, "rejection", `/requests/${request._id}`, "high")

    const student = await User.findById(request.student._id);

    const studentEmail = student.email;
    const message = generateRequestRejectedTemplate(req.user.name);

    await sendEmail({ to: studentEmail, subject: "❌ Your Supervisor Request has been Rejected", message });

    return res.status(200).json({
        success: true,
        message: "Request rejected",
        data: { request },
    })
})


export const getAssignedStudents = asyncHandler(async (req, res, next) => {
    const teacherId = req.user._id;
    let students = await User.find({
        supervisor: teacherId,
    }).populate("project").sort({ createdAt: -1 });

    // Self-heal logic for existing DB records affected by previous bugs
    students = await Promise.all(students.map(async (student) => {
        let studentObj = student.toObject();
        // If student is assigned but their project is missing (because of the strict mode bug)
        // or the project is missing the 'approved' status, heal it here.
        if (!studentObj.project || studentObj.project.status === "pending") {
            const project = await Project.findOne({ student: student._id }).sort({ createdAt: -1 });
            if (project) {
                let projectUpdated = false;
                if (project.status === "pending") {
                    project.status = "approved";
                    project.supervisor = teacherId;
                    await project.save();
                    projectUpdated = true;
                }

                if (!student.project) {
                    await User.findByIdAndUpdate(student._id, { project: project._id });
                }

                studentObj.project = projectUpdated ? project.toObject() : project;
            }
        }
        return studentObj;
    }));

    const total = await User.countDocuments({ supervisor: teacherId });

    res.status(200).json({
        success: true,
        message: "Students fetched successfully",
        data: { students, total },
    })
})



export const markComplete = asyncHandler(async (req, res, next) => {
    const { projectId } = req.params

    const teacherId = req.user._id;

    const project = await projectServices.getProjectById(projectId);

    if (!project) {
        return next(new ErrorHandler("Project not found", 404));
    }

    if (project.supervisor?._id.toString() !== teacherId.toString()) {
        return next(new ErrorHandler("You are not authorized to mark this project as complete", 403));
    }

    const updatedProject = await projectServices.markComplete(projectId);

    await notificationServices.notifyUser(project.student._id, `Your project ${project.title} has been marked as completed by ${req.user.name}`, "general", `/students/status`, "low")

    const admins = await User.find({ role: "Admin" }).select("_id");
    await Promise.all(admins.map((admin) => notificationServices.notifyUser(
        admin._id,
        `Project ${project.title} by ${updatedProject.student.name} has been marked as completed by supervisor ${req.user.name}`,
        "general",
        "/admin/projects",
        "low"
    )));

    return res.status(200).json({
        success: true,
        message: "Project marked as completed",
        data: {
            project: updatedProject
        },
    })
})

export const addFeedback = asyncHandler(async (req, res, next) => {
    const { projectId } = req.params;
    const teacherId = req.user._id;
    const { message, title, type } = req.body;
    const project = await projectServices.getProjectById(projectId);

    if (!project) {
        return next(new ErrorHandler("Project not found", 404));
    }

    if (project.supervisor._id.toString() !== teacherId.toString()) {
        return next(new ErrorHandler("You are not authorized to add feedback to this project", 403));
    }
    if (!message || !title)
        return next(new ErrorHandler("Message and title are required", 400));

    const { project: updatedProject, latestFeedback } =
        await projectServices.addFeedback(
            projectId,
            teacherId,
            message,
            title,
            type
        );

    await notificationServices.notifyUser(project.student._id, `new feedback on your project ${project.title} from your supervisor ${req.user.name}`, "feedback", `/students/feedback`, type === "positive" ? "low" : type === "negative" ? "high" : "low")



    return res.status(200).json({
        success: true,
        message: "Feedback posted successfully",
        data: {
            project: updatedProject,
            feedback: latestFeedback
        },
    })

})



export const getFiles = asyncHandler(async (req, res, next) => {
    const { teacherId } = req.user._id;
    const projects = await projectServices.getProjectsBySupervisor(teacherId);
    const allFile = projects.flatMap(project =>
        project.files.map(file => ({
            ...file.toObject(),
            projectId: project._id,
            projectTitle: project.title,
            studentName: project.student.name,
            studentEmail: project.student.email,

        }))
    )

    res.status(200).json({
        success: true,
        message: "Files fetched successfully",
        data: {
            files: allFile,
        }
    })
})


export const downloadFile = asyncHandler(async (req, res, next) => {
    const { projectId, fileId } = req.params;
    const supervisorId = req.user?._id
    const project = await projectServices.getProjectById(projectId);

    if (!project) {
        return next(new ErrorHandler("Project not Found", 404));
    }
    if (project.supervisor._id.toString() !== supervisorId.toString()) {
        return next(new ErrorHandler("Not authorized to download file", 403));
    }
    const file = project.files.id(fileId);
    if (!file) {
        return next(new ErrorHandler("File notFound", 404));
    }

    return res.status(200).json({
        success: true,
        fileUrl: file.fileUrl,
        originalName: file.originalName,
    })
})