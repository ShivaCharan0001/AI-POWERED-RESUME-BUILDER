import { Loader2, Sparkle } from "lucide-react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { useState } from "react";
import api from "../configs/api.js";

const ProfessionalSummaryForm = ({ data, onChange, setResumeData }) => {
  const { token } = useSelector((state) => state.auth);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSummary = async () => {
    try {
      setIsGenerating(true);
      const prompt = `Generate a professional summary for a resume based on the following details: ${JSON.stringify(
        data
      )}. The summary should be concise, impactful, and tailored for a resume. Limit the summary to 3-4 sentences.`;
      const response = await api.post(
        "/api/ai/enhance-pro-sum",
        { userContent: prompt },
        { headers: { Authorization: token } }
      );
      setResumeData((prev) => ({
        ...prev,
        professional_summary: response.data.enhancedContent,
      }));
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to generate summary"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3
            className="flex items-center gap-2 text-lg font-semibold 
          text-gray-900"
          >
            Professional Summary
          </h3>
          <p className="text-sm text-gray-500">
            Add your professional summary!
          </p>
        </div>
        <button
          disabled={isGenerating}
          onClick={generateSummary}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors
disabled:opacity-50"
        >
          {isGenerating ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Sparkle size={14} />
          )}
          {isGenerating ? "Enhancing" : "AI Enhance"}
        </button>
      </div>

      <div className="mt-6">
        <textarea
          rows={7}
          value={data || ""}
          onChange={(e) => onChange(e.target.value)}
          name=""
          id=""
          className="w-full p-3 px-4 mt-2 border text-sm border-gray-300 rounded-lg
           focus: ring focus:ring-blue-500 focus: border-blue-500 outline-none transition-colors resize-none"
          placeholder="Write a compelling summary about your professional skills, and career goals"
        ></textarea>
        <p className="text-xs text-gray-500 max-w-4/5 mx-auto text-center">
          Brag a little—what makes you awesome?
        </p>
      </div>
    </div>
  );
};

export default ProfessionalSummaryForm;
