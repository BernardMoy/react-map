import { useEffect, useRef } from "react";
import { IdType, Network } from "vis-network/standalone";
import { NODE_COLOR, NODE_COLOR_HOVERED, NODE_COLOR_SELECTED } from "./Values";

export default function GraphView() {
  const ref = useRef<HTMLDivElement>(null);

  // modify the values of the node when hovered or selected through this function
  const onNodeChosen = function (
    values: any,
    id: IdType,
    selected: boolean,
    hovering: boolean
  ) {
    if (selected) {
      values.color = NODE_COLOR_SELECTED;
      values.borderWidth = 2;
      values.borderColor = "black";
    } else if (hovering) {
      values.color = NODE_COLOR_HOVERED;
      values.borderWidth = 2;
    }
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
        chosen: { node: onNodeChosen, label: false },
      },
      {
        id: "B",
        label: "NodeB",
        color: NODE_COLOR,
        chosen: { node: onNodeChosen, label: false },
      },
      {
        id: "C",
        label: "NodeC",
        color: NODE_COLOR,
        chosen: { node: onNodeChosen, label: false },
      },
    ];

    const edges = [
      { from: "A", to: "B", label: "5", color: "#ffb6bd" },
      { from: "B", to: "C", label: "5", color: "#ffb6bd" },
    ];

    // graph options
    const options = {
      autoResize: true,
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

    // set up functions to activate when the canvas is clicked
    network.on("click", (params) => {
      if (params.nodes.length == 0 && params.edges.length == 0) {
        // get the x and y positions
        const posX = params.pointer.canvas.x;
        const posY = params.pointer.canvas.y;

        console.log(`(${posX}, ${posY})`);
      }
    });

    return () => network.destroy();
  }, []);
  return (
    <div
      ref={ref}
      style={{ width: "100%", height: "100%", border: "1px solid gray" }}
    />
  );
}
