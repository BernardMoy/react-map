import { Edge, IdType } from "vis-network/standalone";
import { Line } from "../pages/Home";
import FastPriorityQueue from "fastpriorityqueue";

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

  // method to check if the graph is empty
  isEmpty(): boolean {
    return this.adj.size == 0;
  }

  // method to generate the shortest route between two ids
  findShortestRoute(startNodeID: IdType, endNodeID: IdType): IdType[] {
    // distance of all nodes to the source
    let d = new Map<IdType, number>();
    d.set(startNodeID, 0); // mark source as distance 0

    // map to store node to their parent
    let parents = new Map<IdType, IdType | null>();
    parents.set(startNodeID, null); // mark source as parent = null

    // priority queue
    let q = new FastPriorityQueue<{ distance: number; currentNode: IdType }>(
      function (a: any, b: any) {
        return a.distance < b.distance; // distance as the comparator
      }
    );
    let visited = new Set<IdType>();

    // while q is non empty
    while (!q.isEmpty()) {
      // pop from the queue
      let { distance, currentNode } = q.poll()!;

      // skip if node is visited or not in graph (Sink node)
      if (visited.has(currentNode) || !this.adj.has(currentNode)) {
        continue;
      }

      // iterate the neighbours of the node in the graph
      for (let { node, weight, line } of this.adj.get(currentNode)!) {
        // newly visited neighbour
        if (!d.has(node)) {
          d.set(node, d.get(currentNode)! + weight);
        } else {
          d.set(node, Math.min(d.get(node)!, d.get(currentNode)! + weight));
        }

        // push the neighbour to the heap
        q.add({ distance: d.get(node)!, currentNode: node });

        // mark the parent of node as currentNode
        parents.set(node, currentNode);
      }

      // mark current node as visited
      visited.add(currentNode);
    }

    // if the end node is not in the parents map, it is unreachable
    if (!parents.has(endNodeID)) {
      return []; // return empty list if not reachable
    }

    // extract the route by iterating the parents in reverse
    let route: IdType[] = [];
    let currentParent: IdType = endNodeID;
    while (currentParent != null) {
      route.unshift(currentParent); // add parent to front
      currentParent = parents.get(currentParent)!;
    }

    // return the final route in reverse
    return route;
  }
}
