import { Task } from "./data";

export const findSuccessors = (taskId: string, tasks: Task[]): Task[] => {
  return tasks.filter((task) => task.dependencies.includes(taskId));
};
