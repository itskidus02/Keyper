import React from 'react';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';
import { Card, CardHeader, CardContent } from './ui/card';

const StatCard = ({ title, value, change, icon }) => {
  const isPositive = change >= 0;

  return (
    <Card className="rounded-xl border bg-card text-card-foreground shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0">
        <span className="text-2xl font-medium text-muted-foreground">{title}</span>
        <div className="p-2 bg-primary/10 rounded-lg">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 flex-col">
          <span className="text-2xl font-bold">{value.toLocaleString()}</span>
          <div className="flex items-center ">
            {isPositive ? (
              <ArrowUpIcon className="w-4 h-4 text-green-500 mr-1" />
            ) : (
              <ArrowDownIcon className="w-4 h-4 text-red-500 mr-1" />
            )}
            <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {Math.abs(change)}%
            </span>
            <span className="text-sm text-muted-foreground ml-1">vs last month</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default StatCard;