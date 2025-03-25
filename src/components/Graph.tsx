import { Edge, IdType } from "vis-network/standalone";
import { Line } from "../pages/Home";

// define the type stored in the adjacency list (DestinationID, weight, Line)
interface Destination {
  node: IdType;
  weight: number;
  line: Line;
}
export class Graph {
  // Map of type {s1: [(d1, w1, l1), ...], s2:...}
  private adj: Map<IdType, Destination[]>;

  // constructor to create a new map for the graph
  constructor(graph?: Graph) {
    // if an original graph is provided,
    this.adj = graph ? new Map(graph.adj) : new Map();
  }

  // method to add node and return the modified graph
  // nodes still exist even when there are no edges
  addNode(node: IdType): Graph {
    if (!this.adj.has(node)) {
      this.adj.set(node, []);
    }
    return this;
  }

  // method to add edge
  addEdge(fromNode: IdType, toNode: IdType, weight: number, line: Line): Graph {
    // add node is called before add edge, so can assume the keys exist in the graph
    // add the from -> to edge
    if (this.adj.has(fromNode)) {
      this.adj
        .get(fromNode)
        ?.push({ node: toNode, weight: weight, line: line });
    }
    // add the to -> from edge
    if (this.adj.has(toNode)) {
      this.adj
        .get(toNode)
        ?.push({ node: fromNode, weight: weight, line: line });
    }

    return this;
  }

  // method to delete node
  deleteNode(node: IdType): Graph {
    // delete the node from the key
    this.adj.delete(node);

    // for each of the remaining edges, if the node show up as "toNode" in the destination, remove that tuple from the list
    for (const [key, value] of this.adj.entries()) {
      const filteredValue = value.filter((dest) => dest.node != node); // .filter creates a new array
      this.adj.set(key, filteredValue);
    }

    return this;
  }

  // method to delete edge
  deleteEdge(fromNode: IdType, toNode: IdType): Graph {
    // for source = fromNode, delete ALL Instances of toNode from the list
    if (this.adj.has(fromNode)) {
      const valueFromNode = this.adj.get(fromNode);
      const filteredValueFromNode = valueFromNode?.filter(
        (dest) => dest.node != toNode
      );
      this.adj.set(fromNode, filteredValueFromNode!);
    }

    // for source = toNode, delete ALL Instances of fromNode from the list
    if (this.adj.has(toNode)) {
      const valueToNode = this.adj.get(toNode);
      const filteredValueToNode = valueToNode?.filter(
        (dest) => dest.node != fromNode
      );
      this.adj.set(toNode, filteredValueToNode!);
    }

    return this;
  }

  // method to return all nodes as a list
  getNode(): IdType[] {
    return Array.from(this.adj.keys());
  }

  // method to print the graph
  toString(): string {
    let output = "";
    for (const [key, value] of this.adj.entries()) {
      output += key + " | " + JSON.stringify(value) + "\n";
    }

    return output;
  }

  // method to check if node exist in the key of map
  hasNode(nodeID: string): boolean {
    return this.adj.has(nodeID);
  }
}
