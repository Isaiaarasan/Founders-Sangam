import React, { Suspense, lazy, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import AdminLayout from "./Layouts/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";


// Lazy load pages
const LandingPage = lazy(() => import("./Pages/Landing"));
const PaymentPage = lazy(() => import("./Pages/PaymentPage"));
const EventsPage = lazy(() => import("./Pages/EventsPage"));
const EventDetails = lazy(() => import("./Pages/EventDetails"));
const EventRegistration = lazy(() => import("./Pages/EventRegistration"));
const EventPaymentPage = lazy(() => import("./Pages/EventPaymentPage"));
const MaintenancePage = lazy(() => import("./Pages/MaintenancePage"));

// Admin Pages
const AdminLogin = lazy(() => import("./Pages/Admin/AdminLogin"));
const Dashboard = lazy(() => import("./Pages/Admin/Dashboard"));
const Members = lazy(() => import("./Pages/Admin/Members"));
const Events = lazy(() => import("./Pages/Admin/Events"));
const EventMembers = lazy(() => import("./Pages/Admin/EventMembers"));
const Payments = lazy(() => import("./Pages/Admin/Payments"));
const ContentManager = lazy(() => import("./Pages/Admin/ContentManager"));
const Collaborations = lazy(() => import("./Pages/Admin/Collaborations"));
const Settings = lazy(() => import("./Pages/Admin/Settings"));
const TicketPage = lazy(() => import("./Pages/TicketPage"));

function App() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark" ||
        (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
    return false;
  });

  const [isMaintenance, setIsMaintenance] = useState(false);
  const [checkingMaintenance, setCheckingMaintenance] = useState(true);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  useEffect(() => {
    // Check maintenance status
    const checkStatus = async () => {
      try {
        const res = await fetch("https://founders-sangam.onrender.com/settings/status");
        const data = await res.json();
        if (data.success) {
          setIsMaintenance(data.isMaintenanceMode);
        }
      } catch (err) {
        console.error("Failed to check maintenance status");
      } finally {
        setCheckingMaintenance(false);
      }
    };
    checkStatus();
  }, []);

  const toggleTheme = () => setIsDark(!isDark);

  if (checkingMaintenance) return <div className="min-h-screen bg-black" />;

  const isAdminRoute = window.location.pathname.startsWith("/admin");

  if (isMaintenance && !isAdminRoute) {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <MaintenancePage />
      </Suspense>
    );
  }

  return (
    <Router>
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout isDark={isDark} toggleTheme={toggleTheme}><LandingPage /></Layout>} />
          <Route path="/payment" element={<Layout isDark={isDark} toggleTheme={toggleTheme}><PaymentPage /></Layout>} />
          <Route path="/events" element={<Layout isDark={isDark} toggleTheme={toggleTheme}><EventsPage /></Layout>} />
          <Route
            path="/ticket/:id"
            element={
              <Layout isDark={isDark} toggleTheme={toggleTheme}>
                <TicketPage /> {/* Use the new component */}
              </Layout>
            }
          />
          <Route path="/event/:id" element={<Layout isDark={isDark} toggleTheme={toggleTheme}><EventDetails /></Layout>} />
          <Route path="/event/:id/register" element={<Layout isDark={isDark} toggleTheme={toggleTheme}><EventRegistration /></Layout>} />
          <Route path="/event-payment" element={<Layout isDark={isDark} toggleTheme={toggleTheme}><EventPaymentPage /></Layout>} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route element={<AdminLayout isDark={isDark} toggleTheme={toggleTheme} />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="members" element={<Members />} />
              <Route path="registrations" element={<EventMembers />} />
              <Route path="events" element={<Events />} />
              <Route path="payments" element={<Payments />} />
              <Route path="content" element={<ContentManager />} />
              <Route path="collaborations" element={<Collaborations />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
