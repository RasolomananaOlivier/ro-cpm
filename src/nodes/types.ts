import type { Node, BuiltInNode } from "@xyflow/react";
import { Task } from "../data";

export type PositionLoggerNode = Node<{ label: string }, "position-logger">;
export type AppNode = BuiltInNode | PositionLoggerNode | CPMNode | CircleNode;

export type CPMNode = Node<
  {
    label: string;
    earliestFinish?: number;
    earliestStart?: number;
    duration: number;
    successors: Task[];
  },
  "CPNNode"
>;

export type CircleNode = Node<{ label: string }, "CircleNode">;
