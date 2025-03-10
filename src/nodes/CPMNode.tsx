import { Handle, Position, type NodeProps } from "@xyflow/react";

import { type CPMNode } from "./types";

export function CPMNode({ data }: NodeProps<CPMNode>) {
  return (
    // We add this class to use the same styles as React Flow's default nodes.
    <div
      className="react-flow__node-default"
      style={{
        height: 15 * (data.successors.length + 1),
      }}
    >
      <Handle type="target" position={Position.Left} />

      <div
        style={{
          display: "flex",
        }}
      >
        {data.earliestFinish && (
          <div>Date au plus tôt : {data.earliestFinish}</div>
        )}
        {/* {data.earliestStart != null && <div>{data.earliestStart} </div>} */}
      </div>

      {data.successors.map((successor, index) => {
        return (
          <Handle
            key={successor.id}
            id={successor.id}
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
