import express from "express";
import { downloadFile } from "../controllers/projectController.js";
import { isAuthenticated, isAuthorized } from "../middleWares/authMiddleware.js";

const router = express.Router();

router.get("/:projectId/files/:fileId/download", isAuthenticated, downloadFile);



export default router;