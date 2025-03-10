export type Task = {
  id: string;
  label: string;
  duration: number;
  dependencies: string[];
  earliestStart?: number;
  earliestFinish?: number;
};

export const tasks: Task[] = [
  { id: "A", label: "Task A", duration: 2, dependencies: [] },
  { id: "B", label: "Task B", duration: 8, dependencies: [] },
  { id: "C", label: "Task C", duration: 5, dependencies: ["A"] },
  { id: "D", label: "Task D", duration: 2, dependencies: ["B"] },
  { id: "E", label: "Task E", duration: 6, dependencies: ["B"] },
  { id: "F", label: "Task F", duration: 5, dependencies: ["E"] },
  { id: "G", label: "Task G", duration: 3, dependencies: ["A", "D"] },
];

// export const tasks: Task[] = [
//   {
//     id: "task1",
//     label: "Task 1",
//     duration: 5,
//     dependencies: [],
//   },
//   {
//     id: "task3",
//     label: "Task 3",
//     duration: 4,
//     dependencies: ["task2"],
//   },
//   {
//     id: "task2",
//     label: "Task 2",
//     duration: 3,
//     dependencies: ["task1"],
//   },

//   {
//     id: "task4",
//     label: "Task 4",
//     duration: 2,
//     dependencies: ["task3"],
//   },
//   {
//     id: "task6",
//     label: "Task 6",
//     duration: 2,
//     dependencies: ["task3"],
//   },
//   {
//     id: "task5",
//     label: "Task 5",
//     duration: 1,
//     dependencies: ["task4", "task6"],
//   },
// ];
