import { Handle, Node, Position, type NodeProps } from "@xyflow/react";

import { type CPMNode } from "./types";
export function CPMNode({ data }: NodeProps<CPMNode>) {
  console.log(`task label=${data.label} preds=${data.predecessors}`);
  return (
    // We add this class to use the same styles as React Flow's default nodes.
    <div
      className="react-flow__node-default"
      style={{
        height: Math.max(
          15 * (data.successors.length + 1),
          15 * (data.predecessors.length + 1)
        ),
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
          justifyContent: "space-between",
          height: "100%",
          width: "100%",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-25px",
            left: "35%",
            background: "#3CB0FDFF",
            width: "50px",
            height: "30px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {(data?.latestStart ?? 0) - (data?.earliestStart ?? 0)}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRight: "1px solid black",
            width: "100%",
            height: "100%",
          }}
        >
          {data.earliestStart}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
          }}
        >
          {data.latestStart}
        </div>
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
