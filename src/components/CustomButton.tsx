import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

interface Props {
  text: String;
  variant: "outlined" | "contained";
  onClick: () => void;
}

export default function CustomButton({ text, variant, onClick }: Props) {
  return (
    <Button
      variant={variant}
      color="primary"
      startIcon={<AddIcon />}
      sx={{ textTransform: "none" }}
    >
      {text}
    </Button>
  );
}
