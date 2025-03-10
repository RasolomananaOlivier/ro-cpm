import { useState } from "react";
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
      // If no id provided, generate one (for simplicity using Date.now())
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
          <label>Dependencies (comma separated IDs):</label>
          <input
            type="text"
            value={formTask.dependencies.join(",")}
            onChange={(e) =>
              setFormTask({
                ...formTask,
                dependencies: e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter((s) => s),
              })
            }
          />
        </div>
        <button type="submit">{isEditing ? "Update" : "Add"}</button>
      </form>
    </div>
  );
};
