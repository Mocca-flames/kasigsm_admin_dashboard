import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/useAuth';
import { Toaster } from './components/Toaster';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import RepairOrders from './pages/RepairOrders';
import Services from './pages/Services';
import Settings from './pages/Settings';
import Items from './pages/Items';
import Orders from './pages/Orders';
import FulfillmentQueue from './pages/FulfillmentQueue';
import OrderDetail from './pages/OrderDetail';
import Credentials from './pages/Credentials';
import Users from './pages/Users';
import Technicians from './pages/Technicians';
import Banners from './pages/Banners';
import Providers from './pages/Providers';
import Wallets from './pages/Wallets';
import TopUps from './pages/TopUps';
import BulkMarkupManager from './pages/BulkMarkupManager';
import Categories from './pages/Categories';
import ProviderMarkups from './pages/ProviderMarkups';
import PromoCodes from './pages/PromoCodes';
import NotFound from './pages/NotFound';
import './styles/variables.css';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const LoginRedirect = () => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? <Login /> : <Navigate to="/" replace />;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginRedirect />} />
            <Route path="/" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/customers" element={
              <ProtectedRoute>
                <DashboardLayout><Customers /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/repair-orders" element={
              <ProtectedRoute>
                <DashboardLayout><RepairOrders /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/services" element={
              <ProtectedRoute>
                <DashboardLayout><Services /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <DashboardLayout><Settings /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/items" element={
              <ProtectedRoute>
                <DashboardLayout><Items /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/orders" element={
              <ProtectedRoute>
                <DashboardLayout><Orders /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/fulfillment-queue" element={
              <ProtectedRoute>
                <DashboardLayout><FulfillmentQueue /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/orders/:orderId" element={
              <ProtectedRoute>
                <DashboardLayout><OrderDetail /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/credentials" element={
              <ProtectedRoute>
                <DashboardLayout><Credentials /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/users" element={
                <ProtectedRoute>
                    <DashboardLayout><Users /></DashboardLayout>
                </ProtectedRoute>
            } />
            <Route path="/technicians" element={
                <ProtectedRoute>
                    <DashboardLayout><Technicians /></DashboardLayout>
                </ProtectedRoute>
            } />
            <Route path="/banners" element={
              <ProtectedRoute>
                <DashboardLayout><Banners /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/suppliers" element={
              <ProtectedRoute>
                <DashboardLayout><Providers /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/categories" element={
              <ProtectedRoute>
                <DashboardLayout><Categories /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/provider-markups" element={
              <ProtectedRoute>
                <DashboardLayout><ProviderMarkups /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/wallets" element={
              <ProtectedRoute>
                <DashboardLayout><Wallets /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/wallet/top-ups" element={
              <ProtectedRoute>
                <DashboardLayout><TopUps /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/bulk-markups" element={
              <ProtectedRoute>
                <DashboardLayout><BulkMarkupManager /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/promo-codes" element={
              <ProtectedRoute>
                <DashboardLayout><PromoCodes /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
