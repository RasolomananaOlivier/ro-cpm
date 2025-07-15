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
      const newTask = { ...formTask, id: String(Date.now()) };
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
      <h2>Tâches</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {tasks.map((task) => (
          <li
            key={task.id}
            style={{
              marginBottom: "0.5rem",
              padding: "0.5rem",
              border: "1px solid #ddd",
              borderRadius: "8px",
            }}
          >
            <div>
              <strong>{task.label}</strong> (durée : {task.duration})
            </div>
            <div>
              Dépendances:{" "}
              {task.dependencies.length > 0
                ? getDependeciesLabel(tasks, task.dependencies)
                : "Début"}
            </div>
            <button
              onClick={() => handleEditClick(task)}
              className="button button-primary"
            >
              Modifier
            </button>{" "}
            <button
              onClick={() => onDeleteTask(task.id)}
              className="button button-danger"
            >
              Supprimer
            </button>
          </li>
        ))}
      </ul>
      <hr />
      <h3>{isEditing ? "Modifier la tâche" : "Ajouter une tâche"}</h3>
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label>Nom de la tâche</label>
          <input
            type="text"
            className="input"
            value={formTask.label}
            onChange={(e) =>
              setFormTask({ ...formTask, label: e.target.value })
            }
            required
          />
        </div>
        <div className="input-container">
          <label>Durée de la tâche</label>
          <input
            type="number"
            className="input"
            value={formTask.duration}
            onChange={(e) =>
              setFormTask({ ...formTask, duration: Number(e.target.value) })
            }
            required
          />
        </div>
        <div className="input-container">
          <label>Dépendances</label>
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
        <button type="submit" className="button button-primary">
          {isEditing ? "Modifier" : "Ajouter"}
        </button>
      </form>
    </div>
  );
};

const getDependeciesLabel = (tasks: BasicTask[], dependencies: string[]) => {
  return tasks
    .filter((t) => dependencies.includes(t.id))
    .map((t) => t.label)
    .join(", ");
};
