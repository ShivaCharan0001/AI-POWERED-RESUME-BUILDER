import { useState } from "react";
import { Brain, FilePenLine, Settings2, Zap } from "lucide-react";
import Title from "./Title.jsx";

const Features = () => {
  const features = [
    {
      title: "Smart Resume Generation",
      description:
        "Get instant insights into your finances with live dashboardsCreate professional, polished resumes in seconds with AI-powered formatting and content suggestions.",
      iconColor: "violet",
      icon: <Brain size={45} className="text-fuchsia-900" />,
    },
    {
      title: "Real-Time Editing",
      description:
        "End-to-end Edit sections, rearrange content, and see instant updates to your resume preview.",
      iconColor: "green",
      icon: <FilePenLine size={40} className=" text-teal-800" />,
    },
    {
      title: "Customizable Templates",
      description:
        "Choose from aSelect from a wide range of sleek, professional templates that are fully optimized for Applicant Tracking Systems (ATS).",
      iconColor: "orange",
      icon: <Settings2 size={40} className="text-purple-800" />,
    },
  ];

  const [hoverIndex, setHoverIndex] = useState(null);

  return (
    <div
      id="features"
      className="flex flex-col items-center my-10 scroll-mt-12"
    >
      <div className="flex justify-center mt-4">
        <div className="inline-flex items-center gap-2 text-sm text-violet-800 bg-indigo-400/10 border border-indigo-200 rounded-full px-4 py-1 w-max    ">
          <Zap width={14} />
          <span>Simple process</span>
        </div>
      </div>
      <Title
        title="Build your resume"
        description="Our streamlined process helps you create a professional
      resume in minutes with intelligent AI-powered tools and features"
      />
      <div className="flex justify-center mt-20 px-4 md:px-0">
        <div className="flex flex-wrap justify-center gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              onMouseEnter={() => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex(null)}
              className="flex flex-col text-center items-center justify-center rounded-xl p-6 border gap-6 max-w-sm transition-all duration-300 cursor-pointer"
              style={{
                borderColor:
                  hoverIndex === index
                    ? feature.iconColor === "violet"
                      ? "#7F22FE"
                      : feature.iconColor === "green"
                      ? "#00A63E"
                      : "#611acc"
                    : "#e5e7eb",
                backgroundColor: hoverIndex === index ? "#f0efff" : "#ffffff",
                boxShadow:
                  hoverIndex === index
                    ? "0 6px 20px rgba(0,0,0,0.2)"
                    : "0 2px 6px rgba(0,0,0,0.1)",
              }}
            >
              <div className="p-6 aspect-square rounded-full flex items-center justify-center">
                {feature.icon}
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-semibold text-slate-700">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
