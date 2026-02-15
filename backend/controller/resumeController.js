//^ Controllers for creating New Resume & Deleting Resume & Updating Resume
// --------------------------------------------------------------------------------------------------
//* Controller for creating New Resume
// * POST:/api/resumes/create

import Resume from "../models/Resume.js";

export const createResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { title } = req.body;

    //Create New Resume
    const newResume = await Resume.create({ userId, title });
    //Return Success Message
    return res
      .status(201)
      .json({ message: "Resume Created Successfully", resume: newResume });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// --------------------------------------------------------------------------------------------------

//* Controller for Deleting Resume
//* DELETE: /api/resumes/delete

export const deleteResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;

    const deletedResume = await Resume.findOneAndDelete({
      userId,
      _id: resumeId,
    });

    if (!deletedResume) {
      return res
        .status(404)
        .json({ message: "Resume not found or unauthorized" });
    }
    //Return Success Message
    return res.status(200).json({ message: "Resume Deleted Successfully" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// --------------------------------------------------------------------------------------------------

//* Controller to get user resumes by ID
//* GET: /api/resume/get
export const getResumeByID = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;

    const resume = await Resume.findOne({ userId, _id: resumeId });

    //If resume doesn't exist at resumeId
    if (!resume) {
      return res.status(404).json({ message: "Resume Not Found" });
    }

    //Else if resume does exist then send
    resume.__v = undefined; //version key ; tracks the internal version of the document to prevent concurrent modification ; Why hide it? It is an internal database detail ; Including it makes the JSON response look "cluttered."
    resume.createdAt = undefined; // timestamp ; Why hide ? UI only cares about the content of the resume, not when the database entry was generated ; metadata that isn't relevant to the end-user.
    resume.updatedAt = undefined;
    //Return Success Message
    return res.status(201).json({ resume });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// --------------------------------------------------------------------------------------------------

//* Get user resume by id when resume is public
//* GET: /api/resumes/public
export const getPublicResumeByID = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const resume = await Resume.findOne({ public: true, _id: resumeId });

    if (!resume) {
      return res.status(404).json({ message: "Resume Not Found" });
    }
    return res.status(201).json({ resume });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// --------------------------------------------------------------------------------------------------

//* Controller for Updating Resume
//* PUT: api/resumes/update
export const updateResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId, resumeData, removeBackground } = req.body;

    let resumeDataCopy;
    if (typeof resumeData === "string") {
      resumeDataCopy = JSON.parse(resumeData);
    } else {
      resumeDataCopy = structuredClone(resumeData);
    }

    const resume = await Resume.findOneAndUpdate(
      { userId, _id: resumeId },
      resumeDataCopy,
      { new: true }
    );

    return res.status(200).json({ message: "Saved Successfully!", resume });
  } catch (error) {
    console.error("Update Error:", error);
    return res.status(400).json({ message: error.message });
  }
};
