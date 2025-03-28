import {
  Drawer,
  Icon,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { useContext, useState } from "react";
import { Box } from "@mui/material";
import CustomButton from "./CustomButton";
import NavigationIcon from "@mui/icons-material/Navigation";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  BACKGROUND_COLOR,
  CONTENT_MARGIN,
  DRAWER_WIDTH,
  TITLE_MARGIN,
} from "./Values";
import { SideBarRightContext } from "../pages/Home";
import CircleIcon from "@mui/icons-material/Circle";

export default function SideBarRight() {
  // get the context
  const {
    routeStartNodeID,
    setRouteStartNodeID,
    routeEndNodeID,
    setRouteEndNodeID,
    selectedNodeID,
  } = useContext(SideBarRightContext);

  // handler for clicking of the buttons
  const handleSetStartNode = () => {};
  const handleSetEndNode = () => {};
  const handleFindRoute = () => {
    console.log(routeStartNodeID);
    console.log(routeEndNodeID);
  };

  return (
    <Drawer
      variant="permanent"
      anchor="right"
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
        {/* Buttons */}
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          gap={CONTENT_MARGIN}
          mx={CONTENT_MARGIN}
          alignItems="center"
        >
          {/* Input for route start */}
          {routeStartNodeID != null ? (
            <Box
              display={"flex"}
              flexDirection="row"
              justifyContent="center"
              gap={CONTENT_MARGIN}
              alignItems={"center"}
            >
              <Typography
                variant="body1"
                sx={{ wordWrap: "break-word", wordBreak: "break-word" }}
              >
                {routeStartNodeID}
              </Typography>
              <IconButton
                aria-label="delete"
                color="error"
                onClick={() => {
                  setRouteStartNodeID(null);
                }}
              >
                <CancelIcon />
              </IconButton>
            </Box>
          ) : (
            <CustomButton
              text="Set as start node"
              variant="outlined"
              color="secondary"
              onClick={handleSetStartNode}
            />
          )}

          {/* The arrow */}
          <ArrowDownwardIcon sx={{ scale: 1.5 }} color="disabled" />

          {/* Input for the end node */}
          {routeEndNodeID != null ? (
            <Box
              display={"flex"}
              flexDirection="row"
              justifyContent="center"
              gap={CONTENT_MARGIN}
              alignItems={"center"}
            >
              <Typography
                variant="body1"
                sx={{ wordWrap: "break-word", wordBreak: "break-word" }}
              >
                {routeEndNodeID}
              </Typography>
              <IconButton
                aria-label="delete"
                color="error"
                onClick={() => {
                  setRouteEndNodeID(null);
                }}
              >
                <CancelIcon />
              </IconButton>
            </Box>
          ) : (
            <CustomButton
              text="Set as end node"
              variant="outlined"
              color="secondary"
              onClick={handleSetEndNode}
            />
          )}

          {/* The find route button */}
          <Box sx={{ my: TITLE_MARGIN }}>
            <CustomButton
              text="Find route"
              variant="contained"
              color="secondary"
              startIcon={<NavigationIcon />}
              onClick={handleFindRoute}
              enabled={routeStartNodeID != null && routeEndNodeID != null} // only allow clicking when both are not null
            />
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
}
