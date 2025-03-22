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
  const { lines, setLines, nodeList, setNodeList, network, graphRef } =
    useContext(SideBarContext);

  // state if nodes or edges are selected (Nodes are 0, edges are 1)
  const [selected, setSelected] = useState(0);

  // function when the two header buttons are clicked
  const onStationsClicked = () => {
    setSelected(0);
  };

  const onLinesClicked = () => {
    setSelected(1);
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
            variant={selected === 0 ? "contained" : "outlined"}
            color={"secondary"}
            onClick={onStationsClicked}
          />
          <CustomButton
            text={"Lines"}
            variant={selected === 1 ? "contained" : "outlined"}
            color={"secondary"}
            onClick={onLinesClicked}
          />
        </Box>

        <List>
          {selected === 0
            ? nodeList.map((value, index) => (
                // unique keys are necessary here
                <ListItem
                  key={`station ${index}`}
                  onClick={() => {
                    // get the id of the selected node
                    const nodeID = value.id ?? "unknown";

                    // set focus for the node
                    network?.focus(nodeID);
                  }}
                  sx={{
                    cursor: "pointer",
                    ":hover": {
                      backgroundColor: BACKGROUND_COLOR,
                    },
                  }}
                >
                  <ListItemText primary={value.label} />
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
          {selected === 0
            ? nodeList.length === 0 && (
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
