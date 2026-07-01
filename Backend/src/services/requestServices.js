import { supervisorRequest } from "../Models/supervisorRequest.js";
import { User } from "../Models/user.js";
import { Project } from "../Models/project.js";

export const createRequest = async (requestData) => {
    const existingRequest = await supervisorRequest.findOne({
        student: requestData.student,
        supervisor: requestData.supervisor,
        status: "pending",
    });

    if (existingRequest) {
        throw new Error("You have already sent a request to this supervisor.Please wait for their response.");
    }

    const request = await supervisorRequest.create(requestData);
    return await request.save();
}

export const getAllRequests = async (filters) => {
    const requests = await supervisorRequest.find(filters)
        .populate("student", "name email")
        .populate("supervisor", "name email")
        .sort({ createdAt: -1 })
    const total = await supervisorRequest.countDocuments(filters);

    return { requests, total };
}

export const acceptRequest = async (requestId, supervisorId) => {
    const request = await supervisorRequest.findById(requestId)
        .populate("student", "name email supervisor project")
        .populate("supervisor", "name email assignedStudents maxStudents")

    if (!request) {
        throw new Error("Request not found");
    }
    if (request.supervisor._id.toString() !== supervisorId.toString()) {
        throw new Error("You are not authorized to accept this request");
    }
    if (request.status !== "pending") {
        throw new Error("Request is already accepted or rejected");
    }
    
    // 1. Accept the supervisor request
    request.status = "accepted";
    await request.save();

    const studentId = request.student._id;

    // 2. Assign supervisor to student
    const student = await User.findById(studentId);
    if (student) {
        student.supervisor = supervisorId;
        await student.save();
    }

    // 3. Add student to supervisor's assignedStudents list
    const supervisor = await User.findById(supervisorId);
    if (supervisor && !supervisor.assignedStudents.includes(studentId)) {
        supervisor.assignedStudents.push(studentId);
        await supervisor.save();
    }

    // 4. Update student's Project status to 'approved', assign supervisor, and link project to user
    const project = await Project.findOne({ student: studentId }).sort({ createdAt: -1 });
    if (project) {
        project.status = "approved";
        project.supervisor = supervisorId;
        await project.save();

        if (student && !student.project) {
            student.project = project._id;
            await student.save();
        }
    }

    return request;
}

export const rejectRequest = async (requestId, supervisorId) => {
    const request = await supervisorRequest.findById(requestId)
        .populate("student", "name email")
        .populate("supervisor", "name email");

    if (!request) {
        throw new Error("Request not found");
    }
    if (request.supervisor._id.toString() !== supervisorId.toString()) {
        throw new Error("You are not authorized to reject this request");
    }
    if (request.status !== "pending") {
        throw new Error("Request is already accepted or rejected");
    }
    request.status = "rejected";
    await request.save();
    return request;
}