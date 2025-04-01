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
import { Destination } from "./Graph";
import { FullRoute } from "./FullRoute";
import RouteTimeline from "./RouteTimeline";
import { VIEW_ROUTE_DIALOG_MIN_WIDTH } from "./Values";

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
    <Dialog
      open={open}
      slotProps={{ paper: { sx: { minWidth: VIEW_ROUTE_DIALOG_MIN_WIDTH } } }} // override default
    >
      <DialogTitle> View Route </DialogTitle>

      <form onSubmit={handleSubmit}>
        {/* Route information content goes here */}
        <DialogContent>
          {
            <RouteTimeline
              line={{ lineName: "Blue", lineColor: "#bde3ff" }}
              stations={[
                { node: "abc", timeElapsed: 0 },
                { node: "abc2", timeElapsed: 5 },
                { node: "abc3", timeElapsed: 8 },
              ]}
            />
          }
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
