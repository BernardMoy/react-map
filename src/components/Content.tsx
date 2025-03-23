import { Alert, Box } from "@mui/material";
import GraphView from "./GraphView";
import { useContext } from "react";
import { ContentContext } from "../pages/Home";
import { CONTENT_MARGIN } from "./Values";

export default function Content() {
  // get the context
  const { addNodeSelected, addEdgeSelected, selectedNodeID } =
    useContext(ContentContext);

  return (
    <Box display="flex" flexDirection="column" gap={CONTENT_MARGIN}>
      {/* When add node or add edge selected is active, display an alert */}
      {addNodeSelected && (
        <Alert severity="info">Click on the canvas to add a new node.</Alert>
      )}

      {addEdgeSelected && selectedNodeID == null && (
        <Alert severity="info">Click on a node to add an edge.</Alert>
      )}

      {addEdgeSelected && selectedNodeID != null && (
        <Alert severity="info">Select second node.</Alert>
      )}

      {/* Main graph */}
      <GraphView />
    </Box>
  );
}
