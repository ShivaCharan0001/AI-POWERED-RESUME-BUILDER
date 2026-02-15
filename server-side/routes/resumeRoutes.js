import express from "express";
import protect from "../middlewares/authMiddleware.js";
import {
  createResume,
  deleteResume,
  getPublicResumeByID,
  getResumeByID,
  updateResume,
} from "../controller/resumeController.js";

const resumeRouter = express.Router();

resumeRouter.post("/create", protect, createResume);
resumeRouter.put("/update", protect, updateResume);
resumeRouter.delete("/delete/:resumeId", protect, deleteResume);
resumeRouter.get("/get/:resumeId", protect, getResumeByID);
resumeRouter.get("/public/:resumeId", getPublicResumeByID); //protect middleware removed because this is for public resumes

export default resumeRouter;
