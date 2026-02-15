import { CheckIcon, Palette } from "lucide-react";
import React from "react";

const ColorPicker = ({ selectedColor, onChange }) => {
  const colors = [
    { name: "Deep Violet", value: "#6B46C1" },
    { name: "Lavender", value: "#B794F4" },
    { name: "Mint Green", value: "#9AE6B4" },
    { name: "Emerald Green", value: "#2F855A" },
    { name: "Soft Lilac", value: "#D6BCFA" },
    { name: "Plum", value: "#805AD5" },
    { name: "Teal", value: "#319795" },
    { name: "Magenta", value: "#D53F8C" },
    { name: "Soft Forest Green", value: "#4CAF50" },
    { name: "Charcoal", value: "#2D3748" },
  ];

  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-sm text-purple-600 bg-linear-to-br
       from-violet-100 to-violet-200 ring-purple-300 hover:ring transition-all px-3 py-2 rounded-lg"
      >
        <Palette size={16} />
        <span className="max-sm:hidden">Accent</span>
      </button>

      {isOpen && (
        <div
          className="grid grid-cols-4 w-60 gap-2 absolute top-full left-0
right-0 p-3 mt-2 z-10 bg-white rounded-md border border-gray-200 shadow-sm"
        >
          {colors.map((color) => (
            <div
              key={color.value}
              className="relative cursor-pointer group flex flex-col"
              onClick={() => {
                onChange(color.value);
                setIsOpen(false);
              }}
            >
              <div
                className="w-12 h-12 rounded-full border-2 border-transparent group-hover:border-black/25 
           transition-colors"
                style={{ backgroundColor: color.value }}
              />
              {selectedColor === color.value && (
                <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                  <CheckIcon className="size-5 text-white" />
                </div>
              )}
              <p className="text-xs text-center mt-1 text-gray-600">
                {color.name}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
