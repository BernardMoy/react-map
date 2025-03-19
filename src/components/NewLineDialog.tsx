import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  TextField,
} from "@mui/material";
import { CONTENT_MARGIN } from "./Values";
import CustomButton from "./CustomButton";
import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  lines: string[]; // pass the lines variable from context
  setLines: (value: string[]) => void;
}

export default function NewLineDialog({ open, onClose }: Props) {
  // store the input text
  const [lineInput, setLineInput] = useState("");

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
          onChange={(text) => setLineInput(text.target.value)}
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
