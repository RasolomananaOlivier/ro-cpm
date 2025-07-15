import { useCallback, useEffect } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type OnConnect,
  Edge,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import { AppNode } from "../nodes/types";
// import { CustomNode } from "../nodes/CPMNode";
import { nodeTypes } from "../nodes";
// import { edgeTypes } from "../edges";

// const nodeTypes = {
//   custom: CustomNode,
// } satisfies NodeTypes;

export default function Flow({
  initialsNodes,
  initialEdges,
}: {
  initialsNodes: AppNode[];
  initialEdges: Edge[];
}) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialsNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initialEdges);
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((edges) => addEdge(connection, edges)),
    [setEdges]
  );

  useEffect(() => {
    setNodes(initialsNodes);
    setEdges(initialEdges);
  }, [initialEdges, initialsNodes]);

  return (
    <ReactFlow
      nodes={nodes}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      edges={edges}
      // edgeTypes={edgeTypes}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      fitView
    >
      <Background />
      <MiniMap nodeStrokeWidth={3} zoomable pannable />
      <Controls />
    </ReactFlow>
  );
}
