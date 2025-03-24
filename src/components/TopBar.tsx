import { Box, Typography } from "@mui/material";
import { CONTENT_MARGIN, TITLE_MARGIN } from "./Values";
import CustomButton from "./CustomButton";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useContext, useState } from "react";
import NewLineDialog from "./NewLineDialog";
import { TopBarContext } from "../pages/Home";
import DeleteNodeDialog from "./DeleteNodeDialog";

export default function TopBar() {
  // get the context
  const {
    addNodeSelected,
    setAddNodeSelected,
    addEdgeSelected,
    setAddEdgeSelected,
    lines,
    setLines,
    network,
    selectedNodeID,
    setSelectedNodeID,
    nodeList,
    setNodeList,
    selectedEdgeID,
    setSelectedEdgeID,
  } = useContext(TopBarContext);

  // state of the dialogs whether they are open
  const [openNewLineDialog, setOpenNewLineDialog] = useState(false);

  const [openDeleteNodeDialog, setOpenDeleteNodeDialog] = useState(false);

  // functions when the ADD buttons are clicked
  const onAddNodeClicked = () => {
    setAddNodeSelected(!addNodeSelected);
    setAddEdgeSelected(false);
  };
  const onAddConnectionClicked = () => {
    setAddEdgeSelected(!addEdgeSelected);
    setAddNodeSelected(false);
  };

  const onAddLineClicked = () => {
    setOpenNewLineDialog(true);
  };

  const onDeleteNodeClicked = () => {
    setOpenDeleteNodeDialog(true);
  };

  const onDeleteEdgeClicked = () => {};

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        gap: TITLE_MARGIN,
      }}
    >
      {/* Title text */}
      <Typography variant="h3">Graph Modeling</Typography>

      {/* row of buttons */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "start",
          gap: CONTENT_MARGIN,
        }}
      >
        <CustomButton
          text={"Add Node"}
          variant={addNodeSelected ? "contained" : "outlined"}
          color={"primary"}
          startIcon={<AddIcon />}
          onClick={onAddNodeClicked}
        />

        <CustomButton
          text={"Add Connection"}
          variant={addEdgeSelected ? "contained" : "outlined"}
          color={"primary"}
          startIcon={<AddIcon />}
          onClick={onAddConnectionClicked}
        />

        <CustomButton
          text={"Add Line"}
          variant={"outlined"}
          color={"primary"}
          startIcon={<AddIcon />}
          onClick={onAddLineClicked}
        />

        {/* Show delete button if a node is selected */}
        {selectedNodeID != null && (
          <CustomButton
            text={"Delete node"}
            variant={"outlined"}
            color={"error"}
            startIcon={<DeleteIcon />}
            onClick={onDeleteNodeClicked}
          />
        )}

        {/* Show delete button if an edge is selected */}
        {selectedEdgeID != null && (
          <CustomButton
            text={"Delete edge"}
            variant={"outlined"}
            color={"error"}
            startIcon={<DeleteIcon />}
            onClick={onDeleteEdgeClicked}
          />
        )}
      </Box>

      {/* Dialogs */}
      <NewLineDialog
        open={openNewLineDialog}
        setOpen={setOpenNewLineDialog} // this is necessary to control the open state
        lines={lines}
        setLines={setLines}
      ></NewLineDialog>

      <DeleteNodeDialog
        open={openDeleteNodeDialog}
        setOpen={setOpenDeleteNodeDialog}
        network={network}
        selectedNodeID={selectedNodeID}
        setSelectedNodeID={setSelectedNodeID}
        nodeList={nodeList}
        setNodeList={setNodeList}
      />
    </Box>
  );
}
