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

export default function NewLineDialog({ open, onClose }: Props) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle> Add new line</DialogTitle>

      {/* The input field of the line name */}
      <DialogContent>
        <TextField
          autoFocus
          id="lineNameTextField"
          variant="outlined"
          label="Line name"
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
