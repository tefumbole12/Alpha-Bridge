
import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { usePermission } from '@/context/PermissionContext';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  LogOut, 
  Menu, 
  X, 
  Clock, 
  Shield, 
  History, 
  FileBarChart, 
  ChevronDown, 
  Briefcase, 
  Settings, 
  CalendarDays, 
  PlusCircle, 
  BarChart, 
  CalendarClock, 
  PieChart, 
  Mail, 
  FileCheck, 
  Database, 
  BookOpen, 
  Award, 
  TrendingUp,
  MessageSquare,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const AdminLayout = () => {
  const { logout, user, role } = useAuth();
  const { hasPermission, loading } = usePermission();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState({});

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  if (loading) return null;

  const isAdmin = role === 'admin' || role === 'super_admin' || role === 'director';

  const menuGroups = [
      {
          label: 'Overview',
          items: [
              { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard, perm: 'view_dashboard' },
          ]
      },
      {
          label: 'Recruitment & Jobs',
          items: [
              { 
                  label: 'Job Board', 
                  icon: Briefcase, 
                  perm: 'view_events',
                  submenu: [
                      { label: 'Recruitment Dashboard', path: '/admin/recruitment-dashboard' },
                      { label: 'Manage Jobs', path: '/admin/jobs' },
                      { label: 'All Applications', path: '/admin/applications' },
                      { label: 'Shortlisted', path: '/admin/applications/shortlisted' },
                      { label: 'Rejected', path: '/admin/applications/rejected' },
                  ]
              },
          ]
      },
      {
          label: 'People & Access',
          items: [
              { 
                  label: 'Users', 
                  icon: Users, 
                  perm: 'manage_users',
                  submenu: [
                      { label: 'User List', path: '/admin/users' },
                      { label: 'Students', path: '/admin/students' },
                  ]
              },
              { 
                  label: 'Members (Team)', 
                  icon: Users, 
                  perm: 'view_members',
                  submenu: [
                      { label: 'Member List', path: '/admin/members' },
                      { label: 'Add Member', path: '/admin/members?action=new' }, 
                  ]
              },
              { 
                  label: 'ShareHolders', 
                  icon: PieChart, 
                  perm: 'view_shareholders',
                  submenu: [
                      { label: 'Dashboard', path: '/admin/shareholders/dashboard' },
                      { label: 'List View', path: '/admin/shareholders/list' },
                      { label: 'Signed Agreements', path: '/admin/shareholders/signed-agreements', icon: FileCheck },
                      { label: 'Settings', path: '/admin/shareholders/settings' }
                  ]
              },
              { label: 'Roles & Permissions', path: '/admin/roles-permissions', icon: Shield, perm: 'manage_roles' },
          ]
      },
      {
          label: 'Learning & Content',
          items: [
              {
                  label: 'Courses',
                  icon: BookOpen,
                  perm: 'view_events',
                  submenu: [
                      { label: 'Course List', path: '/admin/courses' },
                      { label: 'Add Course', path: '/admin/courses/add' },
                      { label: 'Registrations', path: '/admin/registrations' },
                      { label: 'Invoices', path: '/admin/invoices', icon: FileText },
                      { label: 'Certificates', path: '/admin/certificates', icon: Award },
                      { label: 'Student Progress', path: '/admin/progress', icon: TrendingUp },
                      { label: 'Feedback', path: '/admin/feedback', icon: MessageSquare },
                  ]
              },
              { 
                  label: 'Events', 
                  icon: CalendarDays, 
                  perm: 'view_events',
                  submenu: [
                      { label: 'Event List', path: '/admin/events' },
                      { label: 'Add Event', path: '/admin/events?tab=add' }
                  ]
              },
          ]
      },
      {
          label: 'Communication',
          items: [
              {
                  label: 'Messaging Center',
                  icon: Mail,
                  perm: 'view_notifications',
                  submenu: [
                      { label: 'Send Notification', path: '/admin/communication/notifications' },
                      { label: 'Create Letter', path: '/admin/communication/letters' },
                      { label: 'WhatsApp Messages', path: '/admin/whatsapp-messages', icon: MessageSquare }, // NEW LINK
                      { label: 'Categories', path: '/admin/communication/categories' },
                      { label: 'Comm. Settings', path: '/admin/communication/settings' }
                  ]
              },
          ]
      },
      {
          label: 'TimeSheets (Employee)',
          items: [
              { label: 'Create Activity', path: '/timesheet/create-activity', icon: PlusCircle, perm: 'create_activities' },
              { label: 'Fill Time Sheet', path: '/timesheet/fill-timesheet', icon: Clock, perm: 'fill_timesheet' },
              { label: 'Working Week', path: '/timesheet/working-week', icon: CalendarClock, perm: 'fill_timesheet' },
          ]
      },
      {
          label: 'Operations',
          items: [
              { 
                  label: 'TimeSheet Admin', 
                  icon: BarChart, 
                  perm: 'view_timesheets',
                  submenu: [
                      { label: 'TimeSheet Report', path: '/admin/timesheet-report' },
                      { label: 'Overtime Report', path: '/admin/overtime-report' },
                      { label: 'Manage All', path: '/admin/manage-timesheets' },
                      { label: 'Categories', path: '/admin/timesheet-categories' } 
                  ]
              },
              { label: 'Payments', path: '/admin/payments', icon: CreditCard, perm: 'view_reports' }, 
          ]
      },
      {
          label: 'System',
          items: [
              { label: 'Reports Hub', path: '/admin/reports', icon: FileBarChart, perm: 'view_reports' },
              { label: 'Backup & Restore', path: '/admin/backup-restore', icon: Database, perm: 'manage_permissions' },
              { label: 'Settings', path: '/admin/settings', icon: Settings, perm: 'manage_permissions' },
              { label: 'System History', path: '/admin/history', icon: History, perm: 'view_reports' },
          ]
      }
  ];

  const toggleMenu = (label) => {
    setOpenMenus(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  const MenuItem = ({ item }) => {
      const hasAccess = isAdmin || (item.perm ? hasPermission(item.perm) : true);

      if (!hasAccess) {
         return null;
      }

      const isActive = item.submenu 
          ? item.submenu.some(sub => location.pathname.startsWith(sub.path))
          : (item.path ? location.pathname.startsWith(item.path) : false);

      const isOpen = openMenus[item.label] || isActive;

      if (item.submenu) {
          return (
              <Collapsible open={isOpen} onOpenChange={() => toggleMenu(item.label)} className="w-full">
                  <CollapsibleTrigger className={cn(
                      "flex items-center justify-between w-full px-4 py-3 rounded-lg transition-all duration-200 text-gray-100 hover:bg-white/10 hover:text-white",
                      isActive && "bg-[#003066]"
                  )}>
                      <div className="flex items-center gap-3">
                          <item.icon className="w-5 h-5 text-[#D4AF37]" />
                          <span>{item.label}</span>
                      </div>
                      <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "transform rotate-180")} />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-12 space-y-1 pt-1">
                      {item.submenu.map(sub => (
                          <Link 
                            key={sub.path} 
                            to={sub.path}
                            onClick={() => setSidebarOpen(false)}
                            className={cn(
                                "flex items-center gap-2 py-2 px-3 rounded text-sm transition-colors",
                                location.pathname === sub.path ? "text-[#D4AF37] font-medium bg-white/5" : "text-gray-400 hover:text-white"
                            )}
                          >
                              {sub.icon && <sub.icon className="w-3 h-3" />}
                              {sub.label}
                          </Link>
                      ))}
                  </CollapsibleContent>
              </Collapsible>
          );
      }

      return (
        <Link 
            to={item.path}
            onClick={() => setSidebarOpen(false)}
            className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative overflow-hidden",
                location.pathname === item.path
                    ? "bg-[#D4AF37] text-[#003D82] font-bold shadow-md" 
                    : "text-gray-100 hover:bg-white/10 hover:text-white"
            )}
        >
            <item.icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", location.pathname === item.path ? "text-[#003D82]" : "text-[#D4AF37]")} />
            <span className="relative z-10">{item.label}</span>
        </Link>
      );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-[#003D82] text-white p-4 flex justify-between items-center z-20 sticky top-0 shadow-md">
         <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-[#D4AF37]">Alpha Admin</span>
         </div>
         <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2">
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
         </button>
      </div>

      {/* Sidebar */}
      <aside className={cn(
        "fixed md:sticky top-0 h-screen bg-[#003D82] text-white w-64 transform transition-transform duration-200 ease-in-out z-10 flex flex-col shadow-2xl overflow-hidden",
        sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="p-6 border-b border-[#D4AF37]/30 bg-[#002855] shrink-0">
          <h1 className="text-2xl font-bold text-[#D4AF37]">Alpha Bridge</h1>
          <p className="text-xs text-gray-300 mt-1 uppercase tracking-widest">Technologies Ltd</p>
        </div>

        <nav className="flex-1 p-4 space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-800">
            {menuGroups.map((group, idx) => (
                <div key={idx}>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-4">{group.label}</h3>
                    <div className="space-y-1">
                        {group.items.map((item, i) => <MenuItem key={i} item={item} />)}
                    </div>
                </div>
            ))}
        </nav>

        {/* User Footer */}
        <div className="p-4 bg-[#002244] border-t border-[#D4AF37]/30 shrink-0">
          <div className="mb-4 flex items-center gap-3 px-2">
            <div className="h-8 w-8 rounded-full bg-[#D4AF37] flex items-center justify-center text-[#003D82] font-bold">
                {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="overflow-hidden">
                <p className="text-xs text-gray-200 font-medium truncate">
                    {user?.full_name || 'User'}
                </p>
                <p className="text-[10px] text-[#D4AF37] uppercase tracking-wider">{user?.role || 'Staff'}</p>
            </div>
          </div>
          
          <Button 
            onClick={handleLogout} 
            variant="ghost" 
            className="w-full justify-start text-red-300 hover:text-white hover:bg-red-600/80 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div 
            className="fixed inset-0 bg-black/50 z-0 md:hidden backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto bg-gray-50 h-[calc(100vh-64px)] md:h-screen">
        <div className="max-w-7xl mx-auto pb-10">
            <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
