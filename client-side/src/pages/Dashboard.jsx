import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FilePenLineIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  UploadCloudIcon,
  XIcon,
  UploadCloud,
  LoaderCircleIcon,
} from "lucide-react";
import { useSelector } from "react-redux";
import api from "../configs/api";
import toast from "react-hot-toast";
import pdfToText from "react-pdftotext";

const Dashboard = () => {
  const colors = [
    "#6A4C93", // Royal Purple
    "#3FA7A5", // Teal / Aqua
    "#2E8B57", // Vibrant Magenta
    "#4B7C59", // Forest Green
    "#5C6BC0", // Indigo Blue
  ];
  const [allResumes, setAllResumes] = useState([]);
  const [showCreateResume, setShowCreateResume] = useState(false);
  const [showUploadResume, setShowUploadResume] = useState(false);

  const [title, setTitle] = useState("");
  const [resume, setResume] = useState(null);

  const [editResumeId, setEditResumeId] = useState("");
  const [hoverIndex, setHoverIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [loadingStage, setLoadingStage] = useState("");
  const { user, token } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  // -----------------------------------------------------------------------------------------------------
  // * LOAD ALL RESUMES ON DASHBOARD
  const loadAllResumes = async () => {
    try {
      const { data } = await api.get("/api/users/resumes", {
        headers: {
          Authorization: token,
        },
      });
      setAllResumes(data.resumes);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  // -----------------------------------------------------------------------------------------------------
  // * CREATE RESUME
  const createResume = async (event) => {
    try {
      event.preventDefault();
      const { data } = await api.post(
        "/api/resumes/create",
        { title },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setAllResumes([...allResumes, data.resume]);
      setTitle("");
      setShowCreateResume(false);
      navigate(`/app/builder/${data.resume._id}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  // -----------------------------------------------------------------------------------------------------
  // * UPLOAD RESUME

  const uploadResume = async (event) => {
    event.preventDefault();

    if (!resume) {
      toast.error("Please select a PDF file first.");
      return;
    }

    setIsLoading(true);
    try {
      setLoadingStage("Reading PDF...");
      const resumeText = await pdfToText(resume);

      setLoadingStage("Uploading to server...");
      const { data } = await api.post(
        "/api/ai/upload-resume",
        { title, resumeText },
        { headers: { Authorization: token } }
      );

      setLoadingStage("Finalizing...");

      if (data.resume) {
        setAllResumes((prev) => [...prev, data.resume]);
      }

      setTitle("");
      setResume(null);
      setShowUploadResume(false);
      toast.success("Resume uploaded and parsed successfully!");
      navigate(`/app/builder/${data.resumeId}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
    setIsLoading(false);
  };

  const editTitle = async (event) => {
    try {
      event.preventDefault();
      const { data } = await api.put(
        `/api/resumes/update`,
        { resumeId: editResumeId, resumeData: { title } },
        {
          headers: { Authorization: token },
        }
      );

      setAllResumes(
        allResumes.map((resume) =>
          resume._id === editResumeId ? { ...resume, title } : resume
        )
      );
      setTitle("");
      setEditResumeId("");
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  // -----------------------------------------------------------------------------------------------------
  // * DELETE RESUME
  const deleteResume = async (resumeId) => {
    try {
      const confirm = window.confirm(
        "Are you sure you want to delete this resume?"
      );
      if (confirm) {
        const { data } = await api.delete(`/api/resumes/delete/${resumeId}`, {
          headers: { Authorization: token },
        });
        setAllResumes(allResumes.filter((resume) => resume._id !== resumeId));
        toast.success(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    loadAllResumes();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* <p className="text-2xl font-medium mb-6 bg-gradient-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent sm:hidden">
      Welcome, John Doe
    </p> */}

      {/* Top buttons */}
      <div className="flex flex-wrap gap-4 mb-6 justify-center">
        <button
          onClick={() => setShowCreateResume(true)}
          className="w-full sm:w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-violet-700 hover:shadow-lg transition-all duration-300 cursor-pointer"
        >
          <PlusIcon className="w-11 h-11 p-2.5 bg-linear-to-br from-lime-300 to-emerald-600 text-white rounded-full transition-all group-hover:scale-110" />
          <p className="text-sm group-hover:text-indigo-700 transition-all">
            Create Resume
          </p>
        </button>

        <button
          onClick={() => setShowUploadResume(true)}
          className="w-full sm:w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-violet-700 hover:shadow-lg transition-all duration-300 cursor-pointer"
        >
          <UploadCloudIcon className="w-11 h-11 p-2.5 bg-linear-to-br from-purple-300 to-purple-500 text-white rounded-full transition-all group-hover:scale-110" />
          <p className="text-sm group-hover:text-indigo-700 transition-all">
            Upload Existing
          </p>
        </button>
      </div>

      <hr className="border-slate-300 my-6" />
      {/* Resume cards */}
      <div className="flex flex-wrap justify-center gap-4">
        {allResumes.map((resume, index) => {
          const baseColor = colors[index % colors.length];

          return (
            <div
              onClick={() => navigate(`/app/builder/${resume._id}`)}
              key={index}
              onMouseEnter={() => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex(null)}
              className="group relative w-full sm:w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 border transition-all duration-300 cursor-pointer"
              style={{
                background:
                  hoverIndex === index ? `${baseColor}20` : `${baseColor}10`,
                borderColor:
                  hoverIndex === index ? baseColor : baseColor + "40",
                boxShadow:
                  hoverIndex === index
                    ? "0 6px 20px rgba(0,0,0,0.2)"
                    : "0 2px 6px rgba(0,0,0,0.1)",
              }}
            >
              <FilePenLineIcon
                className="w-7 h-7 group-hover:scale-110 transition-all"
                style={{ color: baseColor }}
              />
              <p
                className="text-sm text-center px-2 transition-all"
                style={{ color: baseColor }}
              >
                {resume.title}
              </p>
              <p
                className="absolute bottom-1 text-[11px] text-center px-2 transition-all duration-300"
                style={{ color: baseColor + "90" }}
              >
                Updated on {new Date(resume.updatedAt).toLocaleDateString()}
              </p>

              {/* Icons appear only on hover */}
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute top-1 right-1 hidden group-hover:flex gap-2"
              >
                <TrashIcon
                  onClick={() => deleteResume(resume._id)}
                  className="w-7 h-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors"
                />
                <PencilIcon
                  onClick={() => {
                    setEditResumeId(resume._id);
                    setTitle(resume.title);
                  }}
                  className="w-7 h-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors"
                />
              </div>
            </div>
          );
        })}
      </div>

      <div>
        {showCreateResume && (
          <form
            onSubmit={createResume}
            onClick={() => setShowCreateResume(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
            >
              <h2 className="text-xl font-bold mb-4">Create a Resume</h2>
              <input
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                type="text"
                placeholder="Enter Resume Title"
                className="px-4 py-2 focus:border-green-600 ring-green-600 mb-4 w-full"
                required
              />
              <button className="w-full py-2 bg-purple-600 text-white rounded hover:bg-fuchsia-700 transition-colors">
                Create Resume
              </button>
              <XIcon
                className="absolute top-4 right-4 text-slate-400
hover: text-slate-600 cursor-pointer transition-colors"
                onClick={() => {
                  setShowCreateResume(false);
                  setTitle("");
                }}
              />
            </div>
          </form>
        )}
        {showUploadResume && (
          <form
            onSubmit={uploadResume}
            onClick={() => setShowUploadResume(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
            >
              <h2 className="text-xl font-bold mb-4">Upload a Resume</h2>
              <input
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                type="text"
                placeholder="Enter Resume Title"
                className="px-4 py-2 focus:border-green-600 ring-green-600 mb-4 w-full"
                required
              />

              <div>
                <label
                  htmlFor="resume-input"
                  className="block text-sm text-slate-700"
                >
                  Select Resume File (.pdf only)
                  <div
                    className="flex flex-col items-center justify-center gap-2 border group text-slate-400 
                  border-slate-400 border-dashed rounded-md p-4 py-10 my-4 hover:border-green-500 hover:text-green-700 
                  cursor-pointer transition-colors"
                  >
                    {resume ? (
                      <p className="text-purple-700">{resume.name}</p>
                    ) : (
                      <>
                        <UploadCloud className="size-14 stroke-1" />
                        <p>Upload Resume</p>
                      </>
                    )}
                  </div>
                </label>
                <input
                  type="file"
                  id="resume-input"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => setResume(e.target.files[0])}
                />
              </div>
              <button
                className={`w-full py-2 bg-purple-600 text-white rounded hover:bg-fuchsia-700 transition-colors flex items-center justify-center gap-2`}
                disabled={isLoading}
              >
                {isLoading && (
                  <LoaderCircleIcon className="animate-spin size-4 text-white " />
                )}
                {isLoading ? loadingStage : "Upload Resume"}{" "}
              </button>
              <XIcon
                className="absolute top-4 right-4 text-slate-400
hover: text-slate-600 cursor-pointer transition-colors"
                onClick={() => {
                  setShowUploadResume(false);
                  setTitle("");
                }}
              />
            </div>
          </form>
        )}
        {editResumeId && (
          <form
            onSubmit={editTitle}
            onClick={() => setEditResumeId("")}
            className="fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
            >
              <h2 className="text-xl font-bold mb-4">Edit Resume Title</h2>
              <input
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                type="text"
                placeholder="Enter Resume Title"
                className="px-4 py-2 focus:border-green-600 ring-green-600 mb-4 w-full"
                required
              />
              <button className="w-full py-2 bg-purple-600 text-white rounded hover:bg-fuchsia-700 transition-colors">
                Update
              </button>
              <XIcon
                className="absolute top-4 right-4 text-slate-400
hover: text-slate-600 cursor-pointer transition-colors"
                onClick={() => {
                  setEditResumeId(false);
                  setTitle("");
                }}
              />
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
export default Dashboard;
