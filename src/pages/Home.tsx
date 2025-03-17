import SideBar from "../components/SideBar";
import { Box } from "@mui/material";
import TopBar from "../components/TopBar";
import Content from "../components/Content";

export default function Home() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
      }}
    >
      <TopBar />
      {/* Fill the remaining heights */}
      <Box sx={{ display: "flex", flexDirection: "row", flexGrow: 1 }}>
        <SideBar />
        <Content />
      </Box>
    </Box>
  );
}
