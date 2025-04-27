import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Box,
  Typography,
} from "@mui/material";
import CustomButton from "./CustomButton";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { FullRoute } from "./FullRoute";
import RouteTimeline from "./RouteTimeline";
import { CONTENT_MARGIN, VIEW_ROUTE_DIALOG_MIN_WIDTH } from "./Values";

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  route: FullRoute | null;
  unit: string;
}

export default function ViewRouteDialog({ open, setOpen, route, unit }: Props) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    // prevent full page refresh
    event.preventDefault();

    // close the dialog
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleSubmit}
      slotProps={{ paper: { sx: { minWidth: VIEW_ROUTE_DIALOG_MIN_WIDTH } } }} // override default
    >
      <DialogTitle> View Route </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          {/* General route details */}
          <Box
            display="flex"
            flexDirection="row"
            gap={CONTENT_MARGIN}
            mb={CONTENT_MARGIN}
            alignItems="center"
          >
            <Typography variant="h5" color="primary">
              {route?.getStart()}
            </Typography>
            <ArrowRightAltIcon color="primary" />
            <Typography
              variant="h5"
              color="primary"
              sx={{ wordBreak: "break-word" }}
            >
              {route?.getEnd()}
            </Typography>
            <Typography
              variant="h5"
              color="primary"
              sx={{ wordBreak: "break-word" }}
            >
              ({route?.getTotalTime()} {unit})
            </Typography>
          </Box>

          {/* Route information content goes here */}
          {route?.fullRouteToLegs().map((value, index) => (
            <RouteTimeline
              line={value.line}
              stations={value.stations}
              unit={unit}
            />
          ))}
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
