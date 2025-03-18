import { Button } from "@mui/material";

interface Props {
  text: String;
  variant: "outlined" | "contained" | "text";
  startIcon?: React.ReactNode; // JSX element --> <AddIcon />
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
      onClick={onClick}
    >
      {text}
    </Button>
  );
}
