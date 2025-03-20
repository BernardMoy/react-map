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
  setOpen: (value: boolean) => void;
  lines: string[]; // pass the lines variable from context
  setLines: (value: string[]) => void;
}

export default function NewLineDialog({
  open,
  setOpen,
  lines,
  setLines,
}: Props) {
  // store the input text
  const [lineInput, setLineInput] = useState("");

  const handleClose = () => {
    // directly close the dialog
    setOpen(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    // prevent full page refresh
    event.preventDefault();

    // add the new line stored in lineInput to the list of lines
    setLines([...lines, lineInput]);

    // close the dialog at the end
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle> Add new line</DialogTitle>

      <form onSubmit={handleSubmit}>
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
            required // automatically creates warning when not filled in
          />
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
