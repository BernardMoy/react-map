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
  Checkbox,
} from "@mui/material";
import { CONTENT_MARGIN, DEFAULT_EDGE_COLOR } from "./Values";
import CustomButton from "./CustomButton";
import { useState } from "react";
import { DataSet, Edge, IdType, Network } from "vis-network/standalone";
import { Graph } from "./Graph";
import CircleIcon from "@mui/icons-material/Circle";
import { Line } from "../pages/Home";
import { CheckBox } from "@mui/icons-material";

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
  const [weightInput, setWeightInput] = useState("");
  const [error, setError] = useState("");

  // store the input line
  const [lineInput, setLineInput] = useState<Line | null>(null);

  // store whether the edge is bidirectional
  const [bidirectional, setBidirectional] = useState(true);

  const handleClose = () => {
    // directly close the dialog
    setOpen(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    // prevent full page refresh
    event.preventDefault();
    const edgeID = Date.now();

    // reset error
    setError("");
    // check if the weight can be converted to float
    if (!parseFloat(weightInput)) {
      setError("Invalid number");
      return;
    }

    // create the edge if arguments are correct
    if (nodeID1 != null && nodeID2 != null) {
      const newEdge = {
        id: `${edgeID}-forward`,
        from: nodeID1,
        to: nodeID2,
        label: parseFloat(weightInput).toString(),
        color: lineInput ? lineInput.lineColor : DEFAULT_EDGE_COLOR,
        hidden: false,
      };
      edges.add(newEdge);

      // if bidirectional, also add the from <- to edge
      if (bidirectional) {
        const newEdgeBackward = {
          id: `${edgeID}-backward`,
          from: nodeID2,
          to: nodeID1,
          label: parseFloat(weightInput).toString(),
          color: lineInput ? lineInput.lineColor : DEFAULT_EDGE_COLOR,
          hidden: false,
        };
        edges.add(newEdgeBackward);
      }

      // add the edge to the graph data structure
      graph.addEdge(
        nodeID1,
        nodeID2,
        parseFloat(weightInput),
        lineInput || { lineName: "Unknown", lineColor: DEFAULT_EDGE_COLOR },
        bidirectional
      );
    }

    // close the dialog at the end
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle> Add new connection</DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box
            display="flex"
            flexDirection="column"
            gap={CONTENT_MARGIN}
            alignItems={"center"}
          >
            {/* The input field of the connection name */}
            <TextField
              autoFocus
              inputRef={(input) => input && input.focus()}
              id="weightTextField"
              variant="outlined"
              label="Weight"
              color="primary"
              type="text"
              slotProps={{
                htmlInput: {
                  min: 0,
                },
              }}
              sx={{ my: CONTENT_MARGIN }}
              helperText={error}
              error={error != null}
              onChange={(text) => {
                const textValue = text.target.value;
                setWeightInput(textValue);
              }}
              required // automatically creates warning when not filled in
            />

            {/* The form for picking a line */}
            <FormControl fullWidth>
              <InputLabel id="line-select-label">Line</InputLabel>
              <Select
                labelId="line-select-label"
                id="line-select"
                value={lineInput ? lineInput.lineName : ""}
                label="Line"
                required
                onChange={(event) => {
                  // find the line object with the target name as line names are UNIQUE
                  const lineObj =
                    lines.find((l) => l.lineName == event.target.value) || null;
                  setLineInput(lineObj);
                }}
              >
                {lines.length > 0 ? (
                  lines.map((value, index) => (
                    <MenuItem
                      value={value.lineName}
                      key={`line ${value.lineName}`}
                    >
                      {/* Content for each dropdown item */}

                      <Box
                        display="flex"
                        gap={CONTENT_MARGIN}
                        alignItems="center"
                      >
                        <CircleIcon style={{ color: value.lineColor }} />
                        <Typography variant="body1">
                          {value.lineName}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))
                ) : (
                  <Typography
                    variant="body1"
                    color="gray"
                    my={CONTENT_MARGIN}
                    mx={1}
                  >
                    There are no lines.
                  </Typography>
                )}
              </Select>
            </FormControl>

            {/* The checkbox of whether the edge is bidirectional */}
            <Box
              display={"flex"}
              flexDirection={"row"}
              justifyContent={"start"}
              gap={CONTENT_MARGIN}
              alignItems={"center"}
            >
              <Typography variant="body1">Bidirectional</Typography>
              <Checkbox
                checked={bidirectional}
                onChange={() => setBidirectional(!bidirectional)}
                color="primary"
              />
            </Box>
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
