// Basic task definition – no events yet.
export interface BasicTask {
  id: string;
  label: string;
  duration: number;
  dependencies: string[];
}

// Extended Task with computed start and end events.
export interface Task extends BasicTask {
  startEvent: string;
  endEvent: string;
  predecessors: string[];
  slack?: number;
}

export type Event = {
  id: string;
  incoming: string[];
  outgoing: string[];
  earliestTime: number;
  latestTime: number;
};

// Example usage:
export const basicTasks: BasicTask[] = [
  { id: "A", label: "Task A", duration: 2, dependencies: [] },
  { id: "B", label: "Task B", duration: 8, dependencies: [] },
  { id: "C", label: "Task C", duration: 5, dependencies: ["A"] },
  { id: "D", label: "Task D", duration: 2, dependencies: ["B"] },
  { id: "E", label: "Task E", duration: 6, dependencies: ["B"] },
  { id: "F", label: "Task F", duration: 5, dependencies: ["E"] },
  { id: "G", label: "Task G", duration: 3, dependencies: ["A", "D"] },
];

/**
 * Simple topological sort for tasks (using Kahn’s algorithm).
 */
function topologicalSortTasks(tasks: BasicTask[]): BasicTask[] {
  const taskMap: Record<string, BasicTask> = {};
  const indegree: Record<string, number> = {};
  tasks.forEach((task) => {
    taskMap[task.id] = task;
    indegree[task.id] = 0;
  });
  tasks.forEach((task) => {
    // For each dependency of a task, increase its indegree.
    task.dependencies.forEach(() => {
      indegree[task.id] = (indegree[task.id] || 0) + 1;
    });
  });

  const queue: BasicTask[] = [];
  for (const id in indegree) {
    if (indegree[id] === 0) {
      queue.push(taskMap[id]);
    }
  }

  const sorted: BasicTask[] = [];
  while (queue.length > 0) {
    const current = queue.shift()!;
    sorted.push(current);
    // For every task that depends on the current task, reduce its indegree.
    tasks.forEach((task) => {
      if (task.dependencies.includes(current.id)) {
        indegree[task.id]--;
        if (indegree[task.id] === 0) {
          queue.push(taskMap[task.id]);
        }
      }
    });
  }

  if (sorted.length !== tasks.length) {
    throw new Error("Cycle detected in tasks.");
  }

  return sorted;
}

/**
 * Generate the CPM network.
 * - For tasks with no dependencies, the start event is the global start ("S").
 * - For tasks with one dependency, the start event is the dependency’s end event.
 * - For tasks with multiple dependencies:
 *    - If all dependencies share the same end event, use that.
 *    - Otherwise, create a merge event (with a generated id) and add dummy tasks (duration 0) from
 *      each distinct dependency event to the merge event.
 * - Each task gets a unique end event ("e_" + task.id).
 * - Finally, tasks that are not a dependency for any other task (i.e. sinks) get a dummy task connecting
 *   their end event to the global finish event ("F").
 */
export function generateCPMNetworkFromBasicTasks(basicTasks: BasicTask[]): {
  tasks: Task[];
} {
  const sortedTasks = topologicalSortTasks(basicTasks);
  const generatedTasks: Task[] = [];
  const dummyTasks: Task[] = [];
  const endEventMapping: Record<string, string> = {}; // Maps task id to its end event.
  const mergeMapping: Record<string, string> = {}; // For tasks with multiple deps.
  let mergeCounter = 1;

  // Global start and finish event IDs.
  const globalStart = "S";
  const globalFinish = "F";

  // Process tasks in topological order.
  for (const t of sortedTasks) {
    let startEvent: string;
    let predecessors: string[] = [];

    if (t.dependencies.length === 0) {
      startEvent = globalStart;
    } else if (t.dependencies.length === 1) {
      const dep = t.dependencies[0];
      startEvent = endEventMapping[dep];
      predecessors = [dep]; // Track predecessor
      if (!startEvent) {
        throw new Error(`Dependency ${dep} not processed for task ${t.id}`);
      }
    } else {
      const depEvents = t.dependencies.map((dep) => {
        const ev = endEventMapping[dep];
        if (!ev) {
          throw new Error(`Dependency ${dep} not processed for task ${t.id}`);
        }
        return ev;
      });

      const allEqual = depEvents.every((ev) => ev === depEvents[0]);
      if (allEqual) {
        startEvent = depEvents[0];
        predecessors = t.dependencies; // Track all dependencies
      } else {
        // Merge event required
        const key = depEvents.slice().sort().join("_");
        if (mergeMapping[key]) {
          startEvent = mergeMapping[key];
        } else {
          startEvent = "M" + mergeCounter++;
          mergeMapping[key] = startEvent;
          predecessors = t.dependencies;

          // Create dummy merge tasks
          const distinctDepEvents = Array.from(new Set(depEvents));
          for (const ev of distinctDepEvents) {
            dummyTasks.push({
              id: `dummy_merge_${ev}_${startEvent}`,
              label: "",
              duration: 0,
              dependencies: [],
              startEvent: ev,
              endEvent: startEvent,
              predecessors: [
                endEventMapping[
                  t.dependencies.find((d) => endEventMapping[d] === ev) || ""
                ],
              ], // Tracking the right predecessor
            });
          }
        }
      }
    }

    const endEvent = "e_" + t.id;
    const newTask: Task = {
      ...t,
      startEvent,
      endEvent,
      predecessors,
    };
    generatedTasks.push(newTask);
    endEventMapping[t.id] = endEvent;
  }

  // Add dummy end tasks from tasks that are not dependencies for any other task.
  const successorCount: Record<string, number> = {};
  basicTasks.forEach((task) => {
    successorCount[task.id] = 0;
  });
  basicTasks.forEach((task) => {
    task.dependencies.forEach((dep) => {
      successorCount[dep] = (successorCount[dep] || 0) + 1;
    });
  });
  for (const t of generatedTasks) {
    if (successorCount[t.id] === 0) {
      dummyTasks.push({
        id: `dummy_end_${t.id}`,
        label: "",
        duration: 0,
        dependencies: [],
        startEvent: t.endEvent,
        endEvent: globalFinish,
        predecessors: [t.id], // ✅ Ensure predecessors are included
      });
    }
  }

  // Combine generated tasks and dummy tasks.
  const allTasks = [...generatedTasks, ...dummyTasks];
  return { tasks: allTasks };
}

export const tasks = generateCPMNetworkFromBasicTasks(basicTasks).tasks;
export const events = buildEventsFromTasks(tasks);

export function buildEventsFromTasks(tasks: Task[]) {
  const events: Record<string, Event> = {};

  tasks.forEach((task) => {
    // Ensure the start event exists
    if (!events[task.startEvent]) {
      events[task.startEvent] = {
        id: task.startEvent,
        incoming: [],
        outgoing: [],
        earliestTime: 0,
        latestTime: 0,
      };
    }
    // Ensure the end event exists
    if (!events[task.endEvent]) {
      events[task.endEvent] = {
        id: task.endEvent,
        incoming: [],
        outgoing: [],
        earliestTime: 0,
        latestTime: 0,
      };
    }

    // Link the task to the events
    events[task.startEvent].outgoing.push(task.id);
    events[task.endEvent].incoming.push(task.id);
  });

  return events;
}
