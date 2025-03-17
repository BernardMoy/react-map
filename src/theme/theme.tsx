import { createTheme } from "@mui/material/styles";
import "@fontsource/open-sans";

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
    fontFamily: "'Open Sans', sans-serif",
  },
});

export default theme;
