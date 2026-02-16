
import React, { useState, useEffect } from 'react';
import { getAllApplications } from '@/services/applicationsService';
import { getAllJobs } from '@/services/jobsService';
import ApplicationReviewModal from '@/components/admin/ApplicationReviewModal';
import ApplicationStatusHistoryModal from '@/components/admin/ApplicationStatusHistoryModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, Search, Loader2, History, Filter } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import CountryCodeDisplay from '@/components/CountryCodeDisplay';

const AdminApplicationListPage = () => {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterJob, setFilterJob] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedApp, setSelectedApp] = useState(null);
  const [historyAppId, setHistoryAppId] = useState(null);
  
  const { toast } = useToast();

  const fetchData = async () => {
      try {
        setLoading(true);
        const [appsData, jobsData] = await Promise.all([
           getAllApplications(),
           getAllJobs()
        ]);
        setApplications(appsData);
        setJobs(jobsData);
      } catch (error) {
        console.error(error);
        toast({ title: "Error", description: "Failed to load data", variant: "destructive" });
      } finally {
        setLoading(false);
      }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredApps = applications.filter(app => {
    // 1. Job Filter
    const matchesJob = filterJob === 'all' || app.job_id === filterJob;
    
    // 2. Status Filter
    const appStatus = app.status || 'pending';
    const matchesStatus = filterStatus === 'all' || appStatus === filterStatus;
    
    // 3. Search Filter
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
        !searchTerm ||
        app.candidate_name?.toLowerCase().includes(searchLower) ||
        app.email?.toLowerCase().includes(searchLower) ||
        app.phone?.toLowerCase().includes(searchLower) ||
        (app.reference_number && app.reference_number.toLowerCase().includes(searchLower));
    
    return matchesJob && matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status) => {
      const s = status || 'pending';
      switch(s) {
          case 'pending': return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
          case 'shortlisted': return <Badge variant="default" className="bg-green-600 hover:bg-green-700">Shortlisted</Badge>;
          case 'rejected': return <Badge variant="destructive">Rejected</Badge>;
          default: return <Badge variant="secondary">{s}</Badge>;
      }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold text-[#003D82]">All Applications</h1>
            <p className="text-gray-500">Manage and review all incoming applications.</p>
        </div>
        <Button variant="outline" onClick={fetchData} className="gap-2">
            <Filter className="w-4 h-4" /> Refresh List
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b bg-gray-50/50">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-end md:items-center">
             <div className="flex gap-4 items-center w-full md:w-auto flex-1">
                 <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input 
                        placeholder="Search name, email, phone, reference..." 
                        className="pl-9 bg-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
             </div>
             
             <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <Select value={filterJob} onValueChange={setFilterJob}>
                    <SelectTrigger className="w-full sm:w-[200px] bg-white">
                        <SelectValue placeholder="Filter by Job" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Jobs</SelectItem>
                        {jobs.map(j => (
                            <SelectItem key={j.id} value={j.id}>{j.title}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full sm:w-[150px] bg-white">
                        <div className="flex items-center gap-2">
                            <Filter className="w-3 h-3" />
                            <SelectValue placeholder="Status" />
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="shortlisted">Shortlisted</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                </Select>
             </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
             <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
          ) : filteredApps.length === 0 ? (
             <div className="text-center p-12 text-gray-500">
                No applications found matching your criteria.
             </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Ref Number</TableHead>
                    <TableHead>Candidate</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Applied For</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApps.map((app) => (
                    <TableRow key={app.id} className="hover:bg-blue-50/30 cursor-pointer" onClick={() => setSelectedApp(app)}>
                      <TableCell className="font-mono text-xs font-bold text-gray-600">
                          {app.reference_number || 'N/A'}
                      </TableCell>
                      <TableCell>
                          <div className="flex flex-col">
                              <span className="font-medium text-[#003D82]">{app.candidate_name}</span>
                              <div className="text-xs text-gray-500">{app.email}</div>
                              <CountryCodeDisplay country={app.country} phone={app.phone} className="mt-1" />
                          </div>
                      </TableCell>
                      <TableCell className="text-xs">
                           <div className="flex flex-col gap-1">
                               {app.expected_salary && (
                                   <span className="text-gray-600 font-medium">Exp: {app.expected_salary}</span>
                               )}
                               {app.availability && (
                                   <span className="text-green-600">
                                       Avail: {app.availability} 
                                       {app.availability === 'Custom' && app.availability_days && ` (${app.availability_days} days)`}
                                   </span>
                               )}
                           </div>
                      </TableCell>
                      <TableCell>
                          <Badge variant="outline" className="font-normal text-gray-700 bg-white">
                              {app.jobs?.title || 'Unknown Position'}
                          </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                          {new Date(app.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(app.status)}
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setSelectedApp(app); }}>
                          <Eye className="w-4 h-4 text-blue-600" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setHistoryAppId(app.id); }}>
                          <History className="w-4 h-4 text-gray-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <ApplicationReviewModal 
        isOpen={!!selectedApp}
        onClose={() => setSelectedApp(null)}
        application={selectedApp}
        onSuccess={fetchData}
      />

      <ApplicationStatusHistoryModal
        isOpen={!!historyAppId}
        onClose={() => setHistoryAppId(null)}
        applicationId={historyAppId}
      />
    </div>
  );
};

export default AdminApplicationListPage;
