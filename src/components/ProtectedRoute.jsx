
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { usePermission } from '@/context/PermissionContext';
import { Loader2 } from 'lucide-react';
import AccessDeniedPage from '@/components/AccessDeniedPage';

const ProtectedRoute = ({ children, permissionRequired, requiredRole }) => {
  const { user, loading: authLoading, isProfileLoading, otpVerified, role, profile } = useAuth();
  const { hasPermission, loading: permLoading } = usePermission();
  const location = useLocation();

  // 1. Loading State - Wait for authentication to settle
  // We prioritize authLoading. Permission loading is secondary unless specifically needed.
  const isLoading = authLoading || isProfileLoading;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-[#003D82] mb-4" />
        <p className="text-gray-500 text-sm animate-pulse">
            {authLoading ? "Verifying session..." : "Loading profile..."}
        </p>
      </div>
    );
  }

  // 2. Authentication Check
  if (!user) {
    // Save the attempted URL for redirection after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. OTP Verification Check
  if (!otpVerified) {
    return <Navigate to="/otp-verification" replace />;
  }

  // 4. Profile Existence Check
  if (!profile) {
      return (
        <AccessDeniedPage 
            title="Profile Missing" 
            message="We could not find a user profile associated with your account. Please contact support." 
        />
      );
  }

  // 5. CRITICAL: Admin Super-Access Bypass
  // If the user is an admin, super_admin, or director, they get IMMEDIATE access.
  // We do NOT check specific permissions or wait for permission loading.
  const isAdmin = ['admin', 'super_admin', 'director'].includes(role?.toLowerCase());
  
  if (isAdmin) {
      return children;
  }

  // --- NON-ADMIN CHECKS BELOW ---

  // 6. Role Check (if specifically required for non-admins)
  if (requiredRole) {
      if (role !== requiredRole) {
          return <AccessDeniedPage />;
      }
  }

  // 7. Permission Check (Wait for permissions to load if needed)
  if (permissionRequired) {
      if (permLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
      }
      
      if (!hasPermission(permissionRequired)) {
          return <AccessDeniedPage />;
      }
  }

  // 8. Access Granted
  return children;
};

export default ProtectedRoute;
