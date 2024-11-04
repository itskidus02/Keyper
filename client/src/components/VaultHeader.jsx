import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function VaultHeader({ name, createdAt }) {
  return (
    <Card className="-mb-5">
      <CardHeader>
        <CardTitle className="text-4xl text-muted-foreground uppercase">{name} vault</CardTitle>
      </CardHeader>
   
    </Card>
  );
}