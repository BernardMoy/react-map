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

export default function DeleteNodeDialog({ open, setOpen }: Props) {
  // get the context
  const {
    network,
    selectedNodeID,
    setSelectedNodeID,
    graph,
    setGraph,
    routeStartNodeID,
    setRouteStartNodeID,
    routeEndNodeID,
    setRouteEndNodeID,
  } = useContext(TopBarContext);

  const handleClose = () => {
    // directly close the dialog
    setOpen(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    // prevent full page refresh
    event.preventDefault();

    // nodes to be deleted is the current selected node
    const nodesToBeDeleted = network?.getSelectedNodes()!;

    // remove the selected node from the sidebar and delete the node from the graph
    const newGraph = new Graph(graph);
    for (const nodeID of nodesToBeDeleted) {
      newGraph.deleteNode(nodeID);
    }
    setGraph(newGraph);

    // delete the connected edges of the nodes
    let edgesToBeDeleted: IdType[] = [];
    for (const nodeID of nodesToBeDeleted) {
      const connectedEdges = network?.getConnectedEdges(nodeID)!;
      edgesToBeDeleted = [...edgesToBeDeleted, ...connectedEdges];
    }

    // delete the selected nodes and all connecting edges of that node
    // first make a selection, then delete that selection
    network?.setSelection({ nodes: nodesToBeDeleted, edges: edgesToBeDeleted });
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
