import { Drawer, List, ListItem, ListItemText } from "@mui/material";
import { useContext, useState } from "react";
import { Box } from "@mui/material";
import CustomButton from "./CustomButton";
import { DRAWER_WIDTH } from "./Values";
import { SideBarContext } from "../pages/Home";

export default function SideBar() {
  // get the context
  const { lines, setLines } = useContext(SideBarContext);

  const stationList = ["A", "B", "C", "D"];

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
            ? stationList.map((value, index) => (
                // unique keys are necessary here
                <ListItem key={`station ${index}`}>
                  <ListItemText primary={value} />
                </ListItem>
              ))
            : lines.map((value, index) => (
                <ListItem key={`line ${index}`}>
                  <ListItemText primary={value} />
                </ListItem>
              ))}
        </List>
      </Box>
    </Drawer>
  );
}
