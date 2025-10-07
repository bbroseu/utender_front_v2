import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export const ProtectedRoute = ({
  children,
  requireAuth = true,
  redirectTo = '/login'
}: ProtectedRouteProps): JSX.Element => {
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const location = useLocation();

  // Check if token exists in localStorage to prevent premature redirects
  const hasToken = typeof window !== 'undefined' ? !!localStorage.getItem('token') : false;

  if (isLoading || (hasToken && !isAuthenticated)) {
    // Show loading if still loading or if we have a token but user isn't loaded yet
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#f0c419]"></div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated && !hasToken) {
    // Only redirect if not authenticated AND no token in localStorage
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (!requireAuth && isAuthenticated) {
    // Redirect authenticated users away from auth pages
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};