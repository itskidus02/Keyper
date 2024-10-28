// pages/private/Admin/Pages/VaultPage.jsx
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function VaultPage() {
  const { vaultId } = useParams();
  const [input, setInput] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/api/vaults/add-data/${vaultId}`, { data: input });
      alert("Data saved successfully!");
      setInput(""); 
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Failed to save data");
    }
  };

  return (
    <div>
      <h2>Vault: {vaultId}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter data"
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default VaultPage;
