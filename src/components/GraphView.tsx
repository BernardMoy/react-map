import { useContext, useEffect, useRef, useState } from "react";
import { DataSet, Edge, IdType, Network, Node } from "vis-network/standalone";
import {
  BACKGROUND_COLOR,
  NODE_COLOR,
  NODE_COLOR_HOVERED,
  NODE_COLOR_SELECTED,
} from "./Values";
import { ContentContext } from "../pages/Home";

export default function GraphView() {
  // get the context
  const {
    nodes,
    setNodes,
    edges,
    setEdges,
    addNodeSelected,
    setAddNodeSelected,
    addEdgeSelected,
    setAddEdgeSelected,
  } = useContext(ContentContext);

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
          id: Date.now(), // generate a unique id for each node (Mandatory)
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
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: BACKGROUND_COLOR,
      }}
    />
  );
}
