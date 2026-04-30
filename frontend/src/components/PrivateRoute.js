import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * PrivateRoute – RBAC guard component
 *
 * Props:
 *   children  – the page to render if access is granted
 *   roles     – array of allowed roles, e.g. ['admin'] or ['admin','manager']
 *               pass an empty array / omit to only check authentication
 *
 * Flow:
 *   1. No token          → redirect to /login
 *   2. No user data      → redirect to /login
 *   3. Role not allowed  → redirect to /not-authorized
 *   4. All checks pass   → render children
 */
const PrivateRoute = ({ children, roles = [] }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const user  = JSON.parse(localStorage.getItem('user') || 'null');

  // ── 1. Not authenticated ────────────────────────────────────────────────────
  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ── 2. Authenticated but wrong role ─────────────────────────────────────────
  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/not-authorized" replace />;
  }

  // ── 3. All checks passed ────────────────────────────────────────────────────
  return children;
};

export default PrivateRoute;
