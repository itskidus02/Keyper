import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Save, Eye, EyeOff, Clipboard } from "lucide-react";
import { toast,  Toaster} from "sonner";

export default function VaultPage() {
  const { vaultId } = useParams();
  const [fields, setFields] = useState([{ name: "", value: "" }]);
  const [vaultName, setVaultName] = useState("");
  const [entries, setEntries] = useState([]);
  const [createdAt, setCreatedAt] = useState("");
  const [visibleEntries, setVisibleEntries] = useState({});

  useEffect(() => {
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
    fetchVaultDetails();
  }, [vaultId]);

  const addField = () => {
    setFields([...fields, { name: "", value: "" }]);
  };

  const handleInputChange = (index, field, event) => {
    const newFields = fields.slice();
    newFields[index][field] = event.target.value;
    setFields(newFields);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = fields.map((field) => ({
      name: field.name,
      value: field.value
    }));

    try {
      await axios.post(`/api/vaults/add-data/${vaultId}`, { data });
      setFields([{ name: "", value: "" }]);
      const response = await axios.get(`/api/vaults/get/${vaultId}`);
      setEntries(response.data.entries);
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const toggleVisibility = (index) => {
    setVisibleEntries(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      // You can add a toast notification here if you want
      toast.success('Copied to clipboard');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  return (
    <div className="min-h-screen p-8">
            <Toaster position="bottom-right"  />

      <div className="max-w-6xl p-3 rounded-lg ring mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Vault: {vaultName}</h2>
          <p className="text-sm text-gray-600">Created: {new Date(createdAt).toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <Table>
            <TableCaption>A list of your vault entries.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Name</TableHead>
                <TableHead>Value</TableHead>
                <TableHead className="w-[200px]">Created At</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{entry.name}</TableCell>
                  <TableCell>
                    {visibleEntries[index] ? entry.value : '••••••••'}
                  </TableCell>
                  <TableCell>{new Date(entry.createdAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <button onClick={() => toggleVisibility(index)} className="p-1">
                        {visibleEntries[index] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button onClick={() => copyToClipboard(entry.value)} className="p-1">
                        <Clipboard className="w-4 h-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {entries.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500">
                    No entries yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map((field, index) => (
              <div key={index} className="flex gap-4">
                <input
                  type="text"
                  value={field.name}
                  onChange={(e) => handleInputChange(index, "name", e)}
                  placeholder="Entry name"
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  required
                />
                <input
                  type="text"
                  value={field.value}
                  onChange={(e) => handleInputChange(index, "value", e)}
                  placeholder="Entry value"
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
            ))}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={addField}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Entry
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Entries
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}