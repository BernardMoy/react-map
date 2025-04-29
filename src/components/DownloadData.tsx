import { DataSet, Edge, Network, Node } from "vis-network";
import { Graph } from "./Graph";
import { Line } from "../pages/Home";

// contains all data that are saved when downloading
export interface DownloadData {
  nodes: any;
  edges: any;
  graph: any;
  lines: Line[];
  unit: string;
}
