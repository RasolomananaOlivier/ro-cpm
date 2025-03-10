import { Edge } from "@xyflow/react";
import { AppNode } from "../nodes/types";
import { events, tasks } from "./data";

export const initialNodes: AppNode[] = Object.values(events).map((event) => ({
  id: event.id,
  data: {
    label: `Event ${event.id}\nES: ${event.earliestTime}\nLS: ${event.latestTime}`,
  },
  position: { x: Math.random() * 400, y: Math.random() * 400 }, // replace with a layout algorithm
}));

export const initialEdges: Edge[] = tasks.map((task) => ({
  id: task.id,
  source: task.startEvent,
  target: task.endEvent,
  label: `${task.label} (${task.duration})`,
  animated: task.slack === 0, // for visualizing the critical path
}));
