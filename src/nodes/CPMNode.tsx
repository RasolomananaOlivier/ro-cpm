import { Handle, Position, type NodeProps } from "@xyflow/react";

import { type CPMNode } from "./types";

export function CPMNode({ data }: NodeProps<CPMNode>) {
  return (
    // We add this class to use the same styles as React Flow's default nodes.
    <div className="react-flow__node-default">
      <Handle type="target" position={Position.Left} />
      {data.label && <div>{data.label}</div>}

      <div>
        {data.earliestStart && <div>Earliest Start: {data.earliestStart}</div>}{" "}
        |{data.latestStart && <div>Latest Start: {data.latestStart}</div>}
      </div>

      <Handle type="source" position={Position.Right} />
    </div>
  );
}
