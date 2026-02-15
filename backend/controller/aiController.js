// ^ Controllers for AI (Gemini Version)

import Resume from "../models/Resume.js";

// --------------------------------------------------------------------------------------------------
// Helper function to call Gemini API

const callGemini = async (systemPrompt, userPrompt) => {
  const API_KEY = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemma-3-4b-it";

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;

  const payload = {
    contents: [
      {
        parts: [
          {
            text: `${systemPrompt}\n\nUser Input:\n${userPrompt}`,
          },
        ],
      },
    ],
  };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (
    result.candidates &&
    result.candidates[0]?.content?.parts?.length > 0
  ) {
    return result.candidates[0].content.parts[0].text;
  } else {
    throw new Error("No response from Gemini");
  }
};

// --------------------------------------------------------------------------------------------------
// * Controller to enhance professional summary
// * POST: /api/ai/enhance-prof-summ

export const enhanceProfessionalSummary = async (req, res) => {
  try {
    const { userContent } = req.body;

    if (!userContent) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const systemPrompt =
      "You are an expert at resume writing. Enhance the professional summary of a resume. The summary should be 2-3 sentences highlighting key skills, experience, and career objectives. Make it compelling, ATS-friendly, and return only text.";

    const enhancedContent = await callGemini(systemPrompt, userContent);

    return res.status(200).json({ enhancedContent });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// --------------------------------------------------------------------------------------------------
// * Controller to enhance job description
// * POST: /api/ai/enhance-job-desc

export const enhanceJobDescription = async (req, res) => {
  try {
    const { userContent } = req.body;

    if (!userContent) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const systemPrompt =
      "You are an expert at resume writing. Enhance the job description of a resume. The job description should be 1-2 sentences highlighting key responsibilities and achievements. Use action verbs and quantifiable results where possible. Make it ATS-friendly and return only text.";

    const enhancedContent = await callGemini(systemPrompt, userContent);

    return res.status(200).json({ enhancedContent });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// --------------------------------------------------------------------------------------------------
// * Controller for uploading resume to database
// * POST: /api/ai/upload-resume

export const uploadResume = async (req, res) => {
  try {
    const { resumeText, title } = req.body;
    const userId = req.userId;

    if (!resumeText) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const systemPrompt =
      "You are an expert at extracting structured data from resumes. Do not forget to extract the projects if available.";

const userPrompt = `
You are a strict resume data parser.

Extract structured data from the resume below and return ONLY raw JSON.

ABSOLUTE RULES:
- Do NOT wrap the response in markdown.
- Do NOT use \`\`\`json.
- Do NOT add explanations.
- Return ONLY valid JSON.
- All dates MUST be in yyyy-MM format (example: 2023-05).
- If currently working, set end_date as "".
- If no professional experience exists, return experience as [].
- NEVER fabricate experience.

SECTION RULES:
- "experience" must ONLY contain paid jobs, internships, or freelance roles.
- DO NOT include college, school, degree, CGPA, percentage, or academic entries inside "experience".
- If an entry contains words like:
  "Bachelor", "BTech", "Degree", "Intermediate", "College", "Institute", "University", "CGPA", "Percentage"
  → it MUST go inside "education".
- Do NOT duplicate entries across sections.

Resume:
${resumeText}

Return EXACTLY this JSON structure:

{
  professional_summary: "",
  skills: [],
  personal_info: {
    image: "",
    full_name: "",
    profession: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    website: ""
  },
  experience: [],
  project: [
    {
      name: "",
      type: "",
      description: ""
    }
  ],
  education: [
    {
      institution: "",
      degree: "",
      field: "",
      graduation_date: "",
      gpa: ""
    }
  ]
}
`;



    const responseText = await callGemini(systemPrompt, userPrompt);

    // ----------------------------
    // CLEAN GEMINI RESPONSE
    // ----------------------------

    let cleanedText = responseText.trim();

    // Remove markdown wrapping if present
    if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();
    }

    // Extract only JSON part
    const firstBrace = cleanedText.indexOf("{");
    const lastBrace = cleanedText.lastIndexOf("}");

    if (firstBrace !== -1 && lastBrace !== -1) {
      cleanedText = cleanedText.substring(firstBrace, lastBrace + 1);
    }

    const parsedData = JSON.parse(cleanedText);
    console.log(parsedData);

    const newResume = await Resume.create({
      ...parsedData,
      userId,
      title,
    });

    res.json({ resumeId: newResume._id });
  } catch (error) {
    console.error("Upload Resume Error:", error);
    return res.status(400).json({ message: error.message });
  }
};
