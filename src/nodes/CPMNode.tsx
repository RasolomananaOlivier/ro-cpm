import { Handle, Node, Position, type NodeProps } from "@xyflow/react";

import { type CPMNode } from "./types";
export function CPMNode({ data }: NodeProps<CPMNode>) {
  console.log(`task label=${data.label} preds=${data.predecessors}`);
  return (
    // We add this class to use the same styles as React Flow's default nodes.
    <div
      className="react-flow__node-default"
      style={{
        height: 15 * (data.successors.length + 1),
      }}
    >
      {data.predecessors.map((predecessor, index) => (
        <Handle
          key={predecessor}
          id={predecessor} // Unique ID for each target handle
          style={{ top: index * 30 + 10 }}
          type="target"
          position={Position.Left}
        />
      ))}

      <div
        style={{
          display: "flex",
        }}
      >
        <div>Date au plus tôt : {data.earliestStart}</div>
        <div>Date au plus tard : {data.latestStart}</div>
      </div>

      {data.successors.map((successor, index) => {
        return (
          <Handle
            key={successor}
            id={successor}
            style={{
              top: index * 30 + 10,
            }}
            type="source"
            position={Position.Right}
          />
        );
      })}
    </div>
  );
}
