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

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  network: Network | null;
  selectedNodeID: IdType | null;
}

export default function DeleteNodeDialog({
  open,
  setOpen,
  network,
  selectedNodeID,
}: Props) {
  const handleClose = () => {
    // directly close the dialog
    setOpen(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    // prevent full page refresh
    event.preventDefault();

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
