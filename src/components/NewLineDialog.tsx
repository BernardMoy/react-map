import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  TextField,
  Box,
} from "@mui/material";
import { CONTENT_MARGIN } from "./Values";
import CustomButton from "./CustomButton";
import { useState } from "react";
import { Line } from "../pages/Home";

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  lines: Line[]; // pass the lines variable from context
  setLines: (value: Line[]) => void;
}

export default function NewLineDialog({
  open,
  setOpen,
  lines,
  setLines,
}: Props) {
  // store the input text
  const [lineInput, setLineInput] = useState("");

  // store the input color
  const [color, setColor] = useState("#FFFFFF");

  const handleClose = () => {
    // directly close the dialog
    setOpen(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    // prevent full page refresh
    event.preventDefault();

    // add the new line stored in lineInput to the list of lines
    const newLine: Line = {
      lineName: lineInput,
      lineColor: color,
    };
    setLines([...lines, newLine]);

    // close the dialog at the end
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle> Add new line</DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={CONTENT_MARGIN}>
            {/* The input field of the line name */}
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

            {/* The input field of the line color */}
            <Box display="flex" flexDirection="row" gap={CONTENT_MARGIN}>
              Line color
              <input
                type="color"
                value={color}
                onChange={(color) => setColor(color.target.value)}
                required
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
