import { Box, Typography } from "@mui/material";
import { CONTENT_MARGIN, TITLE_MARGIN } from "./Values";
import CustomButton from "./CustomButton";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import NewNodeDialog from "./NewNodeDialog";

export default function TopBar() {
  // state of the dialogs whether they are open
  const [openNewNodeDialog, setOpenNewNodeDialog] = useState(false);
  const handleNewNodeDialogClose = () => setOpenNewNodeDialog(false);

  const onAddNodeClicked = () => {
    console.log("Add node clicked");
    setOpenNewNodeDialog(true);
  };

  const onAddLineClicked = () => {
    console.log("Add line clicked");
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
          variant={"outlined"}
          color={"primary"}
          startIcon={<AddIcon />}
          onClick={onAddNodeClicked}
        />

        <CustomButton
          text={"Add Connection"}
          variant={"outlined"}
          color={"primary"}
          startIcon={<AddIcon />}
          onClick={() => {}}
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
