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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Copy, MoreVertical, Shield } from "lucide-react";
import { toast } from "sonner";

export function VaultTable({ entries }) {
  const [visibleEntries, setVisibleEntries] = useState({});
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const toggleVisibility = (id) => {
    setVisibleEntries((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Value copied to clipboard", {
        description: "The sensitive value has been copied securely",
      });
    } catch (err) {
      toast.error("Failed to copy value", {
        description: "Please try again or contact support if the issue persists",
      });
    }
  };

  const openSecureView = (entry) => {
    setSelectedEntry(entry);
    setShowModal(true);
  };

  const maskValue = (value) => {
    if (!value) return "•••";
    const length = value.length;
    return "•".repeat(Math.min(length * 1.5, 24));
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(date));
  };

  return (
    <>
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
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  {/* <Shield className="h-9 w-9 text-muted-foreground" /> */}
                  {entry.name}
                </div>
              </TableCell>
              <TableCell className="font-mono">
                <div className="flex items-center gap-2">
                  {visibleEntries[entry.id] ? (
                    <span className="text-emerald-600">{entry.value}</span>
                  ) : (
                    <span className="text-muted-foreground">{maskValue(entry.value)}</span>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(entry.createdAt)}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-muted focus:bg-muted"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
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
                      Copy to Clipboard
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => openSecureView(entry)}>
                      <Shield className="mr-2 h-4 w-4" />
                      Secure View
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
          {entries.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={4}
                className="h-24 text-center text-muted-foreground"
              >
                No secure entries found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Secure Value View</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Entry Name</Label>
              <Input
                readOnly
                value={selectedEntry?.name || ""}
                className="font-medium"
              />
            </div>
            <div className="space-y-2">
              <Label>Secure Value</Label>
              <div className="flex gap-2">
                <Input
                  type={visibleEntries[selectedEntry?.id] ? "text" : "password"}
                  readOnly
                  value={selectedEntry?.value || ""}
                  className="font-mono"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => selectedEntry && toggleVisibility(selectedEntry.id)}
                >
                  {visibleEntries[selectedEntry?.id] ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => selectedEntry && copyToClipboard(selectedEntry.value)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}