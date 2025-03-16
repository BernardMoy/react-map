import React, { useState } from "react";

interface Props {
  items: string[];
  heading: string;
  onItemSelected: (item: String) => void; // take in string, returns void
}

function ListGroup({ items, heading, onItemSelected }: Props) {
  // destructure the props interface

  // state hook
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const getMessage = () => {
    return items.length === 0 ? <p>No items.</p> : null;
  };

  // event handler
  const handleClick = (event: React.MouseEvent) => console.log(event);

  return (
    <>
      <h1>{heading}</h1>
      {getMessage}
      <ul className="list-group">
        {items.map((item, index) => (
          <li
            className={
              selectedIndex === index
                ? "list-group-item active"
                : "list-group-item"
            }
            key={item}
            onClick={() => {
              // set index
              setSelectedIndex(index);

              // call the custom select function
              onItemSelected(item);
            }}
          >
            {item}
          </li>
        ))}
      </ul>
    </>
  );
}

export default ListGroup;
