import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

export function AddEntryDialog({ onSave }) {
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name, value });
    setName("");
    setValue("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Entry
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Entry</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Entry name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="value">Value</Label>
            <Input
              id="value"
              type="password"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Secret value"
              required
            />
          </div>
          <Button type="submit" className="w-full">Save Entry</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}