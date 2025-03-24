import SideBar from "../components/SideBar";
import { Box, Divider } from "@mui/material";
import TopBar from "../components/TopBar";
import Content from "../components/Content";
import { CONTENT_MARGIN, TITLE_MARGIN } from "../components/Values";
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
  nodeList: Node[];
  setNodeList: React.Dispatch<React.SetStateAction<Node[]>>;
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
  addNodeSelected: boolean;
  setAddNodeSelected: React.Dispatch<React.SetStateAction<boolean>>;
  addEdgeSelected: boolean;
  setAddEdgeSelected: React.Dispatch<React.SetStateAction<boolean>>;
  graphRef: React.RefObject<HTMLDivElement | null> | null;
  selectedNodeID: IdType | null;
  setSelectedNodeID: React.Dispatch<React.SetStateAction<IdType | null>>;
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
  nodeList: [],
  setNodeList: () => {},
});

export const SideBarContext = createContext<SideBarContextProps>({
  lines: [],
  setLines: () => {},
  nodeList: [],
  setNodeList: () => {},
  network: null,
});

export const ContentContext = createContext<ContentContextProps>({
  addNodeSelected: false,
  setAddNodeSelected: () => {},
  addEdgeSelected: false,
  setAddEdgeSelected: () => {},
  graphRef: null,
  selectedNodeID: null,
  setSelectedNodeID: () => {},
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

  /* 
  nodes and nodeList stores a DATASET and a LIST (Observable) of the nodes respectively 
  When updating nodes or edges, both have to be updated 
  */
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

  // event functions of the graph
  // set up functions to activate when the canvas is clicked
  const handleClickCanvas = (params: any) => {
    // only perform action if add node selected is true
    if (!addNodeSelected) {
      return;
    }
    if (params.nodes.length == 0 && params.edges.length == 0) {
      // update the x and y positions
      setPosX(params.pointer.canvas.x);
      setPosY(params.pointer.canvas.y);

      // open the dialog and add new node there
      setOpenNewNodeDialog(true);
    }
  };

  const handleSelectNode = (params: any) => {
    if (params.nodes.length > 0) {
      // if add edge selected and selected node id already exists, open the create edge dialog
      const thisNodeID = params.nodes[0];
      if (addEdgeSelected && selectedNodeIDRef.current != null) {
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
    setSelectedNodeIDPrev(null);
    setSelectedNodeID(null);
  };

  useEffect(() => {
    if (!graphRef.current) {
      return;
    }

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
      },
    };

    // create the graph
    const newNetwork = new Network(
      graphRef.current,
      { nodes: nodes, edges: edges },
      options
    );

    newNetwork.on("click", handleClickCanvas);
    newNetwork.on("selectNode", handleSelectNode);
    newNetwork.on("deselectNode", handleDeselectNode);

    // reset the selected node on re render

    // set the network
    setNetwork(newNetwork);

    return () => {
      newNetwork.off("click", handleClickCanvas);
      newNetwork.off("selectNode", handleSelectNode);
      newNetwork.off("deselectNode", handleDeselectNode);
      newNetwork.destroy();
    };
  }, [addNodeSelected, addEdgeSelected]); // re attach the add node selected listener, otherwise the conditional clicking will not work

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
            nodeList,
            setNodeList,
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
              addNodeSelected,
              setAddNodeSelected,
              addEdgeSelected,
              setAddEdgeSelected,
              graphRef,
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
        nodeList={nodeList}
        setNodeList={setNodeList}
        posX={posX}
        posY={posY}
      />

      {/* Dialog of creating new edges */}
      <NewEdgeDialog
        open={openNewEdgeDialog}
        setOpen={setOpenNewEdgeDialog}
        nodeID1={selectedNodeIDPrev}
        nodeID2={selectedNodeID}
        edges={edges}
        setEdges={setEdges}
      />
    </Box>
  );
}
