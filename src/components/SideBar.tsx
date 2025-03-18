import { Drawer, List, ListItem, ListItemText } from "@mui/material";
import { useState } from "react";
import { Box } from "@mui/material";
import CustomButton from "./CustomButton";
import { DRAWER_WIDTH } from "./Values";

export default function SideBar() {
  // open state
  const lineList = [
    "Red",
    "Blue",
    "Green",
    "Blue",
    "Green",
    "Blue",
    "Green",
    "Blue",
    "Green",
    "Blue",
    "Green",
    "Blue",
    "Green",
    "Blue",
    "Green",
    "Blue",
    "Green",
    "last",
  ];

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
            variant={"outlined"}
            onClick={() => {}}
          />
          <CustomButton
            text={"Lines"}
            variant={"outlined"}
            onClick={() => {}}
          />
        </Box>

        <List>
          {lineList.map((value) => (
            <ListItem key={value}>
              <ListItemText primary={value} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
