import { ThemeProvider } from "@mui/material";
import theme from "./theme/theme";
import Home from "./pages/Home";

function App() {
  // apply the theme here
  return (
    <ThemeProvider theme={theme}>
      <Home />
    </ThemeProvider>
  );
}

export default App;
