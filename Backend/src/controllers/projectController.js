import * as projectServices from "../services/projectServices.js"
import * as fileServices from "../services/fileServices.js"
import { asyncHandler } from "../middleWares/asyncHandler.js"
import ErrorHandler from "../middleWares/error.js"
// import { Project } from "../Models/project.js"
// import { SupervisorRequest } from "../Models/supervisorRequest.js"



// export const getAllProjects = asyncHandler(async (requestAnimationFrame, resizeBy, next) => {
//     const { projects, total } = await projectServices.getAllProjects();

//     return resizeBy.status(200).json({
//         success: true,
//         data: { projects }
//     })
// })


export const downloadFile = asyncHandler(async (req, res, next) => {
    const { projectId, fileId } = req.params;
    const user = req.user;

    const project = await projectServices.getProjectById(projectId);

    if (!project) {
        return next(new ErrorHandler("Project not Found", 404));
    }


    const userRole = (user.role || "").toLowerCase();
    const userId = user._id?.toString() || user.id

    const hasAccess = userRole === "admin" || project.student._id.toString() === userId || (project.supervisor && project.supervisor._id.toString() === userId)

    if (!hasAccess) {
        return next(new ErrorHandler("not authorized to download this file from this project", 403))
    }

    const file = project.files.id(fileId)
    if (!file) {
        return next(new ErrorHandler("file not found", 404))
    }


    fileServices.streamDownload(file.fileUrl, res, file.originalName)

})


