import { createTheme } from "@mui/material/styles";
import "@fontsource/open-sans";

const theme = createTheme({
  palette: {
    primary: {
      main: "#d6366c",
    },
    secondary: {
      main: "#1f99d1",
    },
  },
  typography: {
    fontFamily: "'Open Sans', sans-serif",
  },
});

export default theme;
