import type { Edge, EdgeTypes } from "@xyflow/react";
import { tasks } from "../data";

const generateEdges = (): Edge[] => {
  const edges = [];

  for (const task of tasks) {
    for (const dependency of task.dependencies) {
      edges.push({
        id: `${dependency}->${task.id}`,
        source: dependency,
        target: task.id,
      });
    }
  }

  return edges;
};

export const initialEdges: Edge[] = generateEdges();

export const edgeTypes = {
  // Add your custom edge types here!
} satisfies EdgeTypes;
