import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  TextField,
  Box,
  Typography,
} from "@mui/material";
import { CONTENT_MARGIN } from "./Values";
import CustomButton from "./CustomButton";
import { useContext, useState } from "react";
import { Line, TopBarContext } from "../pages/Home";

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
}

export default function NewLineDialog({ open, setOpen }: Props) {
  // get the context
  const { lines, setLines, setTabNumber } = useContext(TopBarContext);
  // store the input text
  const [lineInput, setLineInput] = useState("");

  // store the input color
  const [color, setColor] = useState("#FFFFFF");

  // store the input error
  const [error, setError] = useState("");

  const validateLine = (value: string): boolean => {
    if (lines.find((l) => l.lineName == value)) {
      setError("This line name already exists");
      return false;
    } else {
      setError("");
      return true;
    }
  };

  const handleClose = () => {
    // directly close the dialog
    setOpen(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    // prevent full page refresh
    event.preventDefault();

    // validate line
    if (!validateLine(lineInput)) {
      return;
    }

    // add the new line stored in lineInput to the list of lines
    const newLine: Line = {
      lineName: lineInput,
      lineColor: color,
    };
    setLines([...lines, newLine]);

    // set the tab to show lines
    setTabNumber(1);

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
              inputRef={(input) => input && input.focus()}
              id="lineNameTextField"
              variant="outlined"
              label="Line name"
              color="primary"
              type="text"
              sx={{ my: CONTENT_MARGIN }}
              error={error != ""}
              helperText={error}
              onChange={(text) => setLineInput(text.target.value)}
              required // automatically creates warning when not filled in
            />

            {/* The input field of the line color */}
            <Box display="flex" flexDirection="row" gap={CONTENT_MARGIN}>
              <Typography variant="body1">Line color</Typography>
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
