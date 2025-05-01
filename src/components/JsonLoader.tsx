// given a json file, load the data into nodes, edges, graph and lines
import { DataSet, Edge, IdType, Network, Node } from "vis-network/standalone";
import { Destination, Graph } from "./Graph";
import { Line } from "../pages/Home";
import { DEFAULT_UNIT } from "./Values";

// through the state set methods
export default function loadFromJson(
  jsonText: string, // json file in the format of string
  setNodes: React.Dispatch<React.SetStateAction<DataSet<Node>>>,
  setEdges: React.Dispatch<React.SetStateAction<DataSet<Edge>>>,
  setGraph: React.Dispatch<React.SetStateAction<Graph>>,
  setLines: React.Dispatch<React.SetStateAction<Line[]>>,
  reset: number,
  setReset: React.Dispatch<React.SetStateAction<number>>,
  setUnit: React.Dispatch<React.SetStateAction<string>>
) {
  // parse the json file from the text
  const file = JSON.parse(jsonText);
  console.log(file);

  // check if all the required field exists
  if (
    file.nodes === undefined ||
    file.edges === undefined ||
    file.graph === undefined ||
    file.lines === undefined
  ) {
    alert("This JSON file is in an invalid format.");
    return;
  }

  // placeholders for the new values
  let loadedNodes: DataSet<Node> = new DataSet<Node>();
  let loadedEdges: DataSet<Edge> = new DataSet<Edge>();
  let loadedGraph: Graph = new Graph();
  let loadedLines: Line[] = [];
  let loadedUnit: string = DEFAULT_UNIT; // unit may not be present. If not, set it to empty string (or mins)

  // read the json file
  try {
    // read the nodes
    for (const node of file.nodes) {
      loadedNodes.add(node);
    }

    // read the edges
    for (const edge of file.edges) {
      loadedEdges.add(edge);
    }

    // read the graph data structure
    const loadedGraphAdj: Map<IdType, Destination[]> = new Map();
    for (const element of file.graph) {
      const source = element[0];
      const destination = element[1];
      loadedGraphAdj.set(source, destination);
    }
    loadedGraph.setAdj(loadedGraphAdj);

    // read the lines
    loadedLines = file.lines as Line[];

    // read the unit that can be undefined (default to mins)
    loadedUnit = file.unit == undefined ? DEFAULT_UNIT : (file.unit as string);

    // at the end, set the fields to be the loaded ones
    setNodes(loadedNodes);
    setEdges(loadedEdges);
    setGraph(loadedGraph);
    setLines(loadedLines);
    setUnit(loadedUnit);

    // force refresh the graph
    setReset(reset + 1);
  } catch (e) {
    // create an error alert
    alert("This JSON file is in an invalid format.");
  }
}
