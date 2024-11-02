import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function VaultHeader({ name, createdAt }) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-2xl">Vault: {name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Created: {new Date(createdAt).toLocaleString()}
        </p>
      </CardContent>
    </Card>
  );
}