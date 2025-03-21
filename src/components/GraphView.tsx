import { useEffect, useRef } from "react";
import { IdType, Network } from "vis-network/standalone";
import { NODE_COLOR } from "./Values";

export default function GraphView() {
  const ref = useRef<HTMLDivElement>(null);

  const onHover = function (
    values: any,
    id: IdType,
    selected: boolean,
    hovering: boolean
  ) {
    values.color = "#ffffff";
  };

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    // id is mandatory for nodes
    const nodes = [
      {
        id: "A",
        label: "NodeA",
        color: NODE_COLOR,
        chosen: { node: onHover, label: false },
      },
      {
        id: "B",
        label: "NodeB",
        color: NODE_COLOR,
        chosen: { node: onHover, label: false },
      },
      {
        id: "C",
        label: "NodeC",
        color: NODE_COLOR,
        chosen: { node: onHover, label: false },
      },
    ];

    const edges = [
      { from: "A", to: "B", color: "#ffb6bd" },
      { from: "B", to: "C", color: "#ffb6bd" },
    ];

    // graph options
    const options = {
      autoResize: false,
      height: "100%",
      width: "100%",
      physics: {
        enabled: false,
      },
      interaction: {
        hover: true,
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
