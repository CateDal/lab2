import React, { useState } from "react";
import Papa from "papaparse";
import { db } from "../firebase";
import { collection, addDoc, deleteDoc, doc } from "firebase/firestore";
import ReactPaginate from "react-paginate"; // Import react-paginate
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  BarChart,
  Bar,
  CartesianGrid as BarCartesianGrid,
  XAxis as BarXAxis,
  YAxis as BarYAxis,
  Tooltip as BarTooltip,
  Legend as BarLegend,
} from "recharts";

const CsvUploader = () => {
  const [csvData, setCsvData] = useState([]);
  const [fileName, setFileName] = useState("");
  const [selectedAgeRange, setSelectedAgeRange] = useState([0, 100]);
  const [selectedSocioEconomicStatus, setSelectedSocioEconomicStatus] = useState([]);
  const [allSocioEconomicStatuses, setAllSocioEconomicStatuses] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); // State to manage the current page
  const itemsPerPage = 5; // Number of rows per page

  // Handle file change and parsing
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileName(file.name);

    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          setCsvData(result.data);
          setAllSocioEconomicStatuses([ 
            ...new Set(result.data.map((row) => row.socio_economic_status)),
          ]);
          uploadDataToFirestore(result.data);
        },
        header: true,
      });
    }
  };

  // Upload parsed data to Firestore
  const uploadDataToFirestore = async (data) => {
    try {
      const natDataRef = collection(db, "nat_data");
      for (let i = 0; i < data.length; i++) {
        await addDoc(natDataRef, data[i]);
      }
      alert("Data successfully uploaded to Firestore!");
    } catch (error) {
      console.error("Error uploading data: ", error);
      alert("Error uploading data.");
    }
  };

  // Filter data for scatter plot based on age range
  const prepareScatterData = () => {
    return csvData
      .map((row) => ({
        age: parseFloat(row.Age),
        natResults: parseFloat(row.NAT_Results),
      }))
      .filter(
        (item) =>
          !isNaN(item.age) &&
          !isNaN(item.natResults) &&
          item.age >= selectedAgeRange[0] &&
          item.age <= selectedAgeRange[1]
      );
  };

  // Prepare Histogram Data for Age
  const prepareHistogramData = (field) => {
    // Filter out rows with invalid data
    const dataInRange = csvData.filter((row) => !isNaN(row[field]));
    
    // Calculate the minimum and maximum values for the field (e.g., Age)
    const minValue = Math.min(...dataInRange.map((row) => parseFloat(row[field])));
    const maxValue = Math.max(...dataInRange.map((row) => parseFloat(row[field])));
    
    // Define bin size (e.g., 1 year for age)
    const binSize = 1;

    // Create an array of bins
    const binCounts = [];

    for (let i = minValue; i <= maxValue; i += binSize) {
      const count = dataInRange.filter((row) => {
        const value = parseFloat(row[field]);
        return value >= i && value < i + binSize;
      }).length;

      binCounts.push({
        bin: `${i} - ${i + binSize - 1}`,
        count,
      });
    }

    return binCounts;
  };

  // Handle page change for pagination
  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  // Slice the data for pagination
  const getPaginatedData = () => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return csvData.slice(startIndex, endIndex);
  };

  // Handle row deletion
  const handleDeleteRow = async (rowIndex) => {
    try {
      // Get the ID of the document you want to delete (assuming you have a unique 'id' in your CSV data)
      const row = csvData[rowIndex];
      const docRef = doc(db, "nat_data", row.id); // Replace 'id' with your Firestore field
      await deleteDoc(docRef);
      alert("Row deleted successfully");
      // Update the table after deletion
      setCsvData(csvData.filter((_, index) => index !== rowIndex));
    } catch (error) {
      console.error("Error deleting row: ", error);
      alert("Error deleting row.");
    }
  };

  // Handle row edit
  const handleEditRow = (rowIndex) => {
    const row = csvData[rowIndex];
    alert(`Edit row with data: ${JSON.stringify(row)}`);
    // You can replace this with a modal or form for editing
  };

  return (
    <div>
      <h2>Upload CSV File</h2>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      {fileName && <p>Uploaded File: {fileName}</p>}

      {/* Filter Controls */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Filters</h3>
        {/* Age Range Filter */}
        <div>
          <label>Age Range: </label>
          <input
            type="number"
            value={selectedAgeRange[0]}
            onChange={(e) =>
              setSelectedAgeRange([parseInt(e.target.value), selectedAgeRange[1]])
            }
            placeholder="Min Age"
          />
          <input
            type="number"
            value={selectedAgeRange[1]}
            onChange={(e) =>
              setSelectedAgeRange([selectedAgeRange[0], parseInt(e.target.value)])
            }
            placeholder="Max Age"
          />
        </div>

        {/* Socio-Economic Status Filter */}
        <div>
          <label>Socio-Economic Status: </label>
          <select
            multiple
            value={selectedSocioEconomicStatus}
            onChange={(e) => {
              const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
              setSelectedSocioEconomicStatus(selectedOptions);
            }}
          >
            {allSocioEconomicStatuses.map((status, index) => (
              <option key={index} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Render table if csvData has data */}
      {csvData.length > 0 && (
        <div>
          <h3>Preview Data</h3>
          <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {Object.keys(csvData[0]).map((key) => (
                  <th key={key} style={{ padding: "8px", border: "1px solid #ddd" }}>
                    {key}
                  </th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {getPaginatedData().map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value, idx) => (
                    <td key={idx} style={{ padding: "8px", border: "1px solid #ddd" }}>
                      {value}
                    </td>
                  ))}
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                    <button onClick={() => handleEditRow(index)}>Edit</button>
                    <button onClick={() => handleDeleteRow(index)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            pageCount={Math.ceil(csvData.length / itemsPerPage)}
            onPageChange={handlePageClick}
            containerClassName={"pagination"}
            activeClassName={"active"}
          />
        </div>
      )}

      {/* Render Scatter Plot for Age vs NAT_Results */}
      {csvData.length > 0 && (
        <div>
          <h3>Age vs NAT_Results Scatter Plot</h3>
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="age" name="Age" unit="years" />
              <YAxis dataKey="natResults" name="NAT Results" />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <Legend />
              <Scatter
                name="Age vs NAT Results"
                data={prepareScatterData()}
                fill="#8884d8"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Render Histogram for Age */}
      {csvData.length > 0 && (
        <div>
          <h3>Age Distribution</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={prepareHistogramData("Age")}
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <BarXAxis dataKey="bin" />
              <BarYAxis />
              <BarTooltip />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default CsvUploader;
