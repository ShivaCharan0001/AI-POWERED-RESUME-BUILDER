import { Check, Layout } from "lucide-react";
import React from "react";

const TemplateSelector = ({ selectedTemplate, onChange }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const templates = [
    {
      id: "classic",
      name: "Classic",
      preview:
        "A clean, traditional resume format with clear sections and professional typography",
    },
    {
      id: "modern",
      name: "Modern",
      preview:
        "A sleek, contemporary design with bold headings and a focus on readability",
    },
    {
      id: "minimal-image",
      name: "Minimal Image",
      preview:
        "A minimalist layout that incorporates a profile image for a personal touch",
    },
    {
      id: "minimal",
      name: "Minimal",
      preview:
        "A simple, elegant design that emphasizes content with ample white space",
    },
  ];
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-sm text-green-600 bg-gradient-to-br
       from-violet-100 to-violet-200 ring-green-300 hover:ring transition-all px-3 py-2 rounded-lg"
      >
        <Layout className="size-4" />
        <span className="max-sm:hidden">Template</span>
      </button>
      {isOpen && (
        <div className="absolute top-full w-80 p-3 mt-2 space-y-3 z-10 bg-white rounded-md border border-gray-200 shadow-sm">
          {templates.map((template) => (
            <div
              key={template.id}
              className={`relative p-3 border rounded-md cursor-pointer
                transition-all ${
                  selectedTemplate === template.id
                    ? "border-indigo-900 bg-violet-100"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              onClick={() => {
                onChange(template.id);
                setIsOpen(false);
              }}
            >
              {selectedTemplate === template.id && (
                <div className="absolute top-2 right-2">
                  <div className="size-5 bg-blue-400 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                </div>
              )}
              <div className="space-y-1">
                <h4 className="font-medium text-gray-800">{template.name}</h4>
                <div className="mt-2 p-2 bg-violet-50 rounded text-xs text-gray-600 italic">
                  {template.preview}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TemplateSelector;
