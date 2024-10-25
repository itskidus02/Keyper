// pages/private/Admin/Pages/VaultPage.jsx
import React from "react";
import { useParams } from "react-router-dom";

function VaultPage() {
  const { vaultId } = useParams();

  return (
    <div>
      <h2>Vault: {vaultId}</h2>
      {/* Render vault-specific content here */}
    </div>
  );
}

export default VaultPage;
