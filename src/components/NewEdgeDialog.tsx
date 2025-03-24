import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  TextField,
  Box,
  Typography,
} from "@mui/material";
import { CONTENT_MARGIN } from "./Values";
import CustomButton from "./CustomButton";
import { useState } from "react";
import { DataSet, Edge, IdType, Network } from "vis-network/standalone";
import { onEdgeChosen } from "./GraphView";

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  nodeID1: IdType | null;
  nodeID2: IdType | null;
  edges: DataSet<Edge>;
  setEdges: (value: DataSet<Edge>) => void;
}

export default function NewEdgeDialog({
  open,
  setOpen,
  nodeID1,
  nodeID2,
  edges,
  setEdges,
}: Props) {
  // store the input text
  const [weightInput, setWeightInput] = useState(1);

  const handleClose = () => {
    // directly close the dialog
    setOpen(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    // prevent full page refresh
    event.preventDefault();

    // create the edge if arguments are correct
    if (nodeID1 != null && nodeID2 != null) {
      const newEdge = {
        id: Date.now(),
        from: nodeID1,
        to: nodeID2,
        chosen: { edge: onEdgeChosen as any, label: false },
        label: weightInput.toString(),
      };
      edges.add(newEdge);
    }

    // close the dialog at the end
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle> Add new connection</DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={CONTENT_MARGIN}>
            {/* The input field of the connection name */}
            <TextField
              autoFocus
              inputRef={(input) => input && input.focus()}
              id="weightTextField"
              variant="outlined"
              label="Weight"
              color="primary"
              type="number"
              sx={{ my: CONTENT_MARGIN }}
              onChange={(text) => {
                const textValue = text.target.value;
                setWeightInput(textValue === "" ? 0 : parseFloat(textValue));
              }}
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
