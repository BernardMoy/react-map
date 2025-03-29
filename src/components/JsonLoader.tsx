// given a json file, load the data into nodes, edges, graph and lines
import { DataSet, Edge, IdType, Network, Node } from "vis-network/standalone";
import { Graph } from "./Graph";
import { Line } from "../pages/Home";

// through the state set methods
export default function loadFromJson(
  jsonText: string, // json file in the format of string
  setNodes: React.Dispatch<React.SetStateAction<DataSet<Node>>>,
  setEdges: React.Dispatch<React.SetStateAction<DataSet<Edge>>>,
  setGraph: React.Dispatch<React.SetStateAction<Graph>>,
  setLines: React.Dispatch<React.SetStateAction<Line[]>>
) {
  // parse the json file from the text
  const file = JSON.parse(jsonText);
  console.log(file);

  // placeholders for the new values
  const loadedNodes: DataSet<Node> = new DataSet<Node>();
  const loadedEdges: DataSet<Edge> = new DataSet<Edge>();
  const loadedGraph: Graph = new Graph();
  const loadedLines: Line[] = [];

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

    // at the end, set the fields to be the loaded ones
    setNodes(loadedNodes);
    setEdges(loadedEdges);
    setGraph(loadedGraph);
    setLines(loadedLines);
  } catch (e) {
    // create an error alert
  }
}
