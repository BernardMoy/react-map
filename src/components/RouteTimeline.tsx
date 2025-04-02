import { IdType } from "vis-network";
import { Line } from "../pages/Home";
import { Box, Typography, useTheme } from "@mui/material";
import { CONTENT_MARGIN } from "./Values";
import CommitIcon from "@mui/icons-material/Commit";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
  timelineOppositeContentClasses,
  TimelineOppositeContent,
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
    <Box display="flex" flexDirection={"column"}>
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
        <CommitIcon sx={{ color: lineNameTextColor }} />
        <Typography
          variant="body1"
          flexGrow={1}
          sx={{ wordBreak: "break-word" }} // only break the line name if it is long
        >
          {line.lineName}
        </Typography>
        <Typography variant="body1">{totalTime} mins</Typography>
        <Typography variant="body1">
          {numberOfStops > 1
            ? `(${numberOfStops} stops)`
            : `(${numberOfStops} stop)`}
        </Typography>
      </Box>

      {/* Route details */}
      <Timeline
        sx={{
          [`& .${timelineOppositeContentClasses.root}`]: {
            flex: 0.2,
          },
        }}
      >
        {/* First item */}
        <TimelineItem>
          <TimelineOppositeContent color="textSecondary">
            Start
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot sx={{ bgcolor: "black" }} />
            <TimelineConnector sx={{ bgcolor: line.lineColor }} />
          </TimelineSeparator>
          <TimelineContent>
            <Box display="flex" flexDirection="row" gap={CONTENT_MARGIN}>
              <Typography
                variant="body1"
                flexGrow={1}
                sx={{ wordBreak: "break-word" }}
              >
                {stations[0].node}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {stations[0].timeElapsed} min elapsed
              </Typography>
            </Box>
          </TimelineContent>
        </TimelineItem>

        {/* Subsequent items */}
        {stations.slice(1, stations.length - 1).map((value, index) => (
          <TimelineItem>
            <TimelineOppositeContent color="textSecondary">
              Stop {index + 1}
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot sx={{ bgcolor: "black" }} />
              <TimelineConnector sx={{ bgcolor: line.lineColor }} />
            </TimelineSeparator>
            <TimelineContent>
              <Box display="flex" flexDirection="row" gap={CONTENT_MARGIN}>
                <Typography
                  variant="body1"
                  flexGrow={1}
                  sx={{ wordBreak: "break-word" }}
                >
                  {value.node}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {value.timeElapsed} min elapsed
                </Typography>
              </Box>
            </TimelineContent>
          </TimelineItem>
        ))}

        {/* Last item without the connector */}
        <TimelineItem>
          <TimelineOppositeContent color="textSecondary">
            Stop {stations.length - 1}
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot sx={{ bgcolor: "black" }} />
          </TimelineSeparator>
          <TimelineContent>
            <Box display="flex" flexDirection="row" gap={CONTENT_MARGIN}>
              <Typography
                variant="body1"
                flexGrow={1}
                sx={{ wordBreak: "break-word" }}
              >
                {stations[stations.length - 1].node}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {stations[stations.length - 1].timeElapsed} min elapsed
              </Typography>
            </Box>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    </Box>
  );
}
