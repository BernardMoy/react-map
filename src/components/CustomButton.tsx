import { Button } from "@mui/material";

interface Props {
  text: String;
  variant: "outlined" | "contained" | "text";
  color: "primary" | "secondary" | "success" | "error";
  startIcon?: React.ReactNode; // JSX element --> <AddIcon />
  type?: "submit";
  onClick: () => void;
}

export default function CustomButton({
  text,
  variant,
  color,
  startIcon,
  type,
  onClick,
}: Props) {
  return (
    <Button
      variant={variant}
      color={color}
      startIcon={startIcon}
      sx={{ textTransform: "none" }}
      type={type}
      onClick={onClick}
    >
      {text}
    </Button>
  );
}
