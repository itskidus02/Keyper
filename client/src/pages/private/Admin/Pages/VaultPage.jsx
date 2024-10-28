// pages/private/Admin/Pages/VaultPage.jsx
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function VaultPage() {
  const { vaultId } = useParams();
  const [fields, setFields] = useState([{ value: "" }]);

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
      <h2>Vault: {vaultId}</h2>
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
