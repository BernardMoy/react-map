import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  TextField,
  Box,
  Typography,
} from "@mui/material";
import { CONTENT_MARGIN, NODE_COLOR } from "./Values";
import CustomButton from "./CustomButton";
import { useState } from "react";
import { DataSet, Node } from "vis-network/standalone";
import { Graph } from "./Graph";

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  nodes: DataSet<Node>;
  setNodes: (value: DataSet<Node>) => void; // not necessary as "DataSet<Node>" itself is reactive
  graph: Graph;
  setGraph: (value: Graph) => void;
  posX: number;
  posY: number;
  tabNumber: number;
  setTabNumber: (value: number) => void;
}

export default function NewNodeDialog({
  open,
  setOpen,
  nodes,
  setNodes,
  graph,
  setGraph,
  posX,
  posY,
  tabNumber,
  setTabNumber,
}: Props) {
  // store the input text
  const [nodeInput, setNodeInput] = useState("");

  // store the error message
  const [error, setError] = useState("");

  const handleClose = () => {
    // directly close the dialog
    setOpen(false);
  };

  const validateNodeName = (value: string): boolean => {
    if (value.includes("<") || value.includes(">")) {
      setError("'<' and '>' are not allowed in node names"); // so they can be used for reserved characters idtype -> string
      return false;
    } else if (graph.hasNode(value)) {
      setError("This node name already exists");
      return false;
    } else {
      setError("");
      return true;
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    // prevent full page refresh
    event.preventDefault();

    // validate if the node is value
    if (!validateNodeName(nodeInput)) {
      return;
    }

    // add the new Node stored in NodeInput to the list of Nodes
    const newNode = {
      id: nodeInput, // unique id to be displayed in the sidebar
      label: nodeInput,
      color: NODE_COLOR,
      x: posX,
      y: posY,
    };

    // set tab to node
    setTabNumber(0);

    // add the node to the dataset
    nodes.add(newNode);

    // add the node to the graph and set new graph
    setGraph(new Graph(graph.addNode(newNode.id)));

    // close the dialog at the end
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle> Add new node</DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={CONTENT_MARGIN}>
            {/* The input field of the Node name */}
            <TextField
              inputRef={(input) => input && input.focus()} // gain focus automatically
              autoFocus
              id="NodeNameTextField"
              variant="outlined"
              label="Node name"
              color="primary"
              type="text"
              sx={{ my: CONTENT_MARGIN }}
              error={error != ""}
              helperText={error}
              onChange={(text) => setNodeInput(text.target.value)}
              required // automatically creates warning when not filled in
            />
          </Box>
        </DialogContent>

        {/* The confirm and dismiss buttons */}
        <DialogActions>
          <CustomButton
            text="Cancel"
            variant="outlined"
            color="primary"
            onClick={handleClose}
          />
          <CustomButton
            text="Add"
            variant="contained"
            color="primary"
            type="submit"
          />
        </DialogActions>
      </form>
    </Dialog>
  );
}
