import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Toaster } from "sonner";
import { VaultHeader } from "@/components/VaultHeader";
import { SearchBar } from "@/components/SearchBar";
import { AddEntryDialog } from "@/components/AddEntryDialog";
import { VaultTable } from "@/components/VaultTable";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function VaultPage() {
  const { vaultId } = useParams();
  const [vaultName, setVaultName] = useState("");
  const [entries, setEntries] = useState([]);
  const [createdAt, setCreatedAt] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchVaultDetails();
  }, [vaultId]);

  const fetchVaultDetails = async () => {
    try {
      const response = await axios.get(`/api/vaults/get/${vaultId}`);
      setVaultName(response.data.name);
      setEntries(response.data.entries);
      setCreatedAt(response.data.createdAt);
    } catch (error) {
      console.error("Error fetching vault details:", error);
    }
  };

  const handleAddEntry = async (entry) => {
    try {
      await axios.post(`/api/vaults/add-data/${vaultId}`, {
        data: [entry],
      });
      fetchVaultDetails();
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const filteredEntries = entries.filter((entry) =>
    entry.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8 space-y-6">
      <Toaster position="bottom-right" />
      
      <VaultHeader name={vaultName} createdAt={createdAt} />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <AddEntryDialog onSave={handleAddEntry} />
        </CardHeader>
        <CardContent>
          <VaultTable entries={filteredEntries} />
        </CardContent>
      </Card>
    </div>
  );
}