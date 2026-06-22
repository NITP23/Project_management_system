import fs from "fs"
import ErrorHandler from "../middleWares/error.js"

export const streamDownload = (filePath, res, originalName) => {
    try{
        if(!fs.existsSync(filePath)){
            throw new ErrorHandler("File not Found",404)
        }

        res.download(filePath,originalName, (err) => {
            if(err){
                throw new ErrorHandler("Error downloading file", 500)
            }
        })
    }
    catch(err){
        if(err instanceof ErrorHandler){
            return res.status(err.statusCode).json({
                success : false,
                err : err.message,
            })
        }
        return res.status(500).json({
            success : false,
            err : "Error streaming File",
        })
    }
}