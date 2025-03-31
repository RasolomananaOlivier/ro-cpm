import type { Node, BuiltInNode } from "@xyflow/react";
import { Task } from "../data";

export type AppNode = BuiltInNode | CPMNode;

export type CPMNode = Node<
  {
    label: string;
    latestStart?: number;
    earliestStart?: number;
    duration: number;
    successors: string[];
    predecessors: string[];
  },
  "CPNNode"
>;
