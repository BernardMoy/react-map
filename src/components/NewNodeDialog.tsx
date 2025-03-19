import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { CONTENT_MARGIN } from "./Values";

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
        <Button onClick={onClose} variant="outlined" color="primary">
          Cancel
        </Button>
        <Button onClick={onClose} variant="contained" color="primary">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
