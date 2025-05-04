import { Alert, Box } from "@mui/material";
import GraphView from "./GraphView";
import { useContext } from "react";
import { ContentContext } from "../pages/Home";
import { CONTENT_MARGIN } from "./Values";

export default function Content() {
  // get the context
  const { mode, selectedNodeID, lines, nodes } = useContext(ContentContext);

  return (
    <Box display="flex" flexDirection="column" gap={CONTENT_MARGIN}>
      {/* When add node or add edge selected is active, display an alert */}
      {mode === 1 && (
        <Alert severity="info">Click on the canvas to add a new node.</Alert>
      )}

      {mode === 2 && lines.length === 0 && (
        <Alert severity="warning">
          You have no lines. Create a line before adding a connection.
        </Alert>
      )}

      {mode === 2 && selectedNodeID == null && (
        <Alert severity="info">Click on a node to add an edge.</Alert>
      )}

      {mode === 2 && selectedNodeID != null && (
        <Alert severity="info">Select second node.</Alert>
      )}

      {/* Main graph */}
      <GraphView />
    </Box>
  );
}
