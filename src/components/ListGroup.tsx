import React, { useState } from "react";

function ListGroup() {
  // item list goes here
  const items = ["Red", "Green", "Blue"];

  // state hook
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const getMessage = () => {
    return items.length === 0 ? <p>No items.</p> : null;
  };

  // event handler
  const handleClick = (event: React.MouseEvent) => console.log(event);

  return (
    <>
      <h1>List</h1>
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
            onClick={() => setSelectedIndex(index)}
          >
            {item}
          </li>
        ))}
      </ul>
    </>
  );
}

export default ListGroup;
