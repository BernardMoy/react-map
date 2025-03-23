import SideBar from "../components/SideBar";
import { Box, Divider } from "@mui/material";
import TopBar from "../components/TopBar";
import Content from "../components/Content";
import { CONTENT_MARGIN, TITLE_MARGIN } from "../components/Values";
import React, { createContext, useEffect, useRef, useState } from "react";
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
  network: Network | null;
  selectedNodeID: IdType | null;
  setSelectedNodeID: React.Dispatch<React.SetStateAction<IdType | null>>;
}

// interface to store all items for the sidebar
interface SideBarContextProps {
  lines: Line[];
  setLines: React.Dispatch<React.SetStateAction<Line[]>>;
  nodeList: Node[];
  setNodeList: React.Dispatch<React.SetStateAction<Node[]>>;
  network: Network | null;
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
  network: Network | null;
  graphRef: React.RefObject<HTMLDivElement | null> | null;
}

// create the contexts here and initialise them with values
export const TopBarContext = createContext<TopBarContextProps>({
  addNodeSelected: false, // the default values are passed here
  setAddNodeSelected: () => {},
  addEdgeSelected: false,
  setAddEdgeSelected: () => {},
  lines: [],
  setLines: () => {},
  network: null,
  selectedNodeID: null,
  setSelectedNodeID: () => {},
});

export const SideBarContext = createContext<SideBarContextProps>({
  lines: [],
  setLines: () => {},
  nodeList: [],
  setNodeList: () => {},
  network: null,
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
  network: null,
  graphRef: null,
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

  // store the graph ref
  const graphRef = useRef<HTMLDivElement>(null);
  const [network, setNetwork] = useState<Network | null>(null);

  // store the selected graph node
  const [selectedNodeID, setSelectedNodeID] = useState<IdType | null>(null);

  useEffect(() => {
    if (!graphRef.current) {
      return;
    }

    // calculate the graph height after subtracting the topbar height
    const topBarHeight = document.getElementById("topBar")?.offsetHeight || 0;
    const calculatedGraphHeight =
      window.innerHeight - topBarHeight - 16 * (CONTENT_MARGIN + TITLE_MARGIN); // values are multiplied by 8 -> 2*8 = 16

    console.log(calculatedGraphHeight);

    // graph options
    const options = {
      autoResize: true,
      width: "100%",
      height: `${calculatedGraphHeight}px`,
      physics: {
        enabled: false,
      },
      interaction: {
        hover: true,
      },
    };

    // create the graph
    const newNetwork = new Network(
      graphRef.current,
      { nodes: nodes, edges: edges },
      options
    );

    // set up event triggers when the nodes of the graph are clicked
    newNetwork.on("selectNode", (params) => {
      // extract the first selected node and store it
      if (params.nodes.length > 0) {
        setSelectedNodeID(params.nodes[0]);
      }
    });

    newNetwork.on("deselectNode", (params) => {
      // the deselect event is triggered first
      setSelectedNodeID(null);
    });

    // set the network
    setNetwork(newNetwork);

    return () => newNetwork.destroy();
  }, [addNodeSelected]); // re attach the add node selected listener, otherwise the conditional clicking will not work

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        height: "100vh",
      }}
    >
      <Box id="topBar" sx={{ m: TITLE_MARGIN }}>
        {/* Pass the 4 state variables here to the top bar context */}
        <TopBarContext.Provider
          value={{
            addNodeSelected,
            setAddNodeSelected,
            addEdgeSelected,
            setAddEdgeSelected,
            lines,
            setLines,
            network,
            selectedNodeID,
            setSelectedNodeID,
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
              network,
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
              network,
              graphRef,
            }}
          >
            <Content />
          </ContentContext.Provider>
        </Box>
      </Box>
    </Box>
  );
}
