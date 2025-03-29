import { Box, Typography } from "@mui/material";
import { CONTENT_MARGIN, TITLE_MARGIN } from "./Values";
import CustomButton from "./CustomButton";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useContext, useRef, useState } from "react";
import NewLineDialog from "./NewLineDialog";
import { TopBarContext } from "../pages/Home";
import DeleteNodeDialog from "./DeleteNodeDialog";
import DeleteEdgeDialog from "./DeleteEdgeDialog";
import DeselectIcon from "@mui/icons-material/Deselect";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { DownloadData } from "./DownloadData";
import loadFromJson from "./JsonLoader";

export default function TopBar() {
  // get the context
  const {
    mode,
    setMode,
    lines,
    setLines,
    network,
    selectedNodeID,
    setSelectedNodeID,
    graph,
    setGraph,
    selectedEdgeID,
    setSelectedEdgeID,
    tabNumber,
    setTabNumber,
    routeStartNodeID,
    setRouteStartNodeID,
    routeEndNodeID,
    setRouteEndNodeID,
    reset,
    setReset,
    nodes,
    setNodes,
    edges,
    setEdges,
  } = useContext(TopBarContext);

  // state of the dialogs whether they are open
  const [openNewLineDialog, setOpenNewLineDialog] = useState(false);

  const [openDeleteNodeDialog, setOpenDeleteNodeDialog] = useState(false);
  const [openDeleteEdgeDialog, setOpenDeleteEdgeDialog] = useState(false);

  // for the upload of json file
  const fileRef = useRef<HTMLInputElement | null>(null);

  // functions when the ADD buttons are clicked
  const onAddNodeClicked = () => {
    mode === 1 ? setMode(0) : setMode(1);
  };
  const onAddConnectionClicked = () => {
    mode === 2 ? setMode(0) : setMode(2);
  };

  const onAddLineClicked = () => {
    setOpenNewLineDialog(true);
  };

  const onDeleteNodeClicked = () => {
    setOpenDeleteNodeDialog(true);
  };

  const onDeleteEdgeClicked = () => {
    setOpenDeleteEdgeDialog(true);
  };

  const onDeselectClicked = () => {
    if (mode != 0) {
      // if mode is not 0, set mode to 0. this will reset the graph
      setMode(0);
    } else {
      // only reset the graph
      setReset(reset + 1);
    }
  };

  // when the download or upload button is clicked
  const onDownloadClicked = () => {
    // construct the downloadData object
    const downloadData: DownloadData = {
      nodes: nodes.get(),
      edges: edges.get(),
      graph: graph.get(),
      lines: lines,
    };

    // download the data as json
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(downloadData)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "data.json"; // file name
    link.click();
  };

  const onUploadClicked = () => {
    fileRef.current?.click(); // click the upload html button
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    // get the file
    const file = event.target.files?.[0];

    // check if the uploaded file has correct type
    if (!file || file.type != "application/json") {
      return;
    }

    // create file reader
    const fileReader = new FileReader();
    fileReader.readAsText(file, "UTF-8");

    fileReader.onload = (e) => {
      // process the JSON data here
      const jsonText = e.target?.result as string;

      // use the json loader
      loadFromJson(jsonText, setNodes, setEdges, setGraph, setLines);
    };
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        gap: TITLE_MARGIN,
      }}
    >
      {/* Title text */}
      <Typography variant="h3">Graph Modeling</Typography>

      {/* row of buttons */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "start",
          gap: CONTENT_MARGIN,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "start",
            gap: CONTENT_MARGIN,
            flexGrow: 1,
          }}
        >
          <CustomButton
            text={"Add Node"}
            variant={mode === 1 ? "contained" : "outlined"}
            color={"primary"}
            startIcon={<AddIcon />}
            onClick={onAddNodeClicked}
          />

          <CustomButton
            text={"Add Connection"}
            variant={mode === 2 ? "contained" : "outlined"}
            color={"primary"}
            startIcon={<AddIcon />}
            onClick={onAddConnectionClicked}
          />

          <CustomButton
            text={"Add Line"}
            variant={"outlined"}
            color={"primary"}
            startIcon={<AddIcon />}
            onClick={onAddLineClicked}
          />

          {/* The deselect button */}
          <CustomButton
            text={"Deselect"}
            variant={"outlined"}
            color={"success"}
            startIcon={<DeselectIcon />}
            onClick={onDeselectClicked}
          />

          {/* The download and upload buttons */}
          <CustomButton
            text={"Download graph"}
            variant={"outlined"}
            color={"warning"}
            startIcon={<FileDownloadIcon />}
            onClick={onDownloadClicked}
          />

          {/* When the upload button is clicked, the upload button from the input html element below is clicked */}
          <CustomButton
            text={"Upload graph"}
            variant={"outlined"}
            color={"warning"}
            startIcon={<FileUploadIcon />}
            onClick={onUploadClicked}
          />

          {/* The HIDDEN input field for the JSON file */}
          <input
            type="file"
            accept="application/json"
            ref={fileRef}
            style={{ display: "none" }}
            onChange={handleFileUpload}
          />
        </Box>

        {/* Show delete button if a node is selected */}
        {selectedNodeID != null && (
          <CustomButton
            text={"Delete node"}
            variant={"outlined"}
            color={"error"}
            startIcon={<DeleteIcon />}
            onClick={onDeleteNodeClicked}
          />
        )}

        {/* Show delete button if an edge is selected */}
        {selectedEdgeID != null && (
          <CustomButton
            text={"Delete edge"}
            variant={"outlined"}
            color={"error"}
            startIcon={<DeleteIcon />}
            onClick={onDeleteEdgeClicked}
          />
        )}
      </Box>

      {/* Dialogs that is accessed through top bar buttons  */}
      <NewLineDialog
        open={openNewLineDialog}
        setOpen={setOpenNewLineDialog} // this is necessary to control the open state
        lines={lines}
        setLines={setLines}
        tabNumber={tabNumber}
        setTabNumber={setTabNumber}
      />

      <DeleteNodeDialog
        open={openDeleteNodeDialog}
        setOpen={setOpenDeleteNodeDialog}
        network={network}
        selectedNodeID={selectedNodeID}
        setSelectedNodeID={setSelectedNodeID}
        graph={graph}
        setGraph={setGraph}
        routeStartNodeID={routeStartNodeID}
        routeEndNodeID={routeEndNodeID}
        setRouteStartNodeID={setRouteStartNodeID}
        setRouteEndNodeID={setRouteEndNodeID}
      />

      <DeleteEdgeDialog
        open={openDeleteEdgeDialog}
        setOpen={setOpenDeleteEdgeDialog}
        network={network}
        selectedEdgeID={selectedEdgeID}
        setSelectedEdgeID={setSelectedEdgeID}
        graph={graph}
        setGraph={setGraph}
      />
    </Box>
  );
}
