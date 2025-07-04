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
import FlagIcon from "@mui/icons-material/Flag";
import ViewHeadlineIcon from "@mui/icons-material/ViewHeadline";
import {
  BACKGROUND_COLOR,
  CONTENT_MARGIN,
  DRAWER_WIDTH,
  GRAY_COLOR,
  NODE_COLOR,
  NODE_COLOR_ROUTE_END,
  NODE_COLOR_ROUTE_HIGHLIGHTED,
  NODE_COLOR_ROUTE_START,
  TITLE_MARGIN,
} from "./Values";
import { SideBarRightContext } from "../pages/Home";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import { IdType } from "vis-network";
import ViewRouteDialog from "./ViewRouteDialog";
import { Destination } from "./Graph";

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
    nodes,
    setNodes,
    edges,
    setEdges,
    edgeTempMap,
    setEdgeTempMap,
    nodeTempSet,
    setNodeTempSet,
    route,
    setRoute,
    unit,
  } = useContext(SideBarRightContext);

  // error to show below button
  const [error, setError] = useState("");

  // dialog state
  const [openViewRouteDialog, setOpenViewRouteDialog] = useState(false);

  // handler for clicking of the buttons
  const handleSetStartNode = () => {
    setRouteStartNodeID(selectedNodeID);
  };

  const handleSetEndNode = () => {
    setRouteEndNodeID(selectedNodeID);
  };

  const handleSwitchDirection = () => {
    const temp = routeStartNodeID;
    setRouteStartNodeID(routeEndNodeID);
    setRouteEndNodeID(temp);
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
    if (routeStartNodeID === routeEndNodeID) {
      setError("Start and end node cannot be the same");
      return;
    }

    // find route
    const fullRoute = graph.findShortestRoute(routeStartNodeID, routeEndNodeID);
    setRoute(fullRoute);
    const start = fullRoute.getStart();
    const route = fullRoute.getRoute();
    if (route.length === 0) {
      setError("The end node is unreachable from the start");
      return;
    }
    console.log("Route: " + JSON.stringify(route));

    /* reset the node temp set and edge temp map  */
    // restore the nodes in the node temp set by restoring the original node colors
    nodeTempSet.forEach((value: IdType) => {
      nodes.update({ id: value, color: NODE_COLOR });
    });
    // clear the node temp set
    setNodeTempSet(new Set());

    // restore the edges in the edge temp map by setting visible and restore its color
    edgeTempMap.forEach((value: string, key: IdType) => {
      edges.update({ id: key, color: value, hidden: false });
    });
    // clear the edge temp map
    setEdgeTempMap(new Map());

    /* NODES */
    for (const destination of route.slice(0, route.length - 1)) {
      // the first one is already sliced
      // change the node color
      nodes.update({
        id: destination.node,
        color: NODE_COLOR_ROUTE_HIGHLIGHTED,
      });

      // add the node to the temp set
      setNodeTempSet((prev) => {
        const newSet = new Set(prev);
        newSet.add(destination.node);
        return newSet;
      });
    }

    // change the start and end node to their respective colors
    nodes.update({ id: routeStartNodeID, color: NODE_COLOR_ROUTE_START });
    nodes.update({ id: routeEndNodeID, color: NODE_COLOR_ROUTE_END });
    setNodeTempSet((prev) => {
      const newSet = new Set(prev);
      newSet.add(routeStartNodeID);
      newSet.add(routeEndNodeID);
      return newSet;
    });

    /* EDGES */
    // for each adjacent element in the route, add to the set
    const routeEdgeSet = new Set<string>();
    for (let i = 0; i < route.length - 1; i++) {
      routeEdgeSet.add(`${String(route[i].node)}>${String(route[i + 1].node)}`); // convert the idtype to hashable string
    }
    routeEdgeSet.add(`${String(start)}>${String(route[0].node)}`); // add the start node

    const edgeList = edges.get();
    const selectEdgeList = [];
    for (const edge of edgeList) {
      // convert to hashable string format
      const edgeString = `${String(edge.from)}>${String(edge.to)}`;
      const edgeStringBackward = `${String(edge.to)}>${String(edge.from)}`;

      if (routeEdgeSet.has(edgeString)) {
        // mark true if the edge is in the route edge set
        selectEdgeList.push(edge.id);
      } else {
        // add to edge temp map
        setEdgeTempMap((prev) => {
          const newMap = new Map(prev);
          newMap.set(edge.id, edge.color as string);
          return newMap;
        });

        if (routeEdgeSet.has(edgeStringBackward)) {
          // hide backward edges so that they dont overlap
          edges.update({ id: edge.id, hidden: true });
        } else {
          // else set the edge color to gray
          edges.update({ id: edge.id, color: GRAY_COLOR });
        }
      }
    }
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
            <Typography variant="body1">Please select a node first.</Typography>
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
            <Box display="flex" gap={CONTENT_MARGIN} alignItems="center">
              <NavigationIcon style={{ color: NODE_COLOR_ROUTE_START }} />
              <Typography
                variant="body1"
                sx={{ wordWrap: "break-word", wordBreak: "break-word" }}
              >
                {routeStartNodeID}
              </Typography>
            </Box>

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
            <Box display="flex" gap={CONTENT_MARGIN} alignItems="center">
              <FlagIcon style={{ color: NODE_COLOR_ROUTE_END }} />
              <Typography
                variant="body1"
                sx={{ wordWrap: "break-word", wordBreak: "break-word" }}
              >
                {routeEndNodeID}
              </Typography>
            </Box>
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

        {/* The switch direction button */}
        <Box sx={{ mt: TITLE_MARGIN }}>
          <CustomButton
            text="Switch direction"
            variant="outlined"
            color="secondary"
            startIcon={<SwapVertIcon />}
            onClick={handleSwitchDirection}
            enabled={routeStartNodeID != null && routeEndNodeID != null} // only allow clicking when both are not null
          />
        </Box>

        {/* The find route button */}
        <Box>
          <CustomButton
            text="Find route"
            variant="contained"
            color="secondary"
            startIcon={<NavigationIcon />}
            onClick={handleFindRoute}
            enabled={routeStartNodeID != null && routeEndNodeID != null} // only allow clicking when both are not null
          />
        </Box>

        {/* The view route button */}
        <Box>
          <CustomButton
            text="View route"
            variant="contained"
            color="primary"
            startIcon={<ViewHeadlineIcon />}
            onClick={() => setOpenViewRouteDialog(true)}
            enabled={route != null} // only allow clicking when both are not null
          />
        </Box>

        {/* Error message */}
        {
          <Typography variant="body1" color="error" alignItems={"center"}>
            {error}
          </Typography>
        }

        {/* View route dialog */}
        <ViewRouteDialog
          open={openViewRouteDialog}
          setOpen={setOpenViewRouteDialog}
        />
      </Box>
    </Drawer>
  );
}
