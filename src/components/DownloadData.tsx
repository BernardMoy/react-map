import { DataSet, Edge, Network, Node } from "vis-network";
import { Graph } from "./Graph";
import { Line } from "../pages/Home";

// contains all data that are saved when downloading
export interface DownloadData {
  network: Network;
  nodes: DataSet<Node>;
  edges: DataSet<Edge>;
  graph: Graph;
  lines: Line[];
}
