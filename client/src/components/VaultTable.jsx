import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Copy, MoreVertical } from "lucide-react";
import { toast } from "sonner";

export function VaultTable({ entries }) {
  const [visibleEntries, setVisibleEntries] = useState({});

  const toggleVisibility = (id) => {
    setVisibleEntries((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[200px]">Name</TableHead>
          <TableHead>Value</TableHead>
          <TableHead className="w-[200px]">Created At</TableHead>
          <TableHead className="w-[70px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {entries.map((entry) => (
          <TableRow key={entry.id}>
            <TableCell className="font-medium">{entry.name}</TableCell>
            <TableCell>
              {visibleEntries[entry.id] ? entry.value : "••••••••"}
            </TableCell>
            <TableCell>{new Date(entry.createdAt).toLocaleString()}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => toggleVisibility(entry.id)}>
                    {visibleEntries[entry.id] ? (
                      <EyeOff className="mr-2 h-4 w-4" />
                    ) : (
                      <Eye className="mr-2 h-4 w-4" />
                    )}
                    {visibleEntries[entry.id] ? "Hide" : "Show"} Value
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => copyToClipboard(entry.value)}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Value
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
        {entries.length === 0 && (
          <TableRow>
            <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
              No entries found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}