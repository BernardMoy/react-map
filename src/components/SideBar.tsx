import { Drawer, List, ListItem, ListItemText } from "@mui/material";
import { useState } from "react";
import { Box } from "@mui/material";

export default function SideBar() {
  // open state
  const [open, setOpen] = useState(true);
  const lineList = ["Red", "Blue", "Green"];
  const drawerWidth = 240;

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      slotProps={{
        paper: {
          // the width of the drawer is overwritten here
          sx: {
            width: drawerWidth,
            boxSizing: "border-box",
            position: "relative",
          },
        },
      }}
    >
      <List>
        {lineList.map((value) => (
          <ListItem key={value}>
            <ListItemText primary={value} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
