import mongoose, { mongo } from "mongoose";

const projectSchema = new mongoose.Schema({
    student :{
        type :mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : [true, "studentId is required"]
    },
    supervisor :{
        type :mongoose.Schema.Types.ObjectId,
        ref : "User",
        default : null
    },
    title :{
        type :String,
        required : [true, "Project Title is required"],
        maxLength : [200, "Title cannot be exceed from 200 characters"]
    },
    description :{
        type :String,
        required : [true, "Project description is required"],
        trim : true,
        maxLength : [2000,  "description must not more than 2000 characters"]
    },
    status : {
        type : String,
        default : "pending",
        enum : ["pending","approved","rejected","completed"]
    },
    files:[
        {
            fileType : {
                type : String,
                required : true,
            },
            fileUrl : {
                type : String,
                required : true,                
            },
            originalName : {
                type : String,
                required : true,               
            },
            uploadedAt : {
                type : Date,
                default : Date.now(),
            }
        }
    ],
    feedback : [
        {
            supervisorId : {
                type :mongoose.Schema.Types.ObjectId,
                ref : "User",
                required : true
            },
            type :{
                type : String,
                enum : ["positive","negative","general"],
                default : "general"
            },
            title : {
                type : String,
                required : true
            },
            message : {
                type : String,
                required : true,
                maxLength : [1000,  "Feedback message must not more than 1000 characters"]
            }
        }
    ],
    deadline : {
        type : Date,
    }
},{
    timestamps : true
});


// Indexing for better query performance
projectSchema.index({student : 1})
projectSchema.index({supervisor : 1})
projectSchema.index({status : 1})


export const Project = mongoose.models.Project || mongoose.model("Project" , projectSchema)