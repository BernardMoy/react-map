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
import NewEdgeDialog from "./NewEdgeDIalog";

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
    network,
    graphRef,
    selectedNodeID,
    setSelectedNodeID,
  } = useContext(ContentContext);

  // state of the dialogs whether they are open
  const [openNewNodeDialog, setOpenNewNodeDialog] = useState(false);
  const [openNewEdgeDialog, setOpenNewEdgeDialog] = useState(false);

  // state of the clicked position
  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);

  // state of the previous node used for creating edge
  const [selectedNodeIDPrev, setselectedNodeIDPrev] = useState<IdType | null>(
    null
  );

  // set up functions to activate when the canvas is clicked
  const handleClickCanvas = (params: any) => {
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
  };

  const handleSelectNode = (params: any) => {
    if (params.nodes.length > 0) {
      // if add edge selected and selected node id already exists, open the create edge dialog
      const thisNodeID = params.nodes[0];
      console.log(addEdgeSelected);
      if (addEdgeSelected && selectedNodeID != null) {
        // set the previous node id as the already selected one
        setselectedNodeIDPrev(selectedNodeID);

        // set the current selected node id for consistency
        setSelectedNodeID(thisNodeID);

        // open dialog
        setOpenNewEdgeDialog(true);
      } else {
        // extract the first selected node and store it
        setSelectedNodeID(thisNodeID);
      }
    }
  };

  const handleDeselectNode = (params: any) => {
    // the deselect event is triggered first
    setSelectedNodeID(null);
  };

  network?.on("click", handleClickCanvas);
  network?.on("selectNode", handleSelectNode);
  network?.on("deselectNode", handleDeselectNode);

  return (
    <div
      ref={graphRef}
      style={{
        width: "100%",
        flex: 1,
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

      {/* Dialog of creating new edges */}
      <NewEdgeDialog
        open={openNewEdgeDialog}
        setOpen={setOpenNewEdgeDialog}
        nodeID1={selectedNodeIDPrev}
        nodeID2={selectedNodeID}
        edges={edges}
        setEdges={setEdges}
      />
    </div>
  );
}
