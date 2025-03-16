import ListGroup from "./components/ListGroup";

function App() {
  const items = ["Red", "Green", "Blue"];

  // separate event handler
  const handleSelectItem = (item: String) => {
    console.log(item);
  };
  return (
    <div>
      <ListGroup
        items={items}
        heading="Heading"
        onItemSelected={handleSelectItem}
      />
    </div>
  );
}

export default App;
