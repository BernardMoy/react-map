import SideBar from "../components/SideBar";
import { Box, Divider } from "@mui/material";
import TopBar from "../components/TopBar";
import Content from "../components/Content";
import {
  CONTENT_MARGIN,
  DEFAULT_UNIT,
  EDGE_WIDTH,
  EDGE_WIDTH_HOVERED,
  EDGE_WIDTH_SELECTED,
  NODE_BORDER_COLOR_SELECTED,
  NODE_BORDER_WIDTH_HOVERED,
  NODE_BORDER_WIDTH_SELECTED,
  NODE_COLOR,
  NODE_COLOR_HOVERED,
  NODE_COLOR_SELECTED,
  TITLE_MARGIN,
} from "../components/Values";
import React, { createContext, useEffect, useRef, useState } from "react";
import { DataSet, Edge, IdType, Network, Node } from "vis-network/standalone";
import NewNodeDialog from "../components/NewNodeDialog";
import NewEdgeDialog from "../components/NewEdgeDialog";
import { Graph } from "../components/Graph";
import SideBarRight from "../components/SideBarRight";
import { FullRoute } from "../components/FullRoute";

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
  routeStartNodeID: IdType | null;
  setRouteStartNodeID: React.Dispatch<React.SetStateAction<IdType | null>>;
  routeEndNodeID: IdType | null;
  setRouteEndNodeID: React.Dispatch<React.SetStateAction<IdType | null>>;
  reset: number;
  setReset: React.Dispatch<React.SetStateAction<number>>;
  nodes: DataSet<Node>;
  setNodes: React.Dispatch<React.SetStateAction<DataSet<Node>>>;
  edges: DataSet<Edge>;
  setEdges: React.Dispatch<React.SetStateAction<DataSet<Edge>>>;
  edgeTempMap: Map<IdType, string>;
  setEdgeTempMap: React.Dispatch<React.SetStateAction<Map<IdType, string>>>;
  nodeTempSet: Set<IdType>;
  setNodeTempSet: React.Dispatch<React.SetStateAction<Set<IdType>>>;
  unit: string;
  setUnit: React.Dispatch<React.SetStateAction<string>>;
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

interface SideBarRightContextProps {
  routeStartNodeID: IdType | null;
  setRouteStartNodeID: React.Dispatch<React.SetStateAction<IdType | null>>;
  routeEndNodeID: IdType | null;
  setRouteEndNodeID: React.Dispatch<React.SetStateAction<IdType | null>>;
  selectedNodeID: IdType | null;
  graph: Graph;
  setGraph: React.Dispatch<React.SetStateAction<Graph>>;
  network: Network | null;
  reset: number;
  setReset: React.Dispatch<React.SetStateAction<number>>;
  nodes: DataSet<Node>;
  setNodes: React.Dispatch<React.SetStateAction<DataSet<Node>>>;
  edges: DataSet<Edge>;
  setEdges: React.Dispatch<React.SetStateAction<DataSet<Edge>>>;
  edgeTempMap: Map<IdType, string>;
  setEdgeTempMap: React.Dispatch<React.SetStateAction<Map<IdType, string>>>;
  nodeTempSet: Set<IdType>;
  setNodeTempSet: React.Dispatch<React.SetStateAction<Set<IdType>>>;
  route: FullRoute | null;
  setRoute: React.Dispatch<React.SetStateAction<FullRoute | null>>;
  unit: string;
}

// interface to store all items for the main content (Graph)
interface ContentContextProps {
  mode: number;
  setMode: React.Dispatch<React.SetStateAction<number>>;
  graphDatasetRef: React.RefObject<HTMLDivElement | null> | null;
  selectedNodeID: IdType | null;
  setSelectedNodeID: React.Dispatch<React.SetStateAction<IdType | null>>;
  lines: Line[];
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
  routeStartNodeID: null,
  setRouteStartNodeID: () => {},
  routeEndNodeID: null,
  setRouteEndNodeID: () => {},
  reset: 0,
  setReset: () => {},
  nodes: new DataSet<Node>(),
  setNodes: () => {},
  edges: new DataSet<Edge>(),
  setEdges: () => {},
  edgeTempMap: new Map(),
  setEdgeTempMap: () => {},
  nodeTempSet: new Set(),
  setNodeTempSet: () => {},
  unit: "",
  setUnit: () => {},
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

export const SideBarRightContext = createContext<SideBarRightContextProps>({
  routeStartNodeID: null,
  setRouteStartNodeID: () => {},
  routeEndNodeID: null,
  setRouteEndNodeID: () => {},
  selectedNodeID: null,
  graph: new Graph(),
  setGraph: () => {},
  network: null,
  reset: 0,
  setReset: () => {},
  nodes: new DataSet<Node>(),
  setNodes: () => {},
  edges: new DataSet<Edge>(),
  setEdges: () => {},
  edgeTempMap: new Map(),
  setEdgeTempMap: () => {},
  nodeTempSet: new Set(),
  setNodeTempSet: () => {},
  route: null,
  setRoute: () => {},
  unit: "",
});

export const ContentContext = createContext<ContentContextProps>({
  mode: 0,
  setMode: () => {},
  graphDatasetRef: null,
  selectedNodeID: null,
  setSelectedNodeID: () => {},
  lines: [],
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

  // state of the zoom level of the graph
  const [zoom, setZoom] = useState(1);

  // extra ref for the selected node id such that it can be observed in useEffect()
  const selectedNodeIDRef = useRef<IdType | null>(null);

  // store the selected graph node
  const [selectedNodeID, setSelectedNodeID] = useState<IdType | null>(null);

  // state of the previous node used for creating edge
  const [selectedNodeIDPrev, setSelectedNodeIDPrev] = useState<IdType | null>(
    null
  );

  // store the unit as string
  const [unit, setUnit] = useState<string>(DEFAULT_UNIT);

  // store the selected graph edge
  const [selectedEdgeID, setSelectedEdgeID] = useState<IdType | null>(null);

  // store the route start and end node id
  const [routeStartNodeID, setRouteStartNodeID] = useState<IdType | null>(null);
  const [routeEndNodeID, setRouteEndNodeID] = useState<IdType | null>(null);

  // a state to trigger resetting the graph
  const [reset, setReset] = useState<number>(0);

  // store the temporary edge colors that are overridden by gray during route selection
  // it is emptied restored during every refresh of the graph
  const [edgeTempMap, setEdgeTempMap] = useState<Map<IdType, string>>(
    new Map()
  );
  const [nodeTempSet, setNodeTempSet] = useState<Set<IdType>>(new Set());

  // store the FullRoute object that is loaded on "Find route"
  const [route, setRoute] = useState<FullRoute | null>(null);

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
      // reset all selected node ids and also the previously selected node id
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

  const handleZoom = (params: any) => {
    // store the zoom level
    setZoom(params.scale);
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

    // reset the route
    setRoute(null);

    // calculate the graph height after subtracting the topbar height
    const topBarHeight = document.getElementById("topBar")?.offsetHeight || 0;
    const calculatedGraphHeight =
      window.innerHeight - topBarHeight - 16 * (CONTENT_MARGIN + TITLE_MARGIN); // values are multiplied by 8 -> 2*8 = 16

    // restore the nodes in the node temp set by restoring the original node colors
    nodeTempSet.forEach((value: IdType) => {
      nodes.update({ id: value, color: NODE_COLOR });
    });
    // clear the node temp set
    setNodeTempSet(new Set());

    // restore the edges in the edge temp map by setting visible and restore its color
    edgeTempMap.forEach((value: string, key: IdType) => {
      edges.update({ id: key, color: value, hidden: false });
    });
    // clear the edge temp map
    setEdgeTempMap(new Map());

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
        chosen: {
          edge: function (
            values: any,
            id: IdType,
            selected: boolean,
            hovering: boolean
          ) {
            if (selected) {
              values.width = EDGE_WIDTH_SELECTED;
            } else if (hovering) {
              values.width = EDGE_WIDTH_HOVERED;
            }
          },
        } as any,
        arrows: {
          to: {
            enabled: true,
            scaleFactor: 0.3,
          },
        },
      },
      nodes: {
        chosen: {
          node: function (
            values: any,
            id: IdType,
            selected: boolean,
            hovering: boolean
          ) {
            if (selected) {
              values.color = NODE_COLOR_SELECTED;
              values.borderWidth = NODE_BORDER_WIDTH_SELECTED;
              values.borderColor = NODE_BORDER_COLOR_SELECTED;
            } else if (hovering) {
              values.color = NODE_COLOR_HOVERED;
              values.borderWidth = NODE_BORDER_WIDTH_HOVERED;
            }
          },
        } as any,
      },
    };

    // create the graph here using nodes, edges and options
    const newNetwork = new Network(
      graphDatasetRef.current,
      { nodes: nodes, edges: edges },
      options
    );

    // restore the previous zoom level
    newNetwork.moveTo({ scale: zoom });

    newNetwork.on("click", handleClickCanvas);
    newNetwork.on("selectNode", handleSelectNode);
    newNetwork.on("deselectNode", handleDeselectNode);
    newNetwork.on("selectEdge", handleSelectEdge);
    newNetwork.on("deselectEdge", handleDeselectEdge);
    newNetwork.on("dragEnd", handleDragEnd);
    newNetwork.on("zoom", handleZoom);

    // set the network
    setNetwork(newNetwork);

    return () => {
      newNetwork.off("click", handleClickCanvas);
      newNetwork.off("selectNode", handleSelectNode);
      newNetwork.off("deselectNode", handleDeselectNode);
      newNetwork.off("selectEdge", handleSelectEdge);
      newNetwork.off("deselectEdge", handleDeselectEdge);
      newNetwork.off("dragEnd", handleDragEnd);
      newNetwork.off("zoom", handleZoom);
      newNetwork.destroy();
    };
  }, [mode, reset]); // re attach the add node selected listener, otherwise the conditional clicking will not work

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
            routeStartNodeID,
            setRouteStartNodeID,
            routeEndNodeID,
            setRouteEndNodeID,
            reset,
            setReset,
            nodes,
            setNodes,
            edges,
            setEdges,
            edgeTempMap,
            setEdgeTempMap,
            nodeTempSet,
            setNodeTempSet,
            unit,
            setUnit,
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
              lines,
            }}
          >
            <Content />
          </ContentContext.Provider>
        </Box>

        <Box sx={{ my: CONTENT_MARGIN }}>
          <SideBarRightContext.Provider
            value={{
              routeStartNodeID,
              setRouteStartNodeID,
              routeEndNodeID,
              setRouteEndNodeID,
              selectedNodeID,
              graph,
              setGraph,
              network,
              reset,
              setReset,
              nodes,
              setNodes,
              edges,
              setEdges,
              edgeTempMap,
              setEdgeTempMap,
              nodeTempSet,
              setNodeTempSet,
              route,
              setRoute,
              unit,
            }}
          >
            <SideBarRight />
          </SideBarRightContext.Provider>
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
