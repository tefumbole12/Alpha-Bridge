
import React, { useState, useEffect } from 'react';
import { getAllMembers, deleteMember } from '@/services/membersService';
import AddMemberForm from '@/components/admin/AddMemberForm';
import MemberCard from '@/components/admin/MemberCard';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Search, Users, RefreshCw, Loader2, AlertTriangle, LogIn, LogOut } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';

const AdminMembersPage = () => {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { toast } = useToast();

  const auth = useAuth();
  const user = auth?.user ?? null;
  const loading = auth?.loading ?? false;
  const isAdmin = auth?.isAdmin ?? false;

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await getAllMembers();
      setMembers(data);
    } catch (error) {
      console.error("Failed to load members:", error);
      toast({ title: "Connection Error", description: "Failed to load team members.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  async function handleAdminLogin() {
    try {
      const email = window.prompt("Admin email:");
      if (!email) return;

      const password = window.prompt("Admin password:");
      if (!password) return;

      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        toast({ title: "Login failed", description: error.message, variant: "destructive" });
        return;
      }

      toast({ title: "Logged in", description: "You are now logged in." });
      loadData();
    } catch (e) {
      toast({ title: "Login error", description: e?.message || "Failed to login.", variant: "destructive" });
    }
  }

  async function handleLogout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast({ title: "Logged out", description: "You have been logged out." });
      loadData();
    } catch (e) {
      toast({ title: "Logout error", description: e?.message || "Failed to logout.", variant: "destructive" });
    }
  }

  const confirmDelete = (member) => {
    setDeleteId(member.id);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      console.log("Attempting to delete member:", deleteId);
      await deleteMember(deleteId);
      setMembers(prev => prev.filter(m => m.id !== deleteId));
      toast({ title: "Member Deleted", description: "The team member has been removed successfully." });
      setDeleteId(null);
    } catch (error) {
      console.error("Delete failed:", error);
      toast({ title: "Deletion Failed", description: error.message || "Could not delete member. Check permissions.", variant: "destructive" });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    loadData();
  };

  // Guard: require login + require admin
  if (loading) return null;

  if (!user) {
    return (
      <div className="p-10 max-w-2xl mx-auto animate-in fade-in duration-500">
        <div className="bg-white border rounded-xl p-6 shadow-sm text-center">
          <h1 className="text-xl font-bold text-[#003D82] mb-2">Admin Access Required</h1>
          <p className="text-gray-600 mb-6">Please log in with your admin account to manage team members.</p>

          <Button variant="outline" onClick={() => handleAdminLogin()} className="mx-auto">
            <LogIn className="w-4 h-4 mr-2" /> Login to Continue
          </Button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="p-10 max-w-2xl mx-auto animate-in fade-in duration-500">
        <div className="bg-white border border-red-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 text-red-600 mb-2">
            <AlertTriangle className="w-6 h-6" />
            <h1 className="text-xl font-bold">Access Denied</h1>
          </div>
          <p className="text-gray-600 mb-4">
            You are logged in as <span className="font-semibold text-black">{user.email || user.id}</span>, but this account does not have administrator privileges.
          </p>

          <div className="mt-4 flex gap-2">
            <Button variant="outline" onClick={() => handleLogout()}>
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const filtered = members.filter(m =>
    (m.name?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (m.title?.toLowerCase() || '').includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#003D82] flex items-center gap-3">
            <Users className="w-8 h-8" /> Team Members
          </h1>
          <p className="text-gray-500 mt-1">Manage public profiles for leadership and staff.</p>
          
          <div className="mt-2 text-sm text-gray-500 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span>Logged in as <strong>{user?.email}</strong></span>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>

          <Button variant="outline" onClick={loadData} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
          </Button>

          <Button
            onClick={handleCreate}
            className="bg-[#D4AF37] text-[#003D82] hover:bg-[#b5952f] font-bold shadow-md"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Member
          </Button>
        </div>
      </div>

      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search by name or title..."
          className="pl-9 bg-white border-gray-200 focus:border-[#003D82] h-10"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {isLoading && members.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-500 bg-white rounded-xl shadow-sm border border-gray-100 border-dashed">
              <Users className="w-12 h-12 text-gray-300 mb-4" />
              <p className="text-lg font-medium">No members found.</p>
              <p className="text-sm">Try adjusting your search or add a new member.</p>
              <Button variant="link" onClick={handleCreate} className="mt-2 text-[#003D82]">
                Add New Member
              </Button>
            </div>
          ) : (
            filtered.map(member => (
              <MemberCard
                key={member.id}
                member={member}
                onEdit={handleEdit}
                onDelete={confirmDelete}
                isAdminView={true}
              />
            ))
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#003D82]">
              {editingItem ? 'Edit Profile' : 'New Team Member'}
            </DialogTitle>
          </DialogHeader>
          <AddMemberForm
            initialData={editingItem}
            onSuccess={handleSuccess}
            onCancel={() => setIsModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" /> Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this team member? This action cannot be undone and will immediately remove them from the public website.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => { e.preventDefault(); handleDelete(); }}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={isDeleting}
            >
              {isDeleting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Deleting...</> : "Delete Member"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminMembersPage;
