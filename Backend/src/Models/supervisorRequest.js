import mongoose, { mongo } from "mongoose";

const supervisorRequestSchema = new mongoose.Schema(
{
    student : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : [true, "studentId  is required"]
    },
    supervisor : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : [true, "supervisor Id  is required"]
    },
    message :{
        type :String,
        required : [true, "Message is required"],
        trim : true,
        maxlength : [250 , "message cannot be greater than 250 characters"],
    },
    
    status :{
        type :String,
        enum : ["pending" , "accepted", "rejected"],
        default : "pending",
    },
},
{
    timestamps : true
}
);


// Indexing for better query performance
supervisorRequestSchema.index({student : 1})
supervisorRequestSchema.index({supervisor : 1})
supervisorRequestSchema.index({status : 1})


export const supervisorRequest = mongoose.models.supervisorRequest || mongoose.model("supervisorRequest" , supervisorRequestSchema);