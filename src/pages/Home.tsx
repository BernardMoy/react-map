import SideBar from "../components/SideBar";
import { Box, Divider } from "@mui/material";
import TopBar from "../components/TopBar";
import Content from "../components/Content";
import { CONTENT_MARGIN, TITLE_MARGIN } from "../components/Values";
import React, { createContext, useEffect, useState } from "react";
import { DataSet, Edge, IdType, Network, Node } from "vis-network/standalone";

// each line const of a name and color (Both strings)
export interface Line {
  lineName: string;
  lineColor: string;
}

// interface to store all items passed to the top bar context
interface TopBarContextProps {
  addNodeSelected: boolean;
  setAddNodeSelected: React.Dispatch<React.SetStateAction<boolean>>;
  addEdgeSelected: boolean;
  setAddEdgeSelected: React.Dispatch<React.SetStateAction<boolean>>;
  lines: Line[];
  setLines: React.Dispatch<React.SetStateAction<Line[]>>;
}

// interface to store all items for the sidebar
interface SideBarContextProps {
  lines: Line[];
  setLines: React.Dispatch<React.SetStateAction<Line[]>>;
  nodeList: Node[];
  setNodeList: React.Dispatch<React.SetStateAction<Node[]>>;
  selectedNodeIDs: IdType[];
  setSelectedNodeIDs: React.Dispatch<React.SetStateAction<IdType[]>>;
}

// interface to store all items for the main content (Graph)
interface ContentContextProps {
  nodes: DataSet<Node>;
  setNodes: React.Dispatch<React.SetStateAction<DataSet<Node>>>;
  nodeList: Node[];
  setNodeList: React.Dispatch<React.SetStateAction<Node[]>>;
  edges: DataSet<Edge>;
  setEdges: React.Dispatch<React.SetStateAction<DataSet<Edge>>>;
  addNodeSelected: boolean;
  setAddNodeSelected: React.Dispatch<React.SetStateAction<boolean>>;
  addEdgeSelected: boolean;
  setAddEdgeSelected: React.Dispatch<React.SetStateAction<boolean>>;
  selectedNodeIDs: IdType[];
  setSelectedNodeIDs: React.Dispatch<React.SetStateAction<IdType[]>>;
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
  nodeList: [],
  setNodeList: () => {},
  selectedNodeIDs: [],
  setSelectedNodeIDs: () => {},
});

export const ContentContext = createContext<ContentContextProps>({
  nodes: new DataSet<Node>([]),
  setNodes: () => {},
  nodeList: [],
  setNodeList: () => {},
  edges: new DataSet<Edge>([]),
  setEdges: () => {},
  addNodeSelected: false,
  setAddNodeSelected: () => {},
  addEdgeSelected: false,
  setAddEdgeSelected: () => {},
  selectedNodeIDs: [],
  setSelectedNodeIDs: () => {},
});

// main function
export default function Home() {
  // prevent exiting the window if there are unsaved changes
  /*
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
  */

  // state of whether the add node button is selected
  const [addNodeSelected, setAddNodeSelected] = useState(false);

  // state of whether the add edge button is selected
  const [addEdgeSelected, setAddEdgeSelected] = useState(false);

  // state to store the list of lines
  const [lines, setLines] = useState<Line[]>([]);

  // state to store the list of nodes and edges
  const [nodes, setNodes] = useState<DataSet<Node>>(new DataSet<Node>([]));
  const [edges, setEdges] = useState<DataSet<Edge>>(new DataSet<Edge>([]));

  // store the LIST of nodes and edges
  // They get re-rendered automatically while the DataSet<> object does not
  const [nodeList, setNodeList] = useState<Node[]>([]);
  const [edgeList, setEdgeList] = useState<Edge[]>([]);

  // store a list of selected node ids
  const [selectedNodeIDs, setSelectedNodeIDs] = useState<IdType[]>([]);

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
              nodeList,
              setNodeList,
              selectedNodeIDs,
              setSelectedNodeIDs,
            }}
          >
            <SideBar />
          </SideBarContext.Provider>
        </Box>

        <Box sx={{ m: CONTENT_MARGIN }}>
          <ContentContext.Provider
            value={{
              nodes,
              setNodes,
              nodeList,
              setNodeList,
              edges,
              setEdges,
              addNodeSelected,
              setAddNodeSelected,
              addEdgeSelected,
              setAddEdgeSelected,
              selectedNodeIDs,
              setSelectedNodeIDs,
            }}
          >
            <Content />
          </ContentContext.Provider>
        </Box>
      </Box>
    </Box>
  );
}
