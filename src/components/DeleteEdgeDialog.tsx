import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  TextField,
  Box,
  Typography,
} from "@mui/material";
import CustomButton from "./CustomButton";
import { DataSet, IdType, Network, Node } from "vis-network/standalone";
import { Graph } from "./Graph";
import { useContext } from "react";
import { TopBarContext } from "../pages/Home";

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
}

export default function DeleteEdgeDialog({ open, setOpen }: Props) {
  // get the context
  const {
    network,

    graph,
    setGraph,
    setSelectedEdgeID,
  } = useContext(TopBarContext);

  const handleClose = () => {
    // directly close the dialog
    setOpen(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    // prevent full page refresh
    event.preventDefault();

    // delete the edge from the graph data structure
    const newGraph = new Graph(graph);
    for (const edgeID of network?.getSelectedEdges()!) {
      const connectedNodes = network?.getConnectedNodes(edgeID);

      // deleting an edge (Bidirectional) should return an array containing both ends of the nodes
      if (Array.isArray(connectedNodes)) {
        newGraph.deleteEdge(
          connectedNodes[0] as IdType,
          connectedNodes[1] as IdType
        );
      }
    }
    setGraph(newGraph);

    // delete the selected edges
    network?.deleteSelected();

    // deselect all edges
    setSelectedEdgeID(null);

    // close the dialog at the end
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle> Delete edge</DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Typography variant="body1">
            Delete this edge? This action cannot be undone.
          </Typography>
        </DialogContent>

        {/* The confirm and dismiss buttons */}
        <DialogActions>
          <CustomButton
            text="Cancel"
            variant="outlined"
            color="error"
            onClick={handleClose}
          />
          <CustomButton
            text="Delete"
            variant="contained"
            color="error"
            type="submit"
          />
        </DialogActions>
      </form>
    </Dialog>
  );
}
