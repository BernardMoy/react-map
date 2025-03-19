import { Dialog, DialogContent, DialogTitle } from "@mui/material";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function NewNodeDialog({ open, onClose }: Props) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle> Add new node </DialogTitle>
      <DialogContent>Content goes here</DialogContent>
    </Dialog>
  );
}
