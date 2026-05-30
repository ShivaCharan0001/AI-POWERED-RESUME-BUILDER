import { FileStack, Plus, Trash2 } from "lucide-react";

const ProjectForm = ({ data, onChange }) => {
  const addProject = () => {
    const newProject = {
      name: "",
      type: "",
      description: "",
    };
    onChange([...data, newProject]);
  };

  const removeProject = (index) => {
    const updated = data.filter((_, i) => i !== index);
    onChange(updated);
  };

  const updateProject = (index, field, value) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3
            className="flex items-center gap-2 text-lg font-semibold 
          text-gray-900"
          >
            Projects
          </h3>
          <p className="text-sm text-gray-500"> Add your project details!</p>
        </div>
        <button
          onClick={addProject}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 
          rounded hover:bg-purple-200 transition-colors disabled:opacity-50"
        >
          <Plus size={14} /> Add Project
        </button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <FileStack
            size={60}
            className="w-12 h-12 mx-auto mb-3 text-gray-500"
          />
          <p>No Projects added yet.</p>
          <p className="text-sm">Click "Add Project" to get started</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((project, index) => (
            <div
              key={index}
              className="p-4 border border-gray-300 rounded-lg space-y-3"
            >
              <div className="flex justify-between items-start">
                <h4>Project #{index + 1}</h4>
                <button
                  onClick={() => removeProject(index)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="grid md:grid-cols-1 gap-3">
                <input
                  type="text"
                  placeholder="Project Name"
                  className="px-3 py-2 text-sm rounded-lg"
                  value={project.name || ""}
                  onChange={(e) => updateProject(index, "name", e.target.value)}
                />

                <input
                  type="text"
                  placeholder="Project Type"
                  className="px-3 py-2 text-sm rounded-lg"
                  value={project.type || ""}
                  onChange={(e) => updateProject(index, "type", e.target.value)}
                />
                <textarea
                  rows={4}
                  placeholder="Describe your project"
                  className="px-3 py-2 text-sm rounded-lg w-full resize-none border border-gray-300"
                  value={project.description || ""}
                  onChange={(e) =>
                    updateProject(index, "description", e.target.value)
                  }
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectForm;
