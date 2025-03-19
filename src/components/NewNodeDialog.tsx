import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  TextField,
} from "@mui/material";
import { CONTENT_MARGIN } from "./Values";
import CustomButton from "./CustomButton";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function NewNodeDialog({ open, onClose }: Props) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle> Add new node </DialogTitle>

      {/* The input field of the node name */}
      <DialogContent>
        <TextField
          autoFocus
          id="nodeNameTextField"
          variant="outlined"
          label="Node name"
          color="primary"
          type="text"
          sx={{ my: CONTENT_MARGIN }}
        />
      </DialogContent>

      {/* The confirm and dismiss buttons */}
      <DialogActions>
        <CustomButton
          text="Cancel"
          variant="outlined"
          color="primary"
          onClick={onClose}
        />
        <CustomButton
          text="Add"
          variant="contained"
          color="primary"
          onClick={onClose}
        />
      </DialogActions>
    </Dialog>
  );
}
