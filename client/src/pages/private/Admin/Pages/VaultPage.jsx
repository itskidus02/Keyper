import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function VaultPage() {
  const { vaultId } = useParams();
  const [fields, setFields] = useState([{ value: "" }]);
  const [vaultName, setVaultName] = useState(""); // State for vault name

  // Fetch vault details on component mount
  useEffect(() => {
    const fetchVaultDetails = async () => {
      try {
        const response = await axios.get(`/api/vaults/get/${vaultId}`);
        setVaultName(response.data.name); // Set vault name from API response
      } catch (error) {
        console.error("Error fetching vault details:", error);
      }
    };
    fetchVaultDetails();
  }, [vaultId]);

  // Handle adding a new input field
  const addField = () => {
    setFields([...fields, { value: "" }]);
  };

  // Handle changing input values
  const handleInputChange = (index, event) => {
    const newFields = fields.slice();
    newFields[index].value = event.target.value;
    setFields(newFields);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = fields.map((field) => field.value);

    try {
      await axios.post(`/api/vaults/add-data/${vaultId}`, { data });
      alert("Data saved successfully!");
      setFields([{ value: "" }]);  // Reset fields after submission
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Failed to save data");
    }
  };

  return (
    <div>
      <h2>Vault: {vaultName} (ID: {vaultId})</h2>
      <form onSubmit={handleSubmit}>
        {fields.map((field, index) => (
          <div key={index}>
            <input
              type="text"
              value={field.value}
              onChange={(e) => handleInputChange(index, e)}
              placeholder={`Entry ${index + 1}`}
              required
            />
          </div>
        ))}
        <button type="button" onClick={addField}>Add Another Entry</button>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default VaultPage;
