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
  selectedNodeID: IdType | null;
  setSelectedNodeID: React.Dispatch<React.SetStateAction<IdType | null>>;
  graph: Graph;
  setGraph: React.Dispatch<React.SetStateAction<Graph>>;
  routeStartNodeID: IdType | null;
  setRouteStartNodeID: React.Dispatch<React.SetStateAction<IdType | null>>;
  routeEndNodeID: IdType | null;
  setRouteEndNodeID: React.Dispatch<React.SetStateAction<IdType | null>>;
}

export default function DeleteNodeDialog({
  open,
  setOpen,
  network,
  selectedNodeID,
  setSelectedNodeID,
  graph,
  setGraph,
  routeStartNodeID,
  setRouteStartNodeID,
  routeEndNodeID,
  setRouteEndNodeID,
}: Props) {
  const handleClose = () => {
    // directly close the dialog
    setOpen(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    // prevent full page refresh
    event.preventDefault();

    // remove the selected node from the sidebar
    const newGraph = new Graph(graph);
    for (const nodeID of network?.getSelectedNodes()!) {
      newGraph.deleteNode(nodeID);
    }
    setGraph(newGraph);

    // delete the selected nodes
    network?.deleteSelected();

    // remove from the route start or route end node id if that is deleted
    if (selectedNodeID == routeStartNodeID) {
      setRouteStartNodeID(null);
    }
    if (selectedNodeID == routeEndNodeID) {
      setRouteEndNodeID(null);
    }

    // deselect all nodes
    setSelectedNodeID(null);

    // close the dialog at the end
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle> Delete node</DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Typography variant="body1">
            Delete this node? This action cannot be undone.
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
