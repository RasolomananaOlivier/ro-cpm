import { useEffect, useState } from "react";
import { Edge } from "@xyflow/react";
import dagre from "@dagrejs/dagre";

import "@xyflow/react/dist/style.css";

import { AppNode } from "./nodes/types";
import { computeCPM } from "./cpm/utils";
import {
  BasicTask,
  basicTasks,
  buildEventsFromTasks,
  generateCPMNetworkFromBasicTasks,
} from "./cpm/data";
import Flow from "./cpm/Flow";
import { Sidebar } from "./cpm/Sidebar";

const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

const nodeWidth = 300;
const nodeHeight = 100;

const getLayoutedElements = (
  nodes: AppNode[],
  edges: Edge[],
  direction = "LR"
) => {
  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const newNode = {
      ...node,
      targetPosition: isHorizontal ? "left" : "top",
      sourcePosition: isHorizontal ? "right" : "bottom",
      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };

    return newNode;
  });

  return { nodes: newNodes, edges };
};

type ProcessCPMType =
  | {
      nodes: AppNode[];
      edges: Edge[];
      tasks: BasicTask[];
    }
  | undefined;
const processCPM = (tasksToProcess: BasicTask[]): ProcessCPMType => {
  try {
    const { tasks } = generateCPMNetworkFromBasicTasks(tasksToProcess);
    const events = buildEventsFromTasks(tasks);

    const { events: computedEvents, tasks: computedTasks } = computeCPM(
      events,
      tasks
    );

    const initialNodes: AppNode[] = Object.values(computedEvents).map(
      (event) => ({
        id: event.id,
        type: "CPNNode",
        data: {
          label: event.id,
          earliestStart: event.earliestTime,
          latestStart: event.latestTime,
          duration: 5,
          successors: event.outgoing,
          predecessors: event.incoming,
        },
        position: { x: Math.random() * 400, y: Math.random() * 400 }, // replace with a layout algorithm
      })
    );

    const initialEdges: Edge[] = computedTasks.map((task) => ({
      id: task.id,
      source: task.startEvent,
      sourceHandle: task.id, // Matches the source node's handle rendered by successors
      target: task.endEvent,
      targetHandle: task.id, // Matches the target node's handle rendered by predecessors
      label: `${task.label} (${task.duration})`,
      animated: task.slack === 0,
    }));

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      initialNodes,
      initialEdges
    );

    return {
      edges: layoutedEdges,
      // @ts-expect-error
      nodes: layoutedNodes,
      tasks: computedTasks,
    };
  } catch (error) {
    alert(error);
  }
};

export default function App() {
  const [bt, setbt] = useState<BasicTask[]>(basicTasks);

  const [finalEdges, setFinalEdges] = useState<Edge[]>([]);
  const [finalNodes, setFinalNodes] = useState<AppNode[]>([]);

  useEffect(() => {
    const processedTasks = processCPM(bt);
    if (processedTasks) {
      setFinalEdges(processedTasks.edges);
      setFinalNodes(processedTasks.nodes);
    }
  }, []);

  // Handlers for adding, editing, and deleting tasks.
  const handleAddTask = (task: BasicTask) => {
    const newTasks = [...bt, task];

    const processedTasks = processCPM(newTasks);

    if (processedTasks) {
      setbt(newTasks);
      setFinalEdges(processedTasks.edges);
      setFinalNodes(processedTasks.nodes);
    }
  };

  const handleEditTask = (updatedTask: BasicTask) => {
    const tasksUpdated = bt.map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    );

    const processedTasks = processCPM(tasksUpdated);

    if (processedTasks) {
      setbt(tasksUpdated);
      setFinalEdges(processedTasks.edges);
      setFinalNodes(processedTasks.nodes);
    }
  };

  const handleDeleteTask = (id: string) => {
    // Remove deps
    const removedDeps = bt.map((task) => {
      if (task.dependencies.includes(id)) {
        return {
          ...task,
          dependencies: task.dependencies.filter((dep) => dep !== id),
        };
      }
      return task;
    });

    // Remove the task
    const updated = removedDeps.filter((task) => task.id !== id);

    const processedTasks = processCPM(updated);

    if (processedTasks) {
      setbt(updated);
      setFinalEdges(processedTasks.edges);
      setFinalNodes(processedTasks.nodes);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar
        tasks={bt}
        onAddTask={handleAddTask}
        onEditTask={handleEditTask}
        onDeleteTask={handleDeleteTask}
      />
      <div style={{ flexGrow: 1 }}>
        <Flow initialEdges={finalEdges} initialsNodes={finalNodes} />
      </div>
    </div>
  );
}
