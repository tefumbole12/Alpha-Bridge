
import React, { useState, useEffect } from 'react';
import { getAllShareholders, deleteShareholder } from '@/services/shareholdersService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Search, Edit, Trash2, Download, Filter } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AdminShareHolderListPage = () => {
  const [shareholders, setShareholders] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  // Simulated price per share for listing display until settings service is fully integrated
  const PRICE_PER_SHARE = 500; 

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getAllShareholders();
      // Ensure data is an array before setting state
      setShareholders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load shareholders:", error);
      toast({ title: "Error", description: "Failed to load shareholder list.", variant: "destructive" });
      setShareholders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this shareholder?")) {
      try {
          await deleteShareholder(id);
          toast({ title: "Deleted", description: "Shareholder removed successfully." });
          loadData();
      } catch (error) {
          toast({ title: "Error", description: "Failed to delete shareholder.", variant: "destructive" });
      }
    }
  };

  const filtered = shareholders.filter(s => {
    const matchesSearch = (s.name || '').toLowerCase().includes(search.toLowerCase()) || 
                          (s.email || '').toLowerCase().includes(search.toLowerCase()) ||
                          (s.phone && s.phone.includes(search)) ||
                          (s.reference_number && s.reference_number.toLowerCase().includes(search.toLowerCase()));
    
    if (statusFilter === 'All') return matchesSearch;
    return matchesSearch && s.payment_status?.toLowerCase() === statusFilter.toLowerCase();
  });

  const getStatusBadgeVariant = (status) => {
      const normalized = status?.toLowerCase();
      if (normalized === 'completed' || normalized === 'paid') return 'bg-green-100 text-green-700 hover:bg-green-200';
      if (normalized === 'failed' || normalized === 'rejected') return 'bg-red-100 text-red-700 hover:bg-red-200';
      return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
                <h1 className="text-3xl font-bold text-[#003D82]">Shareholder List</h1>
                <p className="text-gray-500">Complete registry of all company investors.</p>
            </div>
            <div className="flex gap-2">
                <Button variant="outline"><Download className="w-4 h-4 mr-2" /> Export CSV</Button>
            </div>
        </div>

        <Card>
            <CardHeader>
                <div className="flex flex-col md:flex-row gap-4 justify-between">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                        <Input 
                            placeholder="Search by name, email, phone, or ref..." 
                            className="pl-8"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="min-w-[140px]">
                                <Filter className="w-4 h-4 mr-2" />
                                {statusFilter === 'All' ? 'Filter Status' : statusFilter}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => setStatusFilter('All')}>All Statuses</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setStatusFilter('completed')}>Completed</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setStatusFilter('pending')}>Pending</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setStatusFilter('failed')}>Failed</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Shares Booked</TableHead>
                                <TableHead>Total Investment</TableHead>
                                <TableHead>Payment Method</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow><TableCell colSpan={7} className="text-center py-8">Loading data...</TableCell></TableRow>
                            ) : filtered.length === 0 ? (
                                <TableRow><TableCell colSpan={7} className="text-center py-8 text-gray-500">No shareholders found matching criteria.</TableCell></TableRow>
                            ) : (
                                filtered.map(s => {
                                    const shares = parseInt(s.shares_assigned || 0);
                                    const totalInvest = s.total_amount ? parseFloat(s.total_amount) : (shares * PRICE_PER_SHARE);

                                    return (
                                        <TableRow key={s.id}>
                                            <TableCell className="font-medium text-[#003D82]">
                                                {s.name}
                                                {s.reference_number && (
                                                    <div className="text-xs text-gray-400 font-mono mt-1">{s.reference_number}</div>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-xs">{s.email}</div>
                                                <div className="text-xs text-gray-500">{s.phone}</div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="font-mono text-base">{shares}</Badge>
                                            </TableCell>
                                            <TableCell className="font-bold">
                                                ${totalInvest.toLocaleString()}
                                            </TableCell>
                                            <TableCell className="capitalize text-sm text-gray-600">
                                                {s.payment_method?.replace('_', ' ') || '-'}
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={getStatusBadgeVariant(s.payment_status)}>
                                                  {s.payment_status || 'Pending'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button variant="ghost" size="sm"><Edit className="w-4 h-4 text-gray-500" /></Button>
                                                <Button variant="ghost" size="sm" onClick={() => handleDelete(s.id)}>
                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    </div>
  );
};

export default AdminShareHolderListPage;
