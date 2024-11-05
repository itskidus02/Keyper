import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Toaster } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { VaultHeader } from "@/components/VaultHeader";
import { SearchBar } from "@/components/SearchBar";
import { AddEntryDialog } from "@/components/AddEntryDialog";
import { VaultTable } from "@/components/VaultTable";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const ITEMS_PER_PAGE = 7;

export default function VaultPage() {
  const { vaultId } = useParams();
  const [vaultName, setVaultName] = useState("");
  const [entries, setEntries] = useState([]);
  const [createdAt, setCreatedAt] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchVaultDetails();
  }, [vaultId]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

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
      throw error;
    }
  };

  const handleDeleteEntry = async (entryId) => {
    try {
      await axios.delete(`/api/vaults/${vaultId}/entries/${entryId}`);
      // Update the local state to remove the deleted entry
      setEntries(entries.filter(entry => entry.id !== entryId));
      return true;
    } catch (error) {
      console.error("Error deleting entry:", error);
      throw new Error(error.response?.data?.message || "Failed to delete entry");
    }
  };

  const filteredEntries = entries.filter((entry) =>
    entry.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredEntries.length / ITEMS_PER_PAGE);
  const showPagination = filteredEntries.length > ITEMS_PER_PAGE;

  const paginatedEntries = filteredEntries.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 2) {
        end = 4;
      } else if (currentPage >= totalPages - 1) {
        start = totalPages - 3;
      }

      if (start > 2) {
        pageNumbers.push("...");
      }

      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }

      if (end < totalPages - 1) {
        pageNumbers.push("...");
      }

      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <div className="container h-screen mx-auto py-1 space-y-1">
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
        <CardContent className="space-y-4">
          <VaultTable 
            entries={paginatedEntries} 
            onDeleteEntry={handleDeleteEntry}
          />
          
          {showPagination && (
            <Pagination className="justify-center">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>

                {getPageNumbers().map((pageNum, idx) => (
                  <PaginationItem key={idx}>
                    {pageNum === "..." ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        onClick={() => setCurrentPage(pageNum)}
                        isActive={currentPage === pageNum}
                        className="cursor-pointer"
                      >
                        {pageNum}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </CardContent>
      </Card>
    </div>
  );
}