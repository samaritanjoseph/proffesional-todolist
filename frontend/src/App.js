import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import UserDashboard from './pages/UserDashboard';
import NotAuthorized from './pages/NotAuthorized';
import PrivateRoute from './components/PrivateRoute';
import Team from './pages/Team';
import TasksView from './pages/TasksView';
import Calendar from './pages/Calendar';
import Settings from './pages/Settings';
import Help from './pages/Help';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  // Helper to figure out where to redirect users hitting "/"
  const getDashboardRoute = () => {
    if (!isAuthenticated || !user) return '/login';
    if (user.role === 'admin') return '/admin-dashboard';
    if (user.role === 'manager') return '/manager-dashboard';
    return '/user-dashboard'; // Default
  };

  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to={getDashboardRoute()} />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to={getDashboardRoute()} />} />

        {/* ── RBAC Protected Routes ── */}
        
        {/* Admin Dashboard - only 'admin' can access */}
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoute roles={['admin']}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        {/* Manager Dashboard - only 'manager' can access */}
        <Route
          path="/manager-dashboard"
          element={
            <PrivateRoute roles={['manager']}>
              <ManagerDashboard />
            </PrivateRoute>
          }
        />

        {/* User Dashboard - only 'user' can access */}
        <Route
          path="/user-dashboard"
          element={
            <PrivateRoute roles={['user']}>
              <UserDashboard />
            </PrivateRoute>
          }
        />

        {/* Common Protected Routes */}
        <Route
          path="/tasks-view"
          element={
            <PrivateRoute roles={['admin', 'manager', 'user']}>
              <TasksView />
            </PrivateRoute>
          }
        />
        <Route
          path="/team"
          element={
            <PrivateRoute roles={['admin', 'manager']}>
              <Team />
            </PrivateRoute>
          }
        />

        <Route
          path="/calendar"
          element={
            <PrivateRoute roles={['admin', 'manager', 'user']}>
              <Calendar />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute roles={['admin', 'manager', 'user']}>
              <Settings />
            </PrivateRoute>
          }
        />
        <Route
          path="/help"
          element={
            <PrivateRoute roles={['admin', 'manager', 'user']}>
              <Help />
            </PrivateRoute>
          }
        />

        <Route path="/not-authorized" element={<NotAuthorized />} />

        <Route path="/" element={<Navigate to={getDashboardRoute()} />} />
        <Route path="*" element={<Navigate to={getDashboardRoute()} />} />
      </Routes>
    </Router>
  );
}

export default App;