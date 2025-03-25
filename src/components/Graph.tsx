import { Edge, IdType, Node } from "vis-network/standalone";
import { Line } from "../pages/Home";

// define the type stored in the adjacency list (DestinationID, weight, Line)
interface Destination {
  node: Node;
  weight: number;
  line: Line;
}
class Graph {
  // Map of type {s1: [(d1, w1, l1), ...], s2:...}
  private adj: Map<Node, Destination[]>;

  // constructor to create a new map for the graph
  constructor() {
    this.adj = new Map();
  }

  // method to add node
  // nodes still exist even when there are no edges
  addNode(node: Node): void {
    if (!this.adj.has(node)) {
      this.adj.set(node, []);
    }
  }

  // method to add edge
  addEdge(fromNode: Node, toNode: Node, weight: number, line: Line): void {
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
  }

  // method to delete node
  deleteNode(node: Node) {
    // delete the node from the key
    this.adj.delete(node);

    // for each of the remaining edges, if the node show up as "toNode" in the destination, remove that tuple from the list
    for (const [key, value] of this.adj.entries()) {
      const filteredValue = value.filter((dest) => dest.node != node); // .filter creates a new array
      this.adj.set(key, filteredValue);
    }
  }

  // method to delete edge
  deleteEdge(fromNode: Node, toNode: Node) {
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
  }
}
