import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function VaultHeader({ name, createdAt }) {
  return (
    <Card className="mb-2">
      <CardHeader>
        <CardTitle className="text-4xl uppercase">{name} vault</CardTitle>
      </CardHeader>
   
    </Card>
  );
}