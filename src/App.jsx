import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import ScrollToTop from '@/components/ScrollToTop';
import MainLayout from '@/layouts/MainLayout';
import ErrorBoundary from '@/components/ErrorBoundary';
import { debugEnv } from '@/utils/debug';

// Modals
import LoginModal from '@/components/LoginModal';
import SignUpModal from '@/components/SignUpModal';

// Public Pages
import HomePage from '@/pages/HomePage';
import AboutPage from '@/pages/AboutPage';
import ServicesPage from '@/pages/ServicesPage';
import ContactPage from '@/pages/ContactPage';
import ProjectsPage from '@/pages/ProjectsPage';
import TrainingsPage from '@/pages/TrainingsPage';
import EventsPage from '@/pages/EventsPage';
import RegistrationPage from '@/pages/RegistrationPage';
import RegisterNowPage from '@/pages/RegisterNowPage';
import ShareholdersPage from '@/pages/ShareholdersPage';
import SharesPage from '@/pages/SharesPage';
import ShareholdersAgreementPage from '@/pages/ShareholdersAgreementPage';
import SharePurchasePortal from '@/pages/SharePurchasePortal';
import ShareholderConfirmationPage from '@/pages/ShareholderConfirmationPage';
import QRScannerPage from '@/pages/QRScannerPage';
import StudentProgressPage from '@/pages/StudentProgressPage';

// Job Application Pages
import ApplyNowPage from '@/pages/ApplyNowPage'; // Updated
import JobApplicationFormPage from '@/pages/JobApplicationFormPage';
import ApplicationConfirmationPage from '@/pages/ApplicationConfirmationPage';

// Authentication & Portals
import LoginPage from '@/pages/LoginPage';
import OTPVerificationScreen from '@/pages/OTPVerificationScreen';
import StudentDashboard from '@/pages/StudentDashboard';
import ShareholderDashboard from '@/pages/ShareholderDashboard';
import ApplicantDashboard from '@/pages/ApplicantDashboard';

// Components
import WhatsAppModal from '@/components/WhatsAppModal';
import { Toaster } from '@/components/ui/toaster';
import MemberSignupForm from '@/components/MemberSignupForm';

// Context Providers
import { WhatsAppProvider } from '@/context/WhatsAppContext';
import { AuthProvider } from '@/context/AuthContext';
import { TimeSheetProvider } from '@/context/TimeSheetContext';
import { PermissionProvider } from '@/context/PermissionContext';

// Admin & Security
import ProtectedRoute from '@/components/ProtectedRoute';
import AccessDeniedPage from '@/components/AccessDeniedPage';
import AdminLayout from '@/layouts/AdminLayout';

// Admin Pages
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminStudentsPage from '@/pages/admin/AdminStudentsPage';
import AdminPaymentsPage from '@/pages/admin/AdminPaymentsPage';
import AdminEventsPage from '@/pages/admin/AdminEventsPage';
import AdminUsersPage from '@/pages/admin/AdminUsersPage'; 
import AdminRolesPage from '@/pages/admin/AdminRolesPage';
import AdminSettingsPage from '@/pages/admin/AdminSettingsPage';

// New Admin Pages
import AdminMembersPage from '@/pages/admin/AdminMembersPage';
import AdminCoursesPage from '@/pages/admin/AdminCoursesPage';
import AdminRegistrationsPage from '@/pages/admin/AdminRegistrationsPage';
import AdminShareListingPage from '@/pages/admin/AdminShareListingPage';
import AdminInvoicesPage from '@/pages/admin/AdminInvoicesPage';
import AdminCertificatesPage from '@/pages/admin/AdminCertificatesPage';
import AdminProgressPage from '@/pages/admin/AdminProgressPage';
import AdminFeedbackPage from '@/pages/admin/AdminFeedbackPage';
import AdminReportsPage from '@/pages/admin/AdminReportsPage';
import AdminHistoryPage from '@/pages/admin/AdminHistoryPage';

// Jobs Admin Pages
import AdminJobsPage from '@/pages/admin/AdminJobsPage';
import AdminApplicationListPage from '@/pages/admin/AdminApplicationListPage';
import AdminJobApplicationDashboard from '@/pages/admin/AdminJobApplicationDashboard';
import AdminRejectedApplicationsPage from '@/pages/admin/AdminRejectedApplicationsPage';
import AdminShortlistedApplicationsPage from '@/pages/admin/AdminShortlistedApplicationsPage';

// Shareholder Admin Pages
import AdminShareHolderDashboardPage from '@/pages/admin/AdminShareHolderDashboardPage';
import AdminShareHolderListPage from '@/pages/admin/AdminShareHolderListPage';
import AdminShareSettingsPage from '@/pages/admin/AdminShareSettingsPage';
import ShareSignedSharesPage from '@/pages/admin/ShareSignedSharesPage';

// Communication Admin Pages
import AdminCommunicationCategoriesPage from '@/pages/admin/AdminCommunicationCategoriesPage';
import AdminNotificationComposerPage from '@/pages/admin/AdminNotificationComposerPage';
import AdminLetterComposerPage from '@/pages/admin/AdminLetterComposerPage';
import AdminCommunicationSettingsPage from '@/pages/admin/AdminCommunicationSettingsPage';
import WhatsAppMessageHistoryPage from '@/pages/admin/WhatsAppMessageHistoryPage';

// Time Sheet Admin Pages
import AdminTimeSheetManagementPage from '@/pages/admin/AdminTimeSheetManagementPage';
import AdminTimeSheetReportPage from '@/pages/admin/AdminTimeSheetReportPage';
import AdminOvertimeReportPage from '@/pages/admin/AdminOvertimeReportPage';
import AdminTimeSheetCategoriesPage from '@/pages/admin/AdminTimeSheetCategoriesPage';

// System Admin
import AdminBackupRestorePage from '@/pages/admin/AdminBackupRestorePage';

// Employee Time Sheet Pages
import MonthlyHoursSummaryPage from '@/pages/timesheet/MonthlyHoursSummaryPage';
import ActivityManagementPage from '@/pages/timesheet/ActivityManagementPage';
import FillTimeSheetPage from '@/pages/timesheet/FillTimeSheetPage';
import WorkingWeekPage from '@/pages/timesheet/WorkingWeekPage';

import { validateConfig } from '@/utils/configValidator';

const LayoutContextWrapper = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [redirectPath, setRedirectPath] = useState(null);

  const openLogin = (redirect) => {
    if (redirect) setRedirectPath(redirect);
    setIsLoginOpen(true);
  };

  const openSignUp = (redirect) => {
    if (redirect) setRedirectPath(redirect);
    setIsSignUpOpen(true);
  };

  const contextValue = {
    openLoginModal: openLogin,
    openSignUpModal: openSignUp,
  };

  return (
    <>
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => {
          setIsLoginOpen(false);
          setRedirectPath(null);
        }}
        onSwitchToSignUp={() => {
          setIsLoginOpen(false);
          setIsSignUpOpen(true);
        }}
        redirectOnSuccess={redirectPath}
      />
      <SignUpModal
        isOpen={isSignUpOpen}
        onClose={() => {
          setIsSignUpOpen(false);
          setRedirectPath(null);
        }}
        onSwitchToLogin={() => {
          setIsSignUpOpen(false);
          setIsLoginOpen(true);
        }}
        redirectOnSuccess={redirectPath}
      />
      <MainLayout>
        <Outlet context={contextValue} />
      </MainLayout>
    </>
  );
};

function App() {
  useEffect(() => {
    try {
      if (import.meta.env.DEV) {
        validateConfig();
        if (typeof debugEnv === 'function') debugEnv();
      }
    } catch (e) {
      console.warn('Startup validation failed', e);
    }
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <TimeSheetProvider>
          <PermissionProvider>
            <WhatsAppProvider>
              <BrowserRouter>
                <ScrollToTop />
                <WhatsAppModal />

                <Routes>
                  {/* Public Website Routes */}
                  <Route element={<LayoutContextWrapper />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="services" element={<ServicesPage />} />
                    <Route path="trainings" element={<TrainingsPage />} />
                    <Route path="events" element={<EventsPage />} />
                    <Route path="about" element={<AboutPage />} />

                    {/* Job Routes - Public Access */}
                    <Route path="apply-now" element={<ApplyNowPage />} />
                    {/* Older individual route kept for backward compatibility if needed, but new ApplyNowPage uses modals */}
                    <Route path="job/:jobId/apply" element={<JobApplicationFormPage />} />
                    <Route
                      path="application-confirmation/:referenceNumber"
                      element={<ApplicationConfirmationPage />}
                    />

                    <Route path="registration" element={<RegistrationPage />} />
                    <Route path="register-now" element={<RegisterNowPage />} />

                    <Route path="shareholders" element={<ShareholdersPage />} />
                    <Route path="shares" element={<SharesPage />} />
                    <Route path="shareholders-agreement" element={<ShareholdersAgreementPage />} />
                    <Route path="share-purchase" element={<SharePurchasePortal />} />
                    
                    {/* Shareholder Confirmation Route */}
                    <Route 
                      path="shares/confirmation/:referenceNumber" 
                      element={<ShareholderConfirmationPage />} 
                    />

                    <Route path="qr-scanner" element={<QRScannerPage />} />
                    <Route path="projects" element={<ProjectsPage />} />
                    <Route path="contact" element={<ContactPage />} />
                    <Route path="student/progress" element={<StudentProgressPage />} />

                    <Route
                      path="member-signup"
                      element={
                        <div className="p-8">
                          <MemberSignupForm />
                        </div>
                      }
                    />
                  </Route>

                  {/* Unified Authentication Routes */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/otp-verification" element={<OTPVerificationScreen />} />

                  {/* Legacy Redirections */}
                  <Route path="/admin/login" element={<Navigate to="/login" replace />} />
                  <Route path="/applicant-login" element={<Navigate to="/login" replace />} />
                  <Route path="/timesheet-login" element={<Navigate to="/login" replace />} />

                  {/* Protected Dashboards */}
                  <Route
                    path="/student/dashboard"
                    element={
                      <ProtectedRoute requiredRole="student">
                        <MainLayout>
                          <StudentDashboard />
                        </MainLayout>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/shareholder/dashboard"
                    element={
                      <ProtectedRoute requiredRole="shareholder">
                        <MainLayout>
                          <ShareholderDashboard />
                        </MainLayout>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/applicant-dashboard"
                    element={
                      <ProtectedRoute requiredRole="applicant">
                        <MainLayout>
                          <ApplicantDashboard />
                        </MainLayout>
                      </ProtectedRoute>
                    }
                  />

                  <Route path="/access-denied" element={<AccessDeniedPage />} />

                  {/* /admin shortcut */}
                  <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

                  {/* Protected Admin Area */}
                  {/* We wrap the layout in ProtectedRoute to ensure ANY access to /admin requires auth */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute>
                        <AdminLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route
                      path="dashboard"
                      element={
                        <ProtectedRoute permissionRequired="view_dashboard">
                          <AdminDashboard />
                        </ProtectedRoute>
                      }
                    />

                    {/* Users - Explicitly added ProtectedRoute logic here too for clarity */}
                    <Route
                      path="users"
                      element={
                        <ProtectedRoute permissionRequired="manage_users">
                          <AdminUsersPage />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="roles-permissions"
                      element={
                        <ProtectedRoute permissionRequired="manage_roles">
                          <AdminRolesPage />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="students"
                      element={
                        <ProtectedRoute permissionRequired="manage_users">
                          <AdminStudentsPage />
                        </ProtectedRoute>
                      }
                    />

                    {/* Courses / training */}
                    <Route
                      path="courses"
                      element={
                        <ProtectedRoute permissionRequired="view_events">
                          <AdminCoursesPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="courses/add"
                      element={
                        <ProtectedRoute permissionRequired="view_events">
                          <AdminCoursesPage defaultTab="add" />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="registrations"
                      element={
                        <ProtectedRoute permissionRequired="view_events">
                          <AdminRegistrationsPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="invoices"
                      element={
                        <ProtectedRoute permissionRequired="view_events">
                          <AdminInvoicesPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="certificates"
                      element={
                        <ProtectedRoute permissionRequired="view_events">
                          <AdminCertificatesPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="progress"
                      element={
                        <ProtectedRoute permissionRequired="view_events">
                          <AdminProgressPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="feedback"
                      element={
                        <ProtectedRoute permissionRequired="view_events">
                          <AdminFeedbackPage />
                        </ProtectedRoute>
                      }
                    />

                    {/* Recruitment */}
                    <Route
                      path="recruitment-dashboard"
                      element={
                        <ProtectedRoute permissionRequired="view_events">
                          <AdminJobApplicationDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="jobs"
                      element={
                        <ProtectedRoute permissionRequired="view_events">
                          <AdminJobsPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="applications"
                      element={
                        <ProtectedRoute permissionRequired="view_events">
                          <AdminApplicationListPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="applications/rejected"
                      element={
                        <ProtectedRoute permissionRequired="view_events">
                          <AdminRejectedApplicationsPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="applications/shortlisted"
                      element={
                        <ProtectedRoute permissionRequired="view_events">
                          <AdminShortlistedApplicationsPage />
                        </ProtectedRoute>
                      }
                    />

                    {/* Shareholders */}
                    <Route
                      path="shareholders/dashboard"
                      element={
                        <ProtectedRoute permissionRequired="view_shareholders">
                          <AdminShareHolderDashboardPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="shareholders/list"
                      element={
                        <ProtectedRoute permissionRequired="view_shareholders">
                          <AdminShareHolderListPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="shareholders/settings"
                      element={
                        <ProtectedRoute permissionRequired="view_shareholders">
                          <AdminShareSettingsPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="shareholders/signed-agreements"
                      element={
                        <ProtectedRoute permissionRequired="view_shareholders">
                          <ShareSignedSharesPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="share-listing"
                      element={
                        <ProtectedRoute permissionRequired="view_shareholders">
                          <AdminShareListingPage />
                        </ProtectedRoute>
                      }
                    />

                    {/* Members */}
                    <Route
                      path="members"
                      element={
                        <ProtectedRoute permissionRequired="view_members">
                          <AdminMembersPage />
                        </ProtectedRoute>
                      }
                    />

                    {/* Payments / reports */}
                    <Route
                      path="payments"
                      element={
                        <ProtectedRoute permissionRequired="view_reports">
                          <AdminPaymentsPage />
                        </ProtectedRoute>
                      }
                    />
                     <Route
                      path="reports"
                      element={
                        <ProtectedRoute permissionRequired="view_reports">
                          <AdminReportsPage />
                        </ProtectedRoute>
                      }
                    />
                     <Route
                      path="history"
                      element={
                        <ProtectedRoute permissionRequired="view_reports">
                          <AdminHistoryPage />
                        </ProtectedRoute>
                      }
                    />

                    {/* Events */}
                    <Route
                      path="events"
                      element={
                        <ProtectedRoute permissionRequired="view_events">
                          <AdminEventsPage />
                        </ProtectedRoute>
                      }
                    />

                    {/* Settings */}
                    <Route
                      path="settings"
                      element={
                        <ProtectedRoute permissionRequired="manage_permissions">
                          <AdminSettingsPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="backup-restore"
                      element={
                        <ProtectedRoute permissionRequired="manage_permissions">
                          <AdminBackupRestorePage />
                        </ProtectedRoute>
                      }
                    />

                    {/* Communication */}
                    <Route
                      path="communication/categories"
                      element={
                        <ProtectedRoute permissionRequired="view_notifications">
                          <AdminCommunicationCategoriesPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="communication/notifications"
                      element={
                        <ProtectedRoute permissionRequired="view_notifications">
                          <AdminNotificationComposerPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="communication/letters"
                      element={
                        <ProtectedRoute permissionRequired="view_notifications">
                          <AdminLetterComposerPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="communication/settings"
                      element={
                        <ProtectedRoute permissionRequired="view_notifications">
                          <AdminCommunicationSettingsPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="whatsapp-messages"
                      element={
                        <ProtectedRoute permissionRequired="view_notifications">
                          <WhatsAppMessageHistoryPage />
                        </ProtectedRoute>
                      }
                    />

                    {/* Admin TimeSheet */}
                    <Route
                      path="timesheet-report"
                      element={
                        <ProtectedRoute permissionRequired="view_timesheets">
                          <AdminTimeSheetReportPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="overtime-report"
                      element={
                        <ProtectedRoute permissionRequired="view_timesheets">
                          <AdminOvertimeReportPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="manage-timesheets"
                      element={
                        <ProtectedRoute permissionRequired="view_timesheets">
                          <AdminTimeSheetManagementPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="timesheet-categories"
                      element={
                        <ProtectedRoute permissionRequired="view_timesheets">
                          <AdminTimeSheetCategoriesPage />
                        </ProtectedRoute>
                      }
                    />
                  </Route>

                  {/* Employee TimeSheet Routes (protected) */}
                  <Route
                    path="timesheet/create-activity"
                    element={
                      <ProtectedRoute permissionRequired="create_activities">
                        <ActivityManagementPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="timesheet/fill-timesheet"
                    element={
                      <ProtectedRoute permissionRequired="fill_timesheet">
                        <FillTimeSheetPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="timesheet/working-week"
                    element={
                      <ProtectedRoute permissionRequired="fill_timesheet">
                        <WorkingWeekPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="timesheet/monthly-summary"
                    element={
                      <ProtectedRoute>
                        <MonthlyHoursSummaryPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Catch-all */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>

                <Toaster />
              </BrowserRouter>
            </WhatsAppProvider>
          </PermissionProvider>
        </TimeSheetProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;