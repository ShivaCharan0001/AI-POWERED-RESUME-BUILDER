import { useState } from "react";
import { FilePenLine, Settings2, Share2 } from "lucide-react";

const Features = () => {
  const features = [
    {
      title: "Real-Time Editing",
      description:
        "Edit sections, rearrange content, and see instant updates to your resume preview.",
      iconColor: "green",
      icon: <FilePenLine size={40} className=" text-teal-800" />,
    },
    {
      title: "Customizable Templates",
      description:
        "Choose from a wide variety of sleek and professional templates.",
      iconColor: "orange",
      icon: <Settings2 size={40} className="text-purple-800" />,
    },
    {
      title: "Live Link Sharing",
      description:
        "Generate a shareable live link to easily showcase your professional resume online.",
      iconColor: "violet",
      icon: <Share2 size={40} className="text-indigo-800" />,
    },
  ];

  const [hoverIndex, setHoverIndex] = useState(null);

  return (
    <div
      id="features"
      className="flex flex-col items-center mt-2 mb-10 scroll-mt-12"
    >
      <div className="flex justify-center mt-2 px-4 md:px-0">
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
