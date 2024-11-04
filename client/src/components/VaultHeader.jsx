import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function VaultHeader({ name, createdAt }) {
  return (
    <Card className="-mb-5">
      <CardHeader className="flex flex-row items-center gap-2">
        <CardTitle className="text-4xl uppercase whitespace-nowrap">{name}</CardTitle>
        <CardTitle className="text-[#71717a] text-2xl uppercase whitespace-nowrap">
          vault
        </CardTitle>
      </CardHeader>
    </Card>
  );
}
