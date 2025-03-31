import {
  Drawer,
  Icon,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import { useContext, useState } from "react";
import { Box } from "@mui/material";
import CustomButton from "./CustomButton";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import {
  BACKGROUND_COLOR,
  CONTENT_MARGIN,
  DRAWER_WIDTH,
  GRAY_COLOR,
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

  const [stationsSearchText, setStationsSearchText] = useState("");

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
          {tabNumber === 0 ? (
            <Box
              display="flex"
              flexDirection="column"
              gap={CONTENT_MARGIN}
              alignItems="center"
            >
              {/* The search field */}
              <Box display="flex" alignItems="end">
                <SearchIcon color="secondary" />
                <TextField
                  id="stationsSearchField"
                  variant="standard"
                  label="Search stations"
                  color="secondary"
                  type="text"
                  sx={{ ml: CONTENT_MARGIN }}
                  value={stationsSearchText}
                  onChange={(text) => setStationsSearchText(text.target.value)}
                />
                <IconButton onClick={() => setStationsSearchText("")}>
                  <CloseIcon color="disabled" />
                </IconButton>
              </Box>

              {/* Display a list of stations */}
              {graph
                .getNode()
                .filter((word) => word.toString().includes(stationsSearchText))
                .map((value, index) => (
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
                ))}
            </Box>
          ) : (
            lines.map((value, index) => (
              // display a list of lines with name and color
              <ListItem key={`line ${index}`}>
                <Box display="flex" gap={CONTENT_MARGIN} alignItems="center">
                  <CircleIcon style={{ color: value.lineColor }} />
                  <ListItemText primary={value.lineName} />
                </Box>
              </ListItem>
            ))
          )}
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
