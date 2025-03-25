import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  TextField,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { CONTENT_MARGIN } from "./Values";
import CustomButton from "./CustomButton";
import { useState } from "react";
import { DataSet, Edge, IdType, Network } from "vis-network/standalone";
import { onEdgeChosen } from "./GraphView";
import { Graph } from "./Graph";
import CircleIcon from "@mui/icons-material/Circle";
import { Line } from "../pages/Home";

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  nodeID1: IdType | null;
  nodeID2: IdType | null;
  edges: DataSet<Edge>;
  setEdges: (value: DataSet<Edge>) => void;
  graph: Graph;
  setGraph: (value: Graph) => void;
  lines: Line[];
  setLines: (value: Line[]) => void;
}

export default function NewEdgeDialog({
  open,
  setOpen,
  nodeID1,
  nodeID2,
  edges,
  setEdges,
  graph,
  setGraph,
  lines,
  setLines,
}: Props) {
  // store the input text
  const [weightInput, setWeightInput] = useState(1);

  // store the input line
  const [lineInput, setLineInput] = useState<Line | null>(null);

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
        /*
        smooth: {
          type: "curvedCW",
          roundness: Math.random(),
        } as any,
         */
        label: weightInput.toString(),
      };
      edges.add(newEdge);

      // add the edge to the graph data structure
      graph.addEdge(nodeID1, nodeID2, weightInput, {
        lineName: "test",
        lineColor: "test",
      });
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
              slotProps={{
                htmlInput: {
                  min: 0,
                },
              }}
              sx={{ my: CONTENT_MARGIN }}
              onChange={(text) => {
                const textValue = text.target.value;
                setWeightInput(textValue === "" ? 0 : parseFloat(textValue));
              }}
              required // automatically creates warning when not filled in
            />

            {/* The form for picking a line */}
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Age</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={lineInput ? lineInput.lineName : ""}
                label="Age"
                onChange={(event) => {
                  // find the line object with the target name
                  const lineObj =
                    lines.find((l) => l.lineName == event.target.value) || null;
                  setLineInput(lineObj);
                }}
              >
                {lines.map((value, index) => (
                  <MenuItem value={value.lineName}>
                    {/* Content for each dropdown item */}
                    <Box
                      display="flex"
                      gap={CONTENT_MARGIN}
                      alignItems="center"
                    >
                      <CircleIcon style={{ color: value.lineColor }} />
                      <Typography variant="body1">{value.lineName}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
