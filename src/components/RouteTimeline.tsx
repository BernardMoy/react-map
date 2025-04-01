import { IdType } from "vis-network";
import { Line } from "../pages/Home";
import { Box, Typography, useTheme } from "@mui/material";
import { CONTENT_MARGIN } from "./Values";
import { theme } from "@chakra-ui/react";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
} from "@mui/lab";

// the purpose of this interface is simply to display those data
export interface Leg {
  line: Line;
  stations: { node: IdType; timeElapsed: number }[];
}

export default function RouteTimeline({ line, stations }: Leg) {
  // get the text color that ensures it shows up on top of the line color
  // black or white
  const lineNameTextColor = useTheme().palette.getContrastText(line.lineColor);

  // number of stops is length of stations - 1
  const numberOfStops = stations.length - 1;

  // time if the time elapsed at end - start
  const totalTime =
    stations[stations.length - 1].timeElapsed - stations[0].timeElapsed;

  return (
    <Box display="flex" flexDirection={"column"} gap={CONTENT_MARGIN}>
      {/* Line details */}
      <Box
        display="flex"
        gap={CONTENT_MARGIN}
        padding={CONTENT_MARGIN}
        sx={{
          backgroundColor: line.lineColor,
        }}
        color={lineNameTextColor}
      >
        <Typography variant="body1" flexGrow={1}>
          {line.lineName}
        </Typography>
        <Typography variant="body1">{totalTime}</Typography>
        <Typography variant="body1">({numberOfStops} stops)</Typography>
      </Box>

      {/* Route details */}
      <Timeline>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>Eat</TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>Code</TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot />
          </TimelineSeparator>
          <TimelineContent>Sleep</TimelineContent>
        </TimelineItem>
      </Timeline>
    </Box>
  );
}
