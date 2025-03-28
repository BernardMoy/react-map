import {
  Drawer,
  Icon,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { useContext, useState } from "react";
import { Box } from "@mui/material";
import CustomButton from "./CustomButton";
import {
  BACKGROUND_COLOR,
  CONTENT_MARGIN,
  DRAWER_WIDTH,
  TITLE_MARGIN,
} from "./Values";
import { SideBarContext } from "../pages/Home";
import CircleIcon from "@mui/icons-material/Circle";

export default function SideBar() {
  // get the context
  const { lines, setLines, graph, setGraph, network, tabNumber, setTabNumber } =
    useContext(SideBarContext);

  // function when the two header buttons are clicked
  const onStationsClicked = () => {
    setTabNumber(0);
  };

  const onLinesClicked = () => {
    setTabNumber(1);
  };

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      slotProps={{
        paper: {
          // the width of the drawer is overwritten here
          sx: {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            position: "relative",
          },
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
        }}
      >
        {/* The two buttons specifying display nodes of edges */}
        <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
          <CustomButton
            text={"Stations"}
            variant={tabNumber === 0 ? "contained" : "outlined"}
            color={"secondary"}
            onClick={onStationsClicked}
          />
          <CustomButton
            text={"Lines"}
            variant={tabNumber === 1 ? "contained" : "outlined"}
            color={"secondary"}
            onClick={onLinesClicked}
          />
        </Box>

        <List>
          {tabNumber === 0
            ? graph.getNode().map((value, index) => (
                // unique keys are necessary here
                <ListItem
                  key={`station ${index}`}
                  onClick={() => {
                    // set focus for the node
                    network?.focus(value);
                  }}
                  sx={{
                    cursor: "pointer",
                    ":hover": {
                      backgroundColor: BACKGROUND_COLOR,
                    },
                  }}
                >
                  <ListItemText primary={value} />
                </ListItem>
              ))
            : lines.map((value, index) => (
                // display a list of lines with name and color
                <ListItem key={`line ${index}`}>
                  <Box display="flex" gap={CONTENT_MARGIN} alignItems="center">
                    <CircleIcon style={{ color: value.lineColor }} />
                    <ListItemText primary={value.lineName} />
                  </Box>
                </ListItem>
              ))}
        </List>

        {/* The text saying there are no stations or no lines */}
        <Box display="flex" justifyContent="center" my={TITLE_MARGIN}>
          {tabNumber === 0
            ? graph.getNode().length === 0 && (
                <Typography variant="body1" color="gray">
                  There are no stations.
                </Typography>
              )
            : lines.length === 0 && (
                <Typography variant="body1" color="gray">
                  There are no lines.
                </Typography>
              )}
        </Box>
      </Box>
    </Drawer>
  );
}
