import { Box, Typography } from "@mui/material";
import { CONTENT_MARGIN } from "./Values";
import CustomButton from "./CustomButton";

export default function TopBar() {
  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", justifyContent: "start" }}
    >
      {/* Title text */}
      <Typography variant="h3" m={CONTENT_MARGIN}>
        Text goes here
      </Typography>

      {/* row of buttons */}

      <Box
        sx={{ display: "flex", flexDirection: "row", justifyContent: "start" }}
      >
        <CustomButton
          text={"Add Node"}
          variant={"outlined"}
          onClick={() => {}}
        />
      </Box>
    </Box>
  );
}
