import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Box,
  Typography,
} from "@mui/material";
import CustomButton from "./CustomButton";
import { IdType } from "vis-network";
import { Destination, FullRoute } from "./Graph";

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  route: FullRoute | null;
}

export default function ViewRouteDialog({ open, setOpen }: Props) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    // prevent full page refresh
    event.preventDefault();

    // close the dialog
    setOpen(false);
  };

  return (
    <Dialog open={open}>
      <DialogTitle> View Route </DialogTitle>

      <form onSubmit={handleSubmit}>
        {/* Route information content goes here */}
        <DialogContent>
          <Typography variant="body1">Text goes here</Typography>
        </DialogContent>

        {/* The confirm buttons */}
        <DialogActions>
          <CustomButton
            text="Done"
            variant="contained"
            color="primary"
            type="submit"
          />
        </DialogActions>
      </form>
    </Dialog>
  );
}
