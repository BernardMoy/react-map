import { Box, Typography } from "@mui/material";
import { CONTENT_MARGIN, TITLE_MARGIN } from "./Values";
import CustomButton from "./CustomButton";
import AddIcon from "@mui/icons-material/Add";

const onAddNodeClicked = () => {
  console.log("Add node clicked");
};

const onAddLineClicked = () => {
  console.log("Add line clicked");
};

export default function TopBar() {
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
      <Typography variant="h3">Text goes here</Typography>

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
          startIcon={<AddIcon />}
          onClick={onAddNodeClicked}
        />

        <CustomButton
          text={"Add Line"}
          variant={"outlined"}
          startIcon={<AddIcon />}
          onClick={onAddLineClicked}
        />
      </Box>
    </Box>
  );
}
