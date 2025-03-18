import { Button } from "@mui/material";

interface Props {
  text: String;
  variant: "outlined" | "contained" | "text";
  color: "primary" | "secondary" | "success" | "error";
  startIcon?: React.ReactNode; // JSX element --> <AddIcon />
  onClick: () => void;
}

export default function CustomButton({
  text,
  variant,
  color,
  startIcon,
  onClick,
}: Props) {
  return (
    <Button
      variant={variant}
      color={color}
      startIcon={startIcon}
      sx={{ textTransform: "none" }}
      onClick={onClick}
    >
      {text}
    </Button>
  );
}
