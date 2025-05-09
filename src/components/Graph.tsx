import { Edge, IdType } from "vis-network/standalone";
import { Line } from "../pages/Home";
import FastPriorityQueue from "fastpriorityqueue";
import { FullRoute } from "./FullRoute";

// define the type stored in the adjacency list (DestinationID, weight, Line)
export interface Destination {
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

  // method to get the data as a json downloadable format
  getAdj(): any {
    return Array.from(this.adj.entries());
  }

  // method to set the adj of the graph, used when loading the graph from json
  setAdj(adj: Map<IdType, Destination[]>): void {
    this.adj = adj;
  }

  // method to add node and return the modified graph
  // nodes still exist even when there are no edges
  addNode(node: IdType): Graph {
    if (!this.adj.has(node)) {
      this.adj.set(node, []);
    }
    return this;
  }

  // method to add edge (UNIDIRECTIONAL)
  addEdge(
    fromNode: IdType,
    toNode: IdType,
    weight: number,
    line: Line,
    bidirectional: boolean
  ): Graph {
    // add node is called before add edge, so can assume the keys exist in the graph
    // add the from -> to edge
    if (this.adj.has(fromNode)) {
      this.adj
        .get(fromNode)
        ?.push({ node: toNode, weight: weight, line: line });
    }
    // add the to -> from edge if bidirectional
    if (bidirectional) {
      if (this.adj.has(toNode)) {
        this.adj
          .get(toNode)
          ?.push({ node: fromNode, weight: weight, line: line });
      }
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

  // method to check if an edge of a specific line exist in the map
  hasLine(line: Line): boolean {
    // iterate the graph to find the line
    for (const [key, value] of this.adj.entries()) {
      for (const dest of value) {
        if (dest.line.lineName.toString() == line.lineName.toString()) {
          return true;
        }
      }
    }

    return false;
  }

  // method to check if the graph is empty
  isEmpty(): boolean {
    return this.adj.size == 0;
  }

  // method to generate the shortest route between two ids
  // return a list of (node, weight, line) object with the FIRST NODE NOT THERE (It is in start)
  findShortestRoute(startNodeID: IdType, endNodeID: IdType): FullRoute {
    // distance of all nodes to the source
    let d = new Map<IdType, number>();
    d.set(startNodeID, 0); // mark source as distance 0

    // map to store node to their parent
    let parents = new Map<IdType, Destination | null>(); // the start node has value = null
    parents.set(startNodeID, null); // mark source as parent = null

    // priority queue
    let q = new FastPriorityQueue<{ distance: number; currentNode: IdType }>(
      function (a: any, b: any) {
        return a.distance < b.distance; // distance as the comparator
      }
    );
    q.add({ distance: 0, currentNode: startNodeID });

    // visited set
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
          parents.set(node, { node: currentNode, weight: weight, line: line }); // only set parent when the node is not start id because the start has to be null
        } else {
          const newDistance = d.get(currentNode)! + weight;
          if (newDistance < d.get(node)!) {
            d.set(node, newDistance);
            parents.set(node, {
              node: currentNode,
              weight: weight,
              line: line,
            }); // only set parent when the new distance is shorter
          }
        }

        // push the neighbour to the heap
        q.add({ distance: d.get(node)!, currentNode: node });
      }

      // mark current node as visited
      visited.add(currentNode);
    }

    // if the end node is not in d, it is unreachable
    if (!d.has(endNodeID)) {
      return new FullRoute(startNodeID, []); // return empty if unreachable
    }

    // extract the route by iterating the parents in reverse
    let route: Destination[] = [];
    let currentNode: IdType = endNodeID;

    while (parents.get(currentNode)) {
      const { node, weight, line } = parents.get(currentNode)!;
      route.unshift({ node: currentNode, weight: weight, line: line }); // use new node, keep current weight and line
      currentNode = node;
    }

    // return the final route in reverse
    return new FullRoute(startNodeID, route);
  }
}
