import { IdType } from "vis-network";
import { Line } from "../pages/Home";
import { Box, Typography, useTheme } from "@mui/material";
import { CONTENT_MARGIN } from "./Values";
import { theme } from "@chakra-ui/react";

// the purpose of this interface is simply to display those data
export interface Leg {
  line: Line;
  stations: { node: IdType; timeElapsed: number }[];
}

export default function RouteTimeline({ line, stations }: Leg) {
  // get the text color that ensures it shows up on top of the line color
  // black or white
  const lineNameTextColor = useTheme().palette.getContrastText(line.lineColor);

  return (
    // line name
    <Box
      display="flex"
      gap={CONTENT_MARGIN}
      padding={CONTENT_MARGIN}
      sx={{
        backgroundColor: line.lineColor,
      }}
      color={lineNameTextColor}
    >
      <Typography variant="body1"> {line.lineName} </Typography>
    </Box>
  );
}
