import { useEffect, useRef } from "react";
import { Network } from "vis-network/standalone";

export default function GraphView() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const nodes = [
      { id: "A", label: "NodeA" },
      { id: "B", label: "NodeB" },
      { id: "C", label: "NodeC" },
    ];

    const edges = [
      { from: "A", to: "B" },
      { from: "B", to: "C" },
    ];

    // graph options
    const options = {
      autoResize: false,
      height: "100%",
      width: "100%",
      physics: {
        enabled: false,
      },
    };

    // create the graph
    const network = new Network(
      ref.current,
      { nodes: nodes, edges: edges },
      options
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
