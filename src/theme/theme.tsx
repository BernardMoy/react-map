import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#d6366c",
    },
    secondary: {
      main: "#e69aa9",
    },
  },
  typography: {
    h1: { fontSize: "3rem", fontWeight: 600 },
  },
});

export default theme;
