import Button from "./components/Button";
import Alert from "./components/Alert";
import ListGroup from "./components/ListGroup";
import { useState } from "react";

function App() {
  const items = ["Red", "Green", "Blue"];

  // separate event handler
  const handleSelectItem = (item: String) => {
    console.log(item);
  };

  const [alertVisible, setAlertVisibility] = useState(false);

  return (
    /*
    <div>
      <ListGroup
        items={items}
        heading="Heading"
        onItemSelected={handleSelectItem}
      />
    </div>
    */
    <div>
      {alertVisible && <Alert> My alert </Alert>}
      <Button
        text="ButtonText"
        onClick={() => setAlertVisibility(!alertVisible)}
      />
    </div>
  );
}

export default App;
