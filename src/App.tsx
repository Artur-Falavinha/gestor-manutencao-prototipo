import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SidebarProvider } from "@/components/ui/sidebar";

// Auth pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Client pages
import ClientDashboard from "./pages/client/ClientDashboard";
import NewRequest from "./pages/client/NewRequest";
import ViewRequest from "./pages/client/ViewRequest";
import ShowQuote from "./pages/client/ShowQuote";
import ApproveService from "./pages/client/ApproveService";
import RejectService from "./pages/client/RejectService";
import PayService from "./pages/client/PayService";

// Employee pages
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import RequestsList from "./pages/employee/RequestsList";
import CreateQuote from "./pages/employee/CreateQuote";
import PerformMaintenance from "./pages/employee/PerformMaintenance";
import RedirectMaintenance from "./pages/employee/RedirectMaintenance";
import FinalizeRequest from "./pages/employee/FinalizeRequest";
import Categories from "./pages/employee/Categories";
import Employees from "./pages/employee/Employees";
import Reports from "./pages/employee/Reports";

// Layout
import ClientLayout from "./components/layout/ClientLayout";
import EmployeeLayout from "./components/layout/EmployeeLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Client routes */}
            <Route path="/client" element={
              <ProtectedRoute allowedRoles={['client']}>
                <SidebarProvider>
                  <ClientLayout />
                </SidebarProvider>
              </ProtectedRoute>
            }>
              <Route index element={<ClientDashboard />} />
              <Route path="new-request" element={<NewRequest />} />
              <Route path="request/:id" element={<ViewRequest />} />
              <Route path="quote/:id" element={<ShowQuote />} />
              <Route path="approve/:id" element={<ApproveService />} />
              <Route path="reject/:id" element={<RejectService />} />
              <Route path="pay/:id" element={<PayService />} />
            </Route>

            {/* Employee routes */}
            <Route path="/employee" element={
              <ProtectedRoute allowedRoles={['employee']}>
                <SidebarProvider>
                  <EmployeeLayout />
                </SidebarProvider>
              </ProtectedRoute>
            }>
              <Route index element={<EmployeeDashboard />} />
              <Route path="requests" element={<RequestsList />} />
              <Route path="quote/:id" element={<CreateQuote />} />
              <Route path="maintenance/:id" element={<PerformMaintenance />} />
              <Route path="redirect/:id" element={<RedirectMaintenance />} />
              <Route path="finalize/:id" element={<FinalizeRequest />} />
              <Route path="categories" element={<Categories />} />
              <Route path="employees" element={<Employees />} />
              <Route path="reports" element={<Reports />} />
            </Route>

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;