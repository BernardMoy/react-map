import { useEffect, useRef } from "react";
import { Network } from "vis-network/standalone";

export default function GraphView() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const nodes = [
      { id: 1, label: "Node 1" },
      { id: 2, label: "Node 2" },
      { id: 3, label: "Node 3" },
      { id: 4, label: "Node 4" },
    ];

    const edges = [
      { from: 1, to: 2 },
      { from: 1, to: 3 },
      { from: 2, to: 4 },
    ];

    // create the graph
    const network = new Network(
      ref.current,
      { nodes: nodes, edges: edges },
      { autoResize: false }
    );

    return () => network.destroy();
  }, []);
  return (
    <div
      ref={ref}
      style={{ width: "100%", height: "100%", border: "1px solid gray" }}
    />
  );
}
