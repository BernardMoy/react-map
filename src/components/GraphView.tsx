import { useContext, useEffect, useRef, useState } from "react";
import { DataSet, Edge, IdType, Network, Node } from "vis-network/standalone";
import {
  BACKGROUND_COLOR,
  EDGE_WIDTH_HOVERED,
  EDGE_WIDTH_SELECTED,
  NODE_BORDER_COLOR_SELECTED,
  NODE_BORDER_WIDTH_HOVERED,
  NODE_BORDER_WIDTH_SELECTED,
  NODE_COLOR,
  NODE_COLOR_HOVERED,
  NODE_COLOR_SELECTED,
} from "./Values";
import { ContentContext } from "../pages/Home";

// modify the values of the node when hovered or selected through this function
// used when creating new nodes in new node dialog
export default function GraphView() {
  // get the context
  const { graphDatasetRef } = useContext(ContentContext);

  return (
    <div
      ref={graphDatasetRef}
      style={{
        width: "100%",
        flex: 1,
        backgroundColor: BACKGROUND_COLOR,
      }}
    ></div>
  );
}
