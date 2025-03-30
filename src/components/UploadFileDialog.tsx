import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Typography,
} from "@mui/material";
import CustomButton from "./CustomButton";
import { DataSet, Node, Edge, IdType } from "vis-network/standalone";
import { Graph } from "./Graph";
import { Line } from "../pages/Home";
import loadFromJson from "./JsonLoader";

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  jsonText: string; // json file in the format of string
  setNodes: React.Dispatch<React.SetStateAction<DataSet<Node>>>;
  setEdges: React.Dispatch<React.SetStateAction<DataSet<Edge>>>;
  setGraph: React.Dispatch<React.SetStateAction<Graph>>;
  setLines: React.Dispatch<React.SetStateAction<Line[]>>;
  reset: number;
  setReset: React.Dispatch<React.SetStateAction<number>>;
  setRouteStartNodeID: React.Dispatch<React.SetStateAction<IdType | null>>;
  setRouteEndNodeID: React.Dispatch<React.SetStateAction<IdType | null>>;
}

export default function UploadFileDialog({
  open,
  setOpen,
  jsonText,
  setNodes,
  setEdges,
  setGraph,
  setLines,
  reset,
  setReset,
  setRouteStartNodeID,
  setRouteEndNodeID,
}: Props) {
  const handleClose = () => {
    // directly close the dialog
    setOpen(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    // prevent full page refresh
    event.preventDefault();

    // load using json loader
    loadFromJson(
      jsonText,
      setNodes,
      setEdges,
      setGraph,
      setLines,
      reset,
      setReset
    );

    // reset the route start and route end node id
    setRouteStartNodeID(null);
    setRouteEndNodeID(null);

    // close the dialog at the end
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle> File upload</DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Typography variant="body1">
            Upload file? This will erase all existing data.
          </Typography>
        </DialogContent>

        {/* The confirm and dismiss buttons */}
        <DialogActions>
          <CustomButton
            text="Cancel"
            variant="outlined"
            color="warning"
            onClick={handleClose}
          />
          <CustomButton
            text="Upload"
            variant="contained"
            color="warning"
            type="submit"
          />
        </DialogActions>
      </form>
    </Dialog>
  );
}
