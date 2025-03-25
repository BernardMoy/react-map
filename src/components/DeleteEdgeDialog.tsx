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

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  network: Network | null;
  selectedEdgeID: IdType | null;
  setSelectedEdgeID: (value: IdType | null) => void;
  graph: Graph;
  setGraph: (value: Graph) => void;
}

export default function DeleteEdgeDialog({
  open,
  setOpen,
  network,
  selectedEdgeID,
  setSelectedEdgeID,
  graph,
  setGraph,
}: Props) {
  const handleClose = () => {
    // directly close the dialog
    setOpen(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    // prevent full page refresh
    event.preventDefault();

    const newGraph = new Graph(graph);
    for (const nodeID in network?.getSelectedNodes) {
      newGraph.deleteNode(nodeID);
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
