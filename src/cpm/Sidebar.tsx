import { useState } from "react";
import Select from "react-select"; // Import React Select
import { BasicTask } from "./data";

interface SidebarProps {
  tasks: BasicTask[];
  onAddTask: (task: BasicTask) => void;
  onEditTask: (task: BasicTask) => void;
  onDeleteTask: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
}) => {
  const [formTask, setFormTask] = useState<BasicTask>({
    id: "",
    label: "",
    duration: 0,
    dependencies: [],
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      onEditTask(formTask);
    } else {
      const newTask = { ...formTask, id: formTask.id || String(Date.now()) };
      onAddTask(newTask);
    }
    setFormTask({ id: "", label: "", duration: 0, dependencies: [] });
    setIsEditing(false);
  };

  const handleEditClick = (task: BasicTask) => {
    setFormTask(task);
    setIsEditing(true);
  };

  const handleDependenciesChange = (selectedOptions: any) => {
    const selectedIds = selectedOptions.map((option: any) => option.value);
    setFormTask({ ...formTask, dependencies: selectedIds });
  };

  return (
    <div
      style={{
        width: "300px",
        padding: "1rem",
        borderRight: "1px solid #ccc",
        overflowY: "auto",
      }}
    >
      <h2>Tasks</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {tasks.map((task) => (
          <li
            key={task.id}
            style={{
              marginBottom: "0.5rem",
              padding: "0.5rem",
              border: "1px solid #ddd",
            }}
          >
            <div>
              <strong>{task.label}</strong> (duration : {task.duration})
            </div>
            <div>ID: {task.id}</div>
            <div>
              Dependencies:{" "}
              {task.dependencies.length > 0
                ? task.dependencies.join(", ")
                : "None"}
            </div>
            <button onClick={() => handleEditClick(task)}>Edit</button>{" "}
            <button onClick={() => onDeleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <hr />
      <h3>{isEditing ? "Edit Task" : "Add Task"}</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Id:</label>
          <input
            type="text"
            value={formTask.id}
            onChange={(e) => setFormTask({ ...formTask, id: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Label:</label>
          <input
            type="text"
            value={formTask.label}
            onChange={(e) =>
              setFormTask({ ...formTask, label: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label>Duration:</label>
          <input
            type="number"
            value={formTask.duration}
            onChange={(e) =>
              setFormTask({ ...formTask, duration: Number(e.target.value) })
            }
            required
          />
        </div>
        <div>
          <label>Dependencies:</label>
          <Select
            isMulti
            options={tasks
              .filter((t) => t.id !== formTask.id) // Exclude the current task
              .map((t) => ({ value: t.id, label: t.label }))}
            value={tasks
              .filter((t) => formTask.dependencies.includes(t.id))
              .map((t) => ({ value: t.id, label: t.label }))}
            onChange={handleDependenciesChange}
          />
        </div>
        <button type="submit">{isEditing ? "Update" : "Add"}</button>
      </form>
    </div>
  );
};
