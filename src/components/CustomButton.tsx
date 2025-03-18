import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

interface Props {
  text: String;
  variant: "outlined" | "contained";
  startIcon?: React.ReactNode; // JSX element <AddIcon />
  onClick: () => void;
}

export default function CustomButton({
  text,
  variant,
  startIcon,
  onClick,
}: Props) {
  return (
    <Button
      variant={variant}
      color="primary"
      startIcon={startIcon}
      sx={{ textTransform: "none" }}
    >
      {text}
    </Button>
  );
}
