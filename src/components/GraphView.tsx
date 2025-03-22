import { useContext, useEffect, useRef, useState } from "react";
import { DataSet, Edge, IdType, Network, Node } from "vis-network/standalone";
import {
  BACKGROUND_COLOR,
  NODE_COLOR,
  NODE_COLOR_HOVERED,
  NODE_COLOR_SELECTED,
} from "./Values";
import { ContentContext } from "../pages/Home";
import NewNodeDialog from "./NewNodeDialog";

// modify the values of the node when hovered or selected through this function
export const onNodeChosen = function (
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

export default function GraphView() {
  // get the context
  const {
    nodes,
    setNodes,
    nodeList,
    setNodeList,
    edges,
    setEdges,
    addNodeSelected,
    setAddNodeSelected,
    addEdgeSelected,
    setAddEdgeSelected,
  } = useContext(ContentContext);

  const ref = useRef<HTMLDivElement>(null);

  // state of the dialogs whether they are open
  const [openNewNodeDialog, setOpenNewNodeDialog] = useState(false);

  // state of the clicked position
  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);

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
      // only perform action if add node selected is true
      if (!addNodeSelected) {
        return;
      }
      if (params.nodes.length == 0 && params.edges.length == 0) {
        // update the x and y positions
        setPosX(params.pointer.canvas.x);
        setPosY(params.pointer.canvas.y);

        // open the dialog and add new node there
        setOpenNewNodeDialog(true);
      }
    });

    return () => network.destroy();
  }, [addNodeSelected]); // re attach the add node selected listener, otherwise the conditional clicking will not work
  return (
    <div
      ref={ref}
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: BACKGROUND_COLOR,
      }}
    >
      {/* Dialog of creating new node */}
      <NewNodeDialog
        open={openNewNodeDialog}
        setOpen={setOpenNewNodeDialog}
        nodes={nodes}
        setNodes={setNodes}
        nodeList={nodeList}
        setNodeList={setNodeList}
        posX={posX}
        posY={posY}
      />
    </div>
  );
}
