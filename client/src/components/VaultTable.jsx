import { useEffect, useRef, useState } from "react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Eye, EyeOff, Copy, MoreVertical, Shield, Key } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function VaultTable({ entries }) {
  const [visibleEntries, setVisibleEntries] = useState({});
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const contentRef = useRef(null);
  const [needsScroll, setNeedsScroll] = useState(false);

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

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(date));
  };

  const renderSeedPhrase = (value) => {
    const words = value.split(" ");
    return (
      <div className="grid grid-cols-3 gap-3 p-4">
        {words.map((word, index) => (
          <div
            key={index}
            className="flex items-center justify-between border rounded-md p-2.5 bg-background/50"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-medium min-w-[1.5rem]">
                {index + 1}.
              </span>
              <span className="font-mono text-sm">
                {visibleEntries[selectedEntry?.id] ? word : "•".repeat(6)}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 ml-2 hover:bg-background"
              onClick={() => copyToClipboard(word)}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
    );
  };

  useEffect(() => {
    const checkOverflow = () => {
      if (contentRef.current) {
        const height = contentRef.current.scrollHeight;
        setNeedsScroll(height > 400);
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [selectedEntry, visibleEntries]);

  const secureContent = selectedEntry && (
    <div ref={contentRef}>
      {selectedEntry.type === "seed" ? (
        renderSeedPhrase(selectedEntry.value)
      ) : (
        <pre
          className={cn(
            "whitespace-pre-wrap break-all font-mono text-sm leading-relaxed p-3",
            visibleEntries[selectedEntry.id] 
              ? "text-foreground" 
              : "text-muted-foreground tracking-wider"
          )}
        >
          {visibleEntries[selectedEntry.id] 
            ? selectedEntry.value 
            : "•".repeat(Math.min(selectedEntry.value.length, 50))}
        </pre>
      )}
    </div>
  );

  return (
    <>
    <div className="border-zinc-200 rounded-md border">

 
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Name</TableHead>
            <TableHead>Type</TableHead>
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
                  {entry.name}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {entry.type === "seed" ? (
                    <Key className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Shield className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="capitalize text-sm text-muted-foreground">
                    {entry.type}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-muted-foreground">•••••••••••</span>
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
                colSpan={5}
                className="h-24 text-center text-muted-foreground"
              >
                No secure entries found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-h-[90vh] gap-0 overflow-hidden p-0 sm:max-w-[700px]">
          <DialogHeader className="p-6 pb-4">
            <DialogTitle>
              {selectedEntry?.type === "seed" ? "Seed Phrase View" : "Secure Value View"}
            </DialogTitle>
          </DialogHeader>
          <div className="border-t">
            <div className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Entry Name</Label>
                  <Input
                    readOnly
                    value={selectedEntry?.name || ""}
                    className="font-medium"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label>
                      {selectedEntry?.type === "seed" ? "Seed Phrase" : "Secure Value"}
                    </Label>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => selectedEntry && toggleVisibility(selectedEntry.id)}
                      >
                        {selectedEntry && visibleEntries[selectedEntry.id] ? (
                          <>
                            <EyeOff className="mr-2 h-4 w-4" />
                            Hide Value
                          </>
                        ) : (
                          <>
                            <Eye className="mr-2 h-4 w-4" />
                            Show Value
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => selectedEntry && copyToClipboard(selectedEntry.value)}
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Copy All
                      </Button>
                    </div>
                  </div>
                  <div className="relative rounded-md border bg-muted/50">
                    {needsScroll ? (
                      <ScrollArea className="h-[400px] w-full">
                        {secureContent}
                      </ScrollArea>
                    ) : (
                      secureContent
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      </div>
    </>
  );
}