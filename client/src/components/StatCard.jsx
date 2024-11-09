import React from 'react';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';

const StatCard = ({ title, value = 0, change = 0, icon, refreshData }) => {
  const isPositive = change >= 0;

  return (
    <Card className="rounded-xl border bg-card text-card-foreground shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0">
        <CardTitle className="text-4xl font-medium text-muted-foreground">{title}</CardTitle>
        <div className="flex items-center gap-2">
         
          <div className="p-2 bg-primary/10 rounded-lg">
            {icon}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 flex-col">
          <span className="text-4xl ml-1 text-muted-foreground font-bold">{value.toLocaleString()}</span>
      
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;