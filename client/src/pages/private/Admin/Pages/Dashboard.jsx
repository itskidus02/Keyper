import React from 'react';
import StatCard from '@/components/StatCard';
import { Vault, KeyRound, Fingerprint, Lock } from 'lucide-react';

const Dashboard = () => {
  // In a real app, these would come from your API
  const stats = {
    vaults: {
      total: 147,
      change: 12.5
    },
    entries: {
      total: 1834,
      change: 8.2
    },
    seeds: {
      total: 456,
      change: -2.3
    },
    passwords: {
      total: 1378,
      change: 15.7
    }
  };

  return (
    <div className=" ">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-1">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1">Monitor your vault statistics</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Vaults"
            value={stats.vaults.total}
            change={stats.vaults.change}
            icon={<Vault className="w-5 h-5 text-indigo-600" />}
          />
          <StatCard
            title="Total Entries"
            value={stats.entries.total}
            change={stats.entries.change}
            icon={<KeyRound className="w-5 h-5 text-indigo-600" />}
          />
          <StatCard
            title="Total Seeds"
            value={stats.seeds.total}
            change={stats.seeds.change}
            icon={<Fingerprint className="w-5 h-5 text-indigo-600" />}
          />
          <StatCard
            title="Total Passwords"
            value={stats.passwords.total}
            change={stats.passwords.change}
            icon={<Lock className="w-5 h-5 text-indigo-600" />}
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;