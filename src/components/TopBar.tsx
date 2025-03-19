import { Box, Typography } from "@mui/material";
import { CONTENT_MARGIN, TITLE_MARGIN } from "./Values";
import CustomButton from "./CustomButton";
import AddIcon from "@mui/icons-material/Add";
import { useContext, useState } from "react";
import NewLineDialog from "./NewLineDialog";
import { TopBarContext } from "../pages/Home";

export default function TopBar() {
  // get the context
  const {
    addNodeSelected,
    setAddNodeSelected,
    addEdgeSelected,
    setAddEdgeSelected,
    lines,
    setLines,
  } = useContext(TopBarContext);

  // state of the dialogs whether they are open
  const [openNewLineDialog, setOpenNewLineDialog] = useState(false);
  const handleNewLineDialogClose = () => setOpenNewLineDialog(false);

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
      <NewLineDialog
        open={openNewLineDialog}
        onClose={handleNewLineDialogClose}
        lines={lines}
        setLines={setLines}
      ></NewLineDialog>
    </Box>
  );
}
