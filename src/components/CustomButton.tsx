import { Button } from "@mui/material";

interface Props {
  text: String;
  variant: "outlined" | "contained" | "text";
  color: "primary" | "secondary" | "success" | "error";
  startIcon?: React.ReactNode; // JSX element --> <AddIcon />
  type?: "submit";
  onClick?: () => void;
  enabled?: boolean;
}

export default function CustomButton({
  text,
  variant,
  color,
  startIcon,
  type,
  onClick,
  enabled = true,
}: Props) {
  return (
    <Button
      variant={variant}
      color={color}
      startIcon={startIcon}
      sx={{ textTransform: "none" }}
      type={type}
      onClick={onClick}
      disabled={!enabled}
    >
      {text}
    </Button>
  );
}
