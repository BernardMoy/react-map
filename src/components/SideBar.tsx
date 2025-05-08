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
import DeleteIcon from "@mui/icons-material/Delete";
import {
  BACKGROUND_COLOR,
  CONTENT_MARGIN,
  DRAWER_WIDTH,
  GRAY_COLOR,
  TITLE_MARGIN,
} from "./Values";
import { Line, SideBarContext } from "../pages/Home";
import CircleIcon from "@mui/icons-material/Circle";
import DeleteLineDialog from "./DeleteLineDialog";

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

  const [openDeleteLineDialog, setOpenDeleteLineDialog] = useState(false);
  // the line to be deleted to be passed to the delete line dialog
  const [targetLine, setTargetLine] = useState<Line | null>(null);

  const topBarHeight = document.getElementById("topBar")?.offsetHeight || 0;
  const calculatedGraphHeight =
    window.innerHeight - topBarHeight - 16 * (CONTENT_MARGIN + TITLE_MARGIN);

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

        <Box
          sx={{
            flexGrow: 1,
            maxHeight: calculatedGraphHeight,
            overflowY: "auto",
          }}
        >
          <List>
            {tabNumber === 0 ? (
              <Box
                display="flex"
                flexDirection="column"
                gap={CONTENT_MARGIN}
                alignItems="center"
              >
                {/* The search field if there are stations */}
                {graph.getNode().length !== 0 && (
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
                      onChange={(text) =>
                        setStationsSearchText(text.target.value)
                      }
                    />
                    <IconButton onClick={() => setStationsSearchText("")}>
                      <CloseIcon color="disabled" />
                    </IconButton>
                  </Box>
                )}

                {/* Display a list of stations */}
                {graph
                  .getNode()
                  .filter((word) =>
                    word.toString().includes(stationsSearchText)
                  )
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
                  <Box
                    display="flex"
                    flexDirection="row"
                    width="100%" // the box must have full width
                    gap={CONTENT_MARGIN}
                    alignItems="center"
                  >
                    <CircleIcon style={{ color: value.lineColor }} />
                    <ListItemText
                      primary={value.lineName}
                      sx={{ wordBreak: "break-word", flexGrow: 1 }}
                    />

                    {/* If the graph does not contain this line, show a delete button */}
                    {!graph.hasLine(value) && (
                      <IconButton
                        onClick={() => {
                          // set the target line to the clicked value
                          setTargetLine(value);
                          // open the delete line dialog
                          setOpenDeleteLineDialog(true);
                        }}
                      >
                        <DeleteIcon color="error" />
                      </IconButton>
                    )}

                    {/* Else, show a disabled delete button */}
                    {graph.hasLine(value) && (
                      <IconButton
                        onClick={() => {
                          alert("Delete all edges of this line first.");
                        }}
                      >
                        <DeleteIcon color="disabled" />
                      </IconButton>
                    )}
                  </Box>
                </ListItem>
              ))
            )}
          </List>
        </Box>

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

      {/* The delete line dialog */}
      <DeleteLineDialog
        open={openDeleteLineDialog}
        setOpen={setOpenDeleteLineDialog}
        targetLine={targetLine}
        setLines={setLines}
      />
    </Drawer>
  );
}
