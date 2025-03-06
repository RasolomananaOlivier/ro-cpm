import type { NodeTypes } from "@xyflow/react";

import { PositionLoggerNode } from "./PositionLoggerNode";
import { AppNode } from "./types";
import { Task, tasks } from "../data";
import { CPMNode } from "./CPMNode";
import { initialEdges } from "../edges";

const togologicalSort = (adj: Record<string, string[]>) => {
  const indegree: Record<string, number> = {
    ...Object.fromEntries(tasks.map((t) => [t.id, 0])),
  };

  for (const task of tasks) {
    const dependencies = adj[task.id] || [];
    for (const vertex of dependencies) {
      indegree[vertex]++;
    }
  }

  const queue: Task[] = [];
  for (const task of tasks) {
    if (indegree[task.id] === 0) {
      queue.push(task);
    }
  }

  const sortedTasks: Task[] = [];
  while (queue.length > 0) {
    const node = queue.shift();
    sortedTasks.push(node!);

    // Decrease indegree of adjacent vertices as the current node is in topological order
    for (const adjacent of adj[node!.id]) {
      indegree[adjacent]--;
      // If indegree becomes 0, push it to the queue
      if (indegree[adjacent] === 0)
        queue.push(tasks.find((t) => t.id === adjacent)!);
    }
  }

  if (sortedTasks.length !== tasks.length) {
    console.warn(
      "Tasks have circular dependencies. Sorting may not be possible."
    );
    return [];
  }

  return sortedTasks;
};

const generateAppNodes = (): AppNode[] => {
  const adj: Record<string, string[]> = {
    ...Object.fromEntries(tasks.map((t) => [t.id, []])),
  };

  for (const edge of initialEdges) {
    adj[edge.source].push(edge.target);
  }

  const sortedTasks = togologicalSort(adj);

  return sortedTasks.map((task) => {
    return {
      id: task.id,
      position: {
        x: 0, // or adjust based on group width
        y: 0,
      },
      data: { label: task.label, duration: task.duration },
      type: "CPNNode",
    };
  });
};

export const initialNodes: AppNode[] = generateAppNodes();

export const nodeTypes = {
  "position-logger": PositionLoggerNode,
  CPNNode: CPMNode,
  // Add any of your custom nodes here!
} satisfies NodeTypes;
