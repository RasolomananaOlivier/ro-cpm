import type { Node, BuiltInNode } from "@xyflow/react";

export type PositionLoggerNode = Node<{ label: string }, "position-logger">;
export type AppNode = BuiltInNode | PositionLoggerNode | CPMNode;

export type CPMNode = Node<
  {
    label: string;
    latestStart?: number;
    earliestStart?: number;
    duration: number;
  },
  "CPNNode"
>;
