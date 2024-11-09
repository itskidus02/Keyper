import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardStats } from '../../../../redux/vault/vaultSlice';
import StatCard from '@/components/StatCard';
import { Vault, KeyRound, Fingerprint, Lock, RefreshCcwIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Archart } from '@/components/Archart';
import { XarChart } from '@/components/XarChart';
import { MulChart } from '@/components/MulChart';

const Dashboard = () => {
  const dispatch = useDispatch();
  const dashboardStats = useSelector((state) => state.vault.dashboardStats);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  const refreshData = () => {
    dispatch(fetchDashboardStats());
  };

  if (!dashboardStats) {
    return <div>Loading...</div>;
  }

  return (
    <div className=" ">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-1">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-gray-500 mt-1">Monitor your vault statistics</p>
          </div>
          <Button 
            onClick={refreshData}
            className="p-2 flex items-center gap-2"
          >
            <RefreshCcwIcon className="w-5 h-5" />
            Refresh
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Vaults"
            value={dashboardStats.vaults}
            change={12.5} // Placeholder for now
            icon={<Vault className="w-5 h-5 text-indigo-600" />}
          />
          <StatCard
            title="Total Entries"
            value={dashboardStats.entries}
            change={8.2} // Placeholder for now
            icon={<KeyRound className="w-5 h-5 text-indigo-600" />}
          />
          <StatCard
            title="Total Seeds"
            value={dashboardStats.seeds}
            change={-2.3} // Placeholder for now
            icon={<Fingerprint className="w-5 h-5 text-indigo-600" />}
          />
          <StatCard
            title="Total Passwords"
            value={dashboardStats.passwords}
            change={15.7} // Placeholder for now
            icon={<Lock className="w-5 h-5 text-indigo-600" />}
          />
        </div>
        <Archart/>
        <XarChart />
        <MulChart/>
      </div>
      
    </div>
  );
};

export default Dashboard;
