import { Alert, Box } from "@mui/material";
import GraphView from "./GraphView";
import { useContext } from "react";
import { ContentContext } from "../pages/Home";
import { CONTENT_MARGIN } from "./Values";

export default function Content() {
  // get the context
  const {
    nodes,
    setNodes,
    edges,
    setEdges,
    addNodeSelected,
    setAddNodeSelected,
    addEdgeSelected,
    setAddEdgeSelected,
  } = useContext(ContentContext);

  return (
    <Box display="flex" flexDirection="column" gap={CONTENT_MARGIN}>
      {/* When add node or add edge selected is active, display an alert */}
      {addNodeSelected && (
        <Alert severity="info">Click on the canvas to add a new node.</Alert>
      )}

      {addEdgeSelected && (
        <Alert severity="info">Click on a node to add an edge.</Alert>
      )}

      {/* Main graph */}
      <GraphView />
    </Box>
  );
}
