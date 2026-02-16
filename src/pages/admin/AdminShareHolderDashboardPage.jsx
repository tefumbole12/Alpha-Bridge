
import React, { useState, useEffect } from 'react';
import { getAllShareholders, getShareStats } from '@/services/shareholdersService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Briefcase, DollarSign, PieChart, Activity } from 'lucide-react';

const AdminShareHolderDashboardPage = () => {
  const [stats, setStats] = useState({ 
      totalInvestors: 0, 
      totalShares: 0, 
      remainingShares: 0, 
      totalInvestment: 0,
      pendingCount: 0,
      completedCount: 0 
  });

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // 30s Refresh
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    const [shareholders, shareStats] = await Promise.all([
        getAllShareholders(),
        getShareStats()
    ]);

    const totalInvestment = shareholders.reduce((sum, s) => {
        const price = s.price_per_share ? parseFloat(s.price_per_share) : 1000; // Mock default price
        return sum + (parseInt(s.shares_assigned || 0) * price);
    }, 0);

    const pending = shareholders.filter(s => s.payment_status !== 'Paid').length;
    
    setStats({
        totalInvestors: shareholders.length,
        totalShares: shareStats.assigned,
        remainingShares: shareStats.remaining,
        totalInvestment,
        pendingCount: pending,
        completedCount: shareholders.length - pending
    });
  };

  const StatCard = ({ title, value, icon: Icon, colorClass, subtext }) => (
      <Card className="hover:shadow-lg transition-shadow border-l-4" style={{borderLeftColor: colorClass}}>
          <CardContent className="p-6">
              <div className="flex justify-between items-start">
                  <div>
                      <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</p>
                      <h3 className="text-3xl font-bold mt-2 text-gray-800">{value}</h3>
                      {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
                  </div>
                  <div className={`p-3 rounded-full bg-opacity-10`} style={{backgroundColor: colorClass + '20'}}>
                      <Icon className="w-6 h-6" style={{color: colorClass}} />
                  </div>
              </div>
          </CardContent>
      </Card>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
        <div>
            <h1 className="text-3xl font-bold text-[#003D82]">Shareholder Dashboard</h1>
            <p className="text-gray-500">Real-time investment overview and statistics.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
            <StatCard 
                title="Total Investors" 
                value={stats.totalInvestors} 
                icon={Users} 
                colorClass="#003D82"
                subtext="Active registered shareholders"
            />
            <StatCard 
                title="Shares Booked" 
                value={stats.totalShares} 
                icon={Briefcase} 
                colorClass="#D4AF37"
                subtext={`Out of ${stats.totalShares + stats.remainingShares} total shares`}
            />
            <StatCard 
                title="Total Investment" 
                value={`$${stats.totalInvestment.toLocaleString()}`} 
                icon={DollarSign} 
                colorClass="#10b981"
                subtext="Estimated total value"
            />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-[#003D82] to-[#00509d] text-white">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><PieChart className="w-5 h-5 text-[#D4AF37]" /> Payment Status</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-white/20 pb-2">
                            <span>Completed Payments</span>
                            <span className="font-bold text-xl">{stats.completedCount}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/20 pb-2">
                            <span>Pending / Pay Later</span>
                            <span className="font-bold text-xl text-[#D4AF37]">{stats.pendingCount}</span>
                        </div>
                        <div className="mt-4 pt-2">
                             <div className="w-full bg-black/20 h-4 rounded-full overflow-hidden flex">
                                 <div className="bg-green-400 h-full" style={{width: `${(stats.completedCount / (stats.totalInvestors || 1)) * 100}%`}}></div>
                                 <div className="bg-yellow-400 h-full" style={{width: `${(stats.pendingCount / (stats.totalInvestors || 1)) * 100}%`}}></div>
                             </div>
                             <div className="flex justify-between text-xs mt-1 opacity-70">
                                 <span>Paid</span>
                                 <span>Pending</span>
                             </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Activity className="w-5 h-5 text-blue-600" /> Share Allocation</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center h-full pt-0">
                     <div className="relative w-48 h-48 rounded-full border-[16px] border-gray-100 flex items-center justify-center">
                         <div 
                            className="absolute inset-0 rounded-full border-[16px] border-[#003D82] border-r-transparent border-b-transparent transform -rotate-45"
                            style={{ clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%)` }} // Simple visual mock, real chart lib better for arcs
                         ></div>
                         <div className="text-center">
                             <span className="block text-3xl font-bold text-[#003D82]">{stats.remainingShares}</span>
                             <span className="text-xs text-gray-500 uppercase">Remaining</span>
                         </div>
                     </div>
                     <p className="mt-6 text-center text-sm text-gray-600">
                        <strong>{stats.totalShares}</strong> shares distributed to <strong>{stats.totalInvestors}</strong> investors.
                     </p>
                </CardContent>
            </Card>
        </div>
    </div>
  );
};

export default AdminShareHolderDashboardPage;
