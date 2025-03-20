import SideBar from "../components/SideBar";
import { Box, Divider } from "@mui/material";
import TopBar from "../components/TopBar";
import Content from "../components/Content";
import { CONTENT_MARGIN, TITLE_MARGIN } from "../components/Values";
import React, { createContext, useEffect, useState } from "react";

// interface to store all items passed to the top bar context
interface TopBarContextProps {
  addNodeSelected: boolean;
  setAddNodeSelected: React.Dispatch<React.SetStateAction<boolean>>;
  addEdgeSelected: boolean;
  setAddEdgeSelected: React.Dispatch<React.SetStateAction<boolean>>;
  lines: string[];
  setLines: React.Dispatch<React.SetStateAction<string[]>>;
}

// interface to store all items for the sidebar
interface SideBarContextProps {
  lines: string[];
  setLines: React.Dispatch<React.SetStateAction<string[]>>;
}

// create the contexts here and initialise them with values
export const TopBarContext = createContext<TopBarContextProps>({
  addNodeSelected: false, // the default values are passed here
  setAddNodeSelected: () => {},
  addEdgeSelected: false,
  setAddEdgeSelected: () => {},
  lines: [],
  setLines: () => {},
});

export const SideBarContext = createContext<SideBarContextProps>({
  lines: [],
  setLines: () => {},
});

export default function Home() {
  // prevent exiting the window if there are unsaved changes
  useEffect(() => {
    function handleOnBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
      event.returnValue = "";
    }
    window.addEventListener("beforeunload", handleOnBeforeUnload, {
      capture: true,
    });

    return () =>
      window.removeEventListener("beforeunload", handleOnBeforeUnload);
  });

  // state of whether the add node button is selected
  const [addNodeSelected, setAddNodeSelected] = useState(false);

  // state of whether the add edge button is selected
  const [addEdgeSelected, setAddEdgeSelected] = useState(false);

  // state to store the list of lines
  const [lines, setLines] = useState<string[]>([]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        height: "100vh",
      }}
    >
      <Box sx={{ m: TITLE_MARGIN }}>
        {/* Pass the 4 state variables here to the top bar context */}
        <TopBarContext.Provider
          value={{
            addNodeSelected,
            setAddNodeSelected,
            addEdgeSelected,
            setAddEdgeSelected,
            lines,
            setLines,
          }}
        >
          <TopBar />
        </TopBarContext.Provider>
      </Box>

      {/* Horizontal divider */}
      <Divider />

      {/* Fill the remaining heights */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flexGrow: 1,
          overflow: "auto",
        }}
      >
        <Box sx={{ my: CONTENT_MARGIN }}>
          <SideBarContext.Provider
            value={{
              lines,
              setLines,
            }}
          >
            <SideBar />
          </SideBarContext.Provider>
        </Box>

        <Box sx={{ m: CONTENT_MARGIN }}>
          <Content />
        </Box>
      </Box>
    </Box>
  );
}
