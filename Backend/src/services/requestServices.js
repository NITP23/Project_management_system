import {supervisorRequest} from "../Models/supervisorRequest.js"

export const createRequest = async(requestData) => {
    const existingRequest = await supervisorRequest.findOne({
        student : requestData.student,
        supervisor : requestData.supervisor,
        status : "pending",
    });

    if(existingRequest){
        throw new Error("You have already sent a request to this supervisor.Please wait for their response.");
    }

    const request = await supervisorRequest.create(requestData);
    return await request.save();
}