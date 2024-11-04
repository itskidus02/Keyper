import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

const WORD_COUNT_OPTIONS = [12, 15, 18, 21, 24];

export function AddEntryDialog({ onSave }) {
  const [open, setOpen] = useState(false);
  const [entryType, setEntryType] = useState("password");
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [wordCount, setWordCount] = useState(12);
  const [words, setWords] = useState(Array(12).fill(""));
  const [error, setError] = useState("");

  const handleWordChange = (index, value) => {
    const newWords = [...words];
    newWords[index] = value;
    setWords(newWords);
  };

  const handleWordCountChange = (count) => {
    setWordCount(Number(count));
    setWords(Array(Number(count)).fill(""));
  };

  const validateForm = () => {
    setError("");
    if (!name.trim()) {
      setError("Name is required");
      return false;
    }

    if (entryType === "password" && !value.trim()) {
      setError("Password is required");
      return false;
    }

    if (entryType === "seed") {
      const filledWords = words.filter(word => word.trim());
      if (filledWords.length !== wordCount) {
        setError("All seed phrase words are required");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const entry = {
      name,
      type: entryType,
      value: entryType === "seed" ? words.join(" ") : value
    };

    onSave(entry);
    setName("");
    setValue("");
    setWords(Array(12).fill(""));
    setOpen(false);
  };

  const resetForm = () => {
    setName("");
    setValue("");
    setWords(Array(12).fill(""));
    setError("");
    setEntryType("password");
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) resetForm();
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Entry
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Entry</DialogTitle>
        </DialogHeader>
        <Tabs value={entryType} onValueChange={setEntryType} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="seed">Seed Phrase</TabsTrigger>
          </TabsList>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Entry name"
              />
            </div>
            
            <TabsContent value="password" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="value">Password</Label>
                <Input
                  id="value"
                  type="password"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Enter password"
                />
              </div>
            </TabsContent>

            <TabsContent value="seed" className="space-y-4">
              <div className="space-y-2">
                <Label>Word Count</Label>
                <Select value={wordCount.toString()} onValueChange={handleWordCountChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {WORD_COUNT_OPTIONS.map((count) => (
                      <SelectItem key={count} value={count.toString()}>
                        {count} words
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {words.map((word, index) => (
                  <div key={index} className="space-y-1">
                    <Label htmlFor={`word-${index}`} className="text-xs">
                      Word {index + 1}
                    </Label>
                    <Input
                      id={`word-${index}`}
                      value={word}
                      onChange={(e) => handleWordChange(index, e.target.value)}
                      placeholder={`Word ${index + 1}`}
                      className="text-sm"
                    />
                  </div>
                ))}
              </div>
            </TabsContent>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className={cn("w-full", error && "mt-4")}>
              Save Entry
            </Button>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}