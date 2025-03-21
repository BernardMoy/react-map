import { useEffect, useRef, useState } from "react";
import { DataSet, IdType, Network, Node } from "vis-network/standalone";
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

  // id is mandatory for nodes
  const nodesTemp: Node[] = [
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

  // store the nodes here temporarily
  const [nodes, setNodes] = useState<DataSet<Node>>(new DataSet(nodesTemp));

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

  useEffect(() => {
    if (!ref.current) {
      return;
    }

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

        // create a new node
        const newNode = {
          id: Date.now(),
          label: "New",
          color: NODE_COLOR,
          chosen: { node: onNodeChosen, label: false },
          x: posX,
          y: posY,
        };

        // add the node to the state
        nodes.add(newNode);

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
