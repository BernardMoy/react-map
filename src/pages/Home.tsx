import SideBar from "../components/SideBar";
import { Box, Divider } from "@mui/material";
import TopBar from "../components/TopBar";
import Content from "../components/Content";
import { CONTENT_MARGIN, EDGE_WIDTH, TITLE_MARGIN } from "../components/Values";
import React, {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { DataSet, Edge, IdType, Network, Node } from "vis-network/standalone";
import NewNodeDialog from "../components/NewNodeDialog";
import NewEdgeDialog from "../components/NewEdgeDialog";
import { Graph } from "../components/Graph";

// each line const of a name and color (Both strings)
export interface Line {
  lineName: string;
  lineColor: string;
}

// interface to store all items passed to the top bar context
interface TopBarContextProps {
  mode: number;
  setMode: React.Dispatch<React.SetStateAction<number>>;
  lines: Line[];
  setLines: React.Dispatch<React.SetStateAction<Line[]>>;
  network: Network | null;
  selectedNodeID: IdType | null;
  setSelectedNodeID: React.Dispatch<React.SetStateAction<IdType | null>>;
  graph: Graph;
  setGraph: React.Dispatch<React.SetStateAction<Graph>>;
  selectedEdgeID: IdType | null;
  setSelectedEdgeID: React.Dispatch<React.SetStateAction<IdType | null>>;
  tabNumber: number;
  setTabNumber: React.Dispatch<React.SetStateAction<number>>;
}

// interface to store all items for the sidebar
interface SideBarContextProps {
  lines: Line[];
  setLines: React.Dispatch<React.SetStateAction<Line[]>>;
  graph: Graph;
  setGraph: React.Dispatch<React.SetStateAction<Graph>>;
  network: Network | null;
  tabNumber: number;
  setTabNumber: React.Dispatch<React.SetStateAction<number>>;
}

// interface to store all items for the main content (Graph)
interface ContentContextProps {
  mode: number;
  setMode: React.Dispatch<React.SetStateAction<number>>;
  graphDatasetRef: React.RefObject<HTMLDivElement | null> | null;
  selectedNodeID: IdType | null;
  setSelectedNodeID: React.Dispatch<React.SetStateAction<IdType | null>>;
}

// create the contexts here and initialise them with values
export const TopBarContext = createContext<TopBarContextProps>({
  mode: 0,
  setMode: () => {},
  lines: [],
  setLines: () => {},
  network: null,
  selectedNodeID: null,
  setSelectedNodeID: () => {},
  graph: new Graph(),
  setGraph: () => {},
  selectedEdgeID: null,
  setSelectedEdgeID: () => {},
  tabNumber: 0,
  setTabNumber: () => {},
});

export const SideBarContext = createContext<SideBarContextProps>({
  lines: [],
  setLines: () => {},
  graph: new Graph(),
  setGraph: () => {},
  network: null,
  tabNumber: 0,
  setTabNumber: () => {},
});

export const ContentContext = createContext<ContentContextProps>({
  mode: 0,
  setMode: () => {},
  graphDatasetRef: null,
  selectedNodeID: null,
  setSelectedNodeID: () => {},
});

// main function
export default function Home() {
  // state of the mode of the application: 0 is none, 1 is ADD NODE, 2 is ADD EDGE, 3 is FIND ROUTE
  const [mode, setMode] = useState(0);

  // state of whether the nodes tab or line tab is selected (0 for nodes, 1 for lines)
  const [tabNumber, setTabNumber] = useState(0);

  // state to store the list of lines
  const [lines, setLines] = useState<Line[]>([]);

  /* 
  nodes and nodeList stores a DATASET and a LIST (Observable) of the nodes respectively 
  When updating nodes or edges, both have to be updated 
  */
  // state to store the list of nodes and edges
  const [nodes, setNodes] = useState<DataSet<Node>>(new DataSet<Node>([]));
  const [edges, setEdges] = useState<DataSet<Edge>>(new DataSet<Edge>([]));

  // store the graph state
  const [graph, setGraph] = useState<Graph>(new Graph());

  // store the graph ref
  const graphDatasetRef = useRef<HTMLDivElement>(null);
  const [network, setNetwork] = useState<Network | null>(null);

  // state of the dialogs whether they are open
  const [openNewNodeDialog, setOpenNewNodeDialog] = useState(false);
  const [openNewEdgeDialog, setOpenNewEdgeDialog] = useState(false);

  // state of the clicked position
  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);

  // extra ref for the selected node id such that it can be observed in useEffect()
  const selectedNodeIDRef = useRef<IdType | null>(null);

  // store the selected graph node
  const [selectedNodeID, setSelectedNodeID] = useState<IdType | null>(null);

  // state of the previous node used for creating edge
  const [selectedNodeIDPrev, setSelectedNodeIDPrev] = useState<IdType | null>(
    null
  );

  // store the selected graph edge
  const [selectedEdgeID, setSelectedEdgeID] = useState<IdType | null>(null);

  // prevent exiting the window if there are unsaved changes
  useEffect(() => {
    function handleOnBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
      event.returnValue = "";
    }

    // add the listener only when the graph is not empty or line is not empty to prevent exit
    if (!graph.isEmpty() || lines.length > 0) {
      window.addEventListener("beforeunload", handleOnBeforeUnload, {
        capture: true,
      });
    }

    return () =>
      window.removeEventListener("beforeunload", handleOnBeforeUnload);
  }, [graph, lines]);

  // event functions of the graph
  // set up functions to activate when the canvas is clicked
  const handleClickCanvas = (params: any) => {
    if (
      mode === 1 && // ensure the BLANK canvas is clicked instead of the nodes or edges
      params.nodes.length === 0 &&
      params.edges.length === 0
    ) {
      // update the x and y positions
      setPosX(params.pointer.canvas.x);
      setPosY(params.pointer.canvas.y);

      // open the dialog and add new node there
      setOpenNewNodeDialog(true);
    } else if (
      mode === 2 &&
      params.nodes.length === 0 // if it is NOT clicking a node (Canvas or edge), reset all selected nodes
    ) {
      // reset all selected node ids
      selectedNodeIDRef.current = null;
      setSelectedNodeID(null);
      setSelectedNodeIDPrev(null);
    }
  };

  const handleSelectNode = (params: any) => {
    if (params.nodes.length > 0) {
      // if add edge selected and selected node id already exists, open the create edge dialog
      const thisNodeID = params.nodes[0];
      if (mode === 2 && selectedNodeIDRef.current != null) {
        // set the previous node id as the already selected one
        setSelectedNodeIDPrev(selectedNodeIDRef.current);

        // set the current selected node id for consistency
        selectedNodeIDRef.current = thisNodeID;
        setSelectedNodeID(thisNodeID);

        // open dialog
        setOpenNewEdgeDialog(true);
      } else {
        // extract the first selected node and store it
        selectedNodeIDRef.current = thisNodeID;
        setSelectedNodeID(thisNodeID);
      }
    }
  };

  const handleDeselectNode = (params: any) => {
    // the deselect event is triggered first
    if (mode !== 2) {
      selectedNodeIDRef.current = null;
      setSelectedNodeID(null);
    }
  };

  const handleSelectEdge = (params: any) => {
    if (params.edges.length > 0) {
      // if add edge selected and selected node id already exists, open the create edge dialog
      const thisEdgeID = params.edges[0];
      setSelectedEdgeID(thisEdgeID);
    }
  };

  const handleDeselectEdge = (params: any) => {
    // the deselect event is triggered first
    setSelectedEdgeID(null);
  };

  const handleDragEnd = (params: any) => {
    if (params.nodes.length > 0) {
      // get the dragged node from the node id
      const draggedNodeID = params.nodes[0];

      // update the x and y position of the dragged node to the current position so it stays at the new pos
      nodes.update({
        id: draggedNodeID,
        x: params.pointer.canvas.x,
        y: params.pointer.canvas.y,
      });
    }
  };

  useEffect(() => {
    // print the graph when updated
    console.log("Updated graph\n" + graph.toString());

    if (!graphDatasetRef.current) {
      return;
    }

    // reset the selected fields at the beginning of graph refresh
    setSelectedNodeID(null);
    setSelectedNodeIDPrev(null);
    selectedNodeIDRef.current = null;
    setSelectedEdgeID(null);

    // calculate the graph height after subtracting the topbar height
    const topBarHeight = document.getElementById("topBar")?.offsetHeight || 0;
    const calculatedGraphHeight =
      window.innerHeight - topBarHeight - 16 * (CONTENT_MARGIN + TITLE_MARGIN); // values are multiplied by 8 -> 2*8 = 16

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
        selectConnectedEdges: false,
      },
      edges: {
        width: EDGE_WIDTH,
      },
    };

    // create the graph
    const newNetwork = new Network(
      graphDatasetRef.current,
      { nodes: nodes, edges: edges },
      options
    );

    newNetwork.on("click", handleClickCanvas);
    newNetwork.on("selectNode", handleSelectNode);
    newNetwork.on("deselectNode", handleDeselectNode);
    newNetwork.on("selectEdge", handleSelectEdge);
    newNetwork.on("deselectEdge", handleDeselectEdge);
    newNetwork.on("dragEnd", handleDragEnd);

    // set the network
    setNetwork(newNetwork);

    return () => {
      newNetwork.off("click", handleClickCanvas);
      newNetwork.off("selectNode", handleSelectNode);
      newNetwork.off("deselectNode", handleDeselectNode);
      newNetwork.off("selectEdge", handleSelectEdge);
      newNetwork.off("deselectEdge", handleDeselectEdge);
      newNetwork.off("dragEnd", handleDragEnd);
      newNetwork.destroy();
    };
  }, [mode]); // re attach the add node selected listener, otherwise the conditional clicking will not work

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
            mode,
            setMode,
            lines,
            setLines,
            network,
            selectedNodeID,
            setSelectedNodeID,
            graph,
            setGraph,
            selectedEdgeID,
            setSelectedEdgeID,
            tabNumber,
            setTabNumber,
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
              graph,
              setGraph,
              network,
              tabNumber,
              setTabNumber,
            }}
          >
            <SideBar />
          </SideBarContext.Provider>
        </Box>

        <Box sx={{ m: CONTENT_MARGIN }}>
          <ContentContext.Provider
            value={{
              mode,
              setMode,
              graphDatasetRef,
              selectedNodeID,
              setSelectedNodeID,
            }}
          >
            <Content />
          </ContentContext.Provider>
        </Box>
      </Box>

      {/* Dialogs */}
      {/* Dialog of creating new node */}
      <NewNodeDialog
        open={openNewNodeDialog}
        setOpen={setOpenNewNodeDialog}
        nodes={nodes}
        setNodes={setNodes}
        graph={graph}
        setGraph={setGraph}
        posX={posX}
        posY={posY}
        tabNumber={tabNumber}
        setTabNumber={setTabNumber}
      />

      {/* Dialog of creating new edges */}
      <NewEdgeDialog
        open={openNewEdgeDialog}
        setOpen={setOpenNewEdgeDialog}
        nodeID1={selectedNodeIDPrev}
        nodeID2={selectedNodeID}
        edges={edges}
        setEdges={setEdges}
        graph={graph}
        setGraph={setGraph}
        lines={lines}
        setLines={setLines}
      />
    </Box>
  );
}
