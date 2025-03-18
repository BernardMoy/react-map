import SideBar from "../components/SideBar";
import { Box, Divider } from "@mui/material";
import TopBar from "../components/TopBar";
import Content from "../components/Content";
import { CONTENT_MARGIN, TITLE_MARGIN } from "../components/Values";

export default function Home() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Box sx={{ m: TITLE_MARGIN }}>
        <TopBar />
      </Box>

      {/* Horizontal divider */}
      <Divider />

      {/* Fill the remaining heights */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flexGrow: 1,
        }}
      >
        <SideBar />

        <Box sx={{ m: CONTENT_MARGIN }}>
          <Content />
        </Box>
      </Box>
    </Box>
  );
}
