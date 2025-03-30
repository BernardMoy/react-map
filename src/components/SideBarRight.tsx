import {
  Drawer,
  Icon,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
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
    graph,
    setGraph,
    network,
    reset,
    setReset,
    edges,
    setEdges,
  } = useContext(SideBarRightContext);

  // error to show below button
  const [error, setError] = useState("");

  // handler for clicking of the buttons
  const handleSetStartNode = () => {
    setRouteStartNodeID(selectedNodeID);
  };

  const handleSetEndNode = () => {
    setRouteEndNodeID(selectedNodeID);
  };

  const handleFindRoute = () => {
    // initially set error to be null
    setError("");

    // check if any of the node ids are null
    if (routeStartNodeID == null || routeEndNodeID == null) {
      setError("Either the start or end node is null");
      return;
    }
    // check if start = end
    if (routeStartNodeID == routeEndNodeID) {
      setError("Start and end node cannot be the same");
      return;
    }

    // find route
    const route = graph.findShortestRoute(routeStartNodeID, routeEndNodeID);
    if (route.length === 0) {
      setError("The end node is unreachable from the start");
      return;
    }

    // select all nodes in the route
    console.log("Route: " + route);
    network?.selectNodes(route, true);

    // for each adjacent element in the route, add to the set
    const routeEdgeSet = new Set<string>();
    for (let i = 0; i < route.length - 1; i++) {
      routeEdgeSet.add(`${String(route[i])}>${String(route[i + 1])}`); // convert the idtype to hashable string
    }

    const edgeList = edges.get();
    for (const edge of edgeList) {
      console.log(edge);
    }

    console.log(routeEdgeSet);
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
      {/* Buttons */}
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        gap={CONTENT_MARGIN}
        mx={CONTENT_MARGIN}
        alignItems="center"
      >
        {/* Hint for disabled buttons when selected is null and either of the route start end are null */}
        {selectedNodeID == null &&
          (routeStartNodeID == null || routeEndNodeID == null) && (
            <Typography variant="body1">
              {" "}
              Please select a node first.
            </Typography>
          )}

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
            enabled={selectedNodeID != null}
          />
        )}

        {/* The arrow */}
        <ArrowDownwardIcon
          sx={{ scale: 1.5 }}
          color={
            routeStartNodeID != null && routeEndNodeID != null
              ? "secondary"
              : "disabled"
          }
        />

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
            enabled={selectedNodeID != null}
          />
        )}

        {/* The find route button */}
        <Box sx={{ mt: TITLE_MARGIN }}>
          <CustomButton
            text="Find route"
            variant="contained"
            color="secondary"
            startIcon={<NavigationIcon />}
            onClick={handleFindRoute}
            enabled={routeStartNodeID != null && routeEndNodeID != null} // only allow clicking when both are not null
          />
        </Box>

        {/* Error message */}
        {
          <Typography variant="body1" color="error" alignItems={"center"}>
            {error}
          </Typography>
        }
      </Box>
    </Drawer>
  );
}
