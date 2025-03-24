import { useContext, useEffect, useRef, useState } from "react";
import { DataSet, Edge, IdType, Network, Node } from "vis-network/standalone";
import {
  BACKGROUND_COLOR,
  NODE_COLOR,
  NODE_COLOR_HOVERED,
  NODE_COLOR_SELECTED,
} from "./Values";
import { ContentContext } from "../pages/Home";

// modify the values of the node when hovered or selected through this function
// used when creating new nodes in new node dialog
export const onNodeChosen = function (
  values: any,
  id: IdType,
  selected: boolean,
  hovering: boolean
) {
  if (selected) {
    values.color = NODE_COLOR_SELECTED;
    values.borderWidth = 2;
    values.borderColor = "black";
  } else if (hovering) {
    values.color = NODE_COLOR_HOVERED;
    values.borderWidth = 2;
  }
};

export const onEdgeChosen = function (
  values: any,
  id: IdType,
  selected: boolean,
  hovering: boolean
) {
  if (selected) {
    values.width = 5;
  } else if (hovering) {
    values.width = 3;
  }
};

export default function GraphView() {
  // get the context
  const { graphRef } = useContext(ContentContext);

  return (
    <div
      ref={graphRef}
      style={{
        width: "100%",
        flex: 1,
        backgroundColor: BACKGROUND_COLOR,
      }}
    ></div>
  );
}
