export type Task = {
  id: string;
  label: string;
  duration: number;
  dependencies: string[];
};

export const tasks: Task[] = [
  {
    id: "task1",
    label: "Task 1",
    duration: 5,
    dependencies: [],
  },
  {
    id: "task3",
    label: "Task 3",
    duration: 4,
    dependencies: ["task2"],
  },
  {
    id: "task2",
    label: "Task 2",
    duration: 3,
    dependencies: ["task1"],
  },

  {
    id: "task4",
    label: "Task 4",
    duration: 2,
    dependencies: ["task3"],
  },
  {
    id: "task6",
    label: "Task 6",
    duration: 2,
    dependencies: ["task3"],
  },
  {
    id: "task5",
    label: "Task 5",
    duration: 1,
    dependencies: ["task4", "task3", "task6"],
  },
];
