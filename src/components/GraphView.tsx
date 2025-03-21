import {
  defineGraph,
  defineGraphConfig,
  defineLink,
  defineNodeWithDefaults,
  Graph,
  GraphController,
  GraphLink,
  GraphNode,
} from "d3-graph-controller";
import "d3-graph-controller/default.css";
import { useEffect, useRef } from "react";

export default function GraphView() {
  // reference
  const ref = useRef<HTMLDivElement | null>(null);
  let controller: GraphController | null = null;

  // custom nodes
  const nodeA: GraphNode<string> = defineNodeWithDefaults({
    type: "node",
    id: "a",
    label: {
      color: "black",
      fontSize: "1rem",
      text: "Node A",
    },
  });

  const nodeB: GraphNode<string> = defineNodeWithDefaults({
    type: "node",
    id: "b",
    label: {
      color: "black",
      fontSize: "1rem",
      text: "Node A",
    },
  });

  const edgeAToB: GraphLink<
    string,
    GraphNode<string>,
    GraphNode<string>
  > = defineLink({
    source: nodeA,
    target: nodeB,
    color: "gray",
    label: false,
  });

  // define graph
  const graph = defineGraph({
    nodes: [nodeA, nodeB],
    links: [edgeAToB],
  });

  // define graph config
  const config = defineGraphConfig();

  // use effect -> Do something after render
  useEffect(() => {
    if (ref.current) {
      controller = new GraphController(ref.current, graph, config);

      return () => {
        controller?.shutdown();
      };
    }
  }, []);

  return (
    <div
      ref={ref}
      style={{ width: "100%", height: "500px", border: "1px solid black" }}
    />
  );
}
