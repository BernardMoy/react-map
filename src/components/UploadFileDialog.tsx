import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Typography,
} from "@mui/material";
import CustomButton from "./CustomButton";
import { Line, TopBarContext } from "../pages/Home";
import loadFromJson from "./JsonLoader";
import { useContext } from "react";

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  jsonText: string; // json file in the format of string
}

export default function UploadFileDialog({ open, setOpen, jsonText }: Props) {
  // get the context
  const {
    setLines,
    setGraph,
    setRouteStartNodeID,

    setRouteEndNodeID,
    reset,
    setReset,

    setNodes,

    setEdges,
    setUnit,
  } = useContext(TopBarContext);

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
      setReset,
      setUnit
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
