import { Box, Typography } from "@mui/material";
import { CONTENT_MARGIN, TITLE_MARGIN } from "./Values";
import CustomButton from "./CustomButton";
import AddIcon from "@mui/icons-material/Add";
import { useContext, useState } from "react";
import NewNodeDialog from "./NewNodeDialog";
import { TopBarContext } from "../pages/Home";

export default function TopBar() {
  // get the context
  const {
    addNodeSelected,
    setAddNodeSelected,
    addEdgeSelected,
    setAddEdgeSelected,
  } = useContext(TopBarContext);

  // state of the dialogs whether they are open
  const [openNewNodeDialog, setOpenNewNodeDialog] = useState(false);
  const handleNewNodeDialogClose = () => setOpenNewNodeDialog(false);

  const onAddNodeClicked = () => {
    setAddNodeSelected(!addNodeSelected);
    setAddEdgeSelected(false);
  };
  const onAddConnectionClicked = () => {
    setAddEdgeSelected(!addEdgeSelected);
    setAddNodeSelected(false);
  };

  const onAddLineClicked = () => {};

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
      </Box>

      {/* Dialogs */}
      <NewNodeDialog
        open={openNewNodeDialog}
        onClose={handleNewNodeDialogClose}
      ></NewNodeDialog>
    </Box>
  );
}
