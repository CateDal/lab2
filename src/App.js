import React from "react";
import AddNatData from "./components/AddNatData";
import NatDataList from "./components/NatDataList";
import CsvUploader from "./components/CsvUploader"; // Import the CsvUploader component

function App() {
  return (
    <div className="App">
      <h1>Welcome to the NAT Data App</h1>
      <CsvUploader />
      <AddNatData />
      <NatDataList />
    </div>
  );
}

export default App;
