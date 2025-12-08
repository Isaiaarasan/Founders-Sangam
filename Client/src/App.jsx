import React, { Suspense, lazy, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Layout from "./components/Layout";
import AdminLayout from "./Layouts/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";


// Lazy load pages
import LandingPage from "./Pages/Landing";
import PaymentPage from "./Pages/PaymentPage";
import EventPaymentPage from "./Pages/EventPaymentPage";
import Payments from "./Pages/Admin/Payments";

// Lazy load other pages
const EventsPage = lazy(() => import("./Pages/EventsPage"));
const EventDetails = lazy(() => import("./Pages/EventDetails"));
const EventRegistration = lazy(() => import("./Pages/EventRegistration"));
const MaintenancePage = lazy(() => import("./Pages/MaintenancePage"));
const Broadcast = lazy(() => import("./Pages/Broadcast"));

// Admin Pages
const AdminLogin = lazy(() => import("./Pages/Admin/AdminLogin"));
const Dashboard = lazy(() => import("./Pages/Admin/Dashboard"));
const Members = lazy(() => import("./Pages/Admin/Members"));
const Events = lazy(() => import("./Pages/Admin/Events"));
const EventMembers = lazy(() => import("./Pages/Admin/EventMembers"));
const ContentManager = lazy(() => import("./Pages/Admin/ContentManager"));
const Collaborations = lazy(() => import("./Pages/Admin/Collaborations"));
const Videos = lazy(() => import("./Pages/Admin/Videos"));
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
    // Check maintenance status with timeout
    const checkStatus = async () => {
      try {
        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        const res = await fetch("https://founders-sangam.onrender.com/settings/status", {
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        const data = await res.json();
        if (data.success) {
          setIsMaintenance(data.isMaintenanceMode);
        }
      } catch (err) {
        // If timeout or error, assume not in maintenance mode and continue
        console.error("Failed to check maintenance status:", err.message);
        setIsMaintenance(false);
      } finally {
        setCheckingMaintenance(false);
      }
    };
    checkStatus();
  }, []);

  const toggleTheme = () => setIsDark(!isDark);

  if (checkingMaintenance) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center flex-col gap-4">
        <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
        <p className="text-slate-400 text-sm font-medium animate-pulse">Initializing Sangam...</p>
        <p className="text-slate-500 text-xs max-w-md text-center">
          First load may take a moment as the server wakes up
        </p>
      </div>
    );
  }

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
          <Route path="/broadcast" element={<Layout isDark={isDark} toggleTheme={toggleTheme}><Broadcast /></Layout>} />
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
              <Route path="videos" element={<Videos />} />
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
