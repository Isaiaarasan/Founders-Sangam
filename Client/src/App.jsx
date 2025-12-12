import React, { Suspense, lazy, useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { Loader2 } from "lucide-react";
import Layout from "./components/Layout";
import AdminLayout from "./Layouts/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import MaintenanceCheck from "./middleware/MaintenanceCheck";
import PrivacyPolicy from "./components/Policy/PrivacyPolicy";
import RefundCancellationPolicy from "./components/Policy/Refund&CancellationPolicy";
import TermsConditions from "./components/Policy/Terms&Conditions";
import { initPaymentPersistence } from "./utils/paymentPersistence";

// Lazy load pages
import LandingPage from "./Pages/Landing";
import PaymentPage from "./Pages/PaymentPage";
import EventPaymentPage from "./Pages/EventPaymentPage";
import Payments from "./Pages/Admin/Payments";
import EventsPage from "./Pages/EventsPage";

// Lazy load other pages

const EventDetails = lazy(() => import("./Pages/EventDetails"));
const EventRegistration = lazy(() => import("./Pages/EventRegistration"));
const MaintenancePage = lazy(() => import("./Pages/MaintenancePage"));
const Broadcast = lazy(() => import("./Pages/Broadcast"));
const Courses = lazy(() => import("./Pages/Courses"));
const PaymentFailure = lazy(() => import("./Pages/PaymentFailure"));

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

// Small helper to handle query param based redirects (runs inside Router)
const RedirectHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const params = new URLSearchParams(location.search);
      const payment = params.get("payment");
      if (payment === "failed") {
        // Navigate to the failure page and replace history so query isn't retained
        navigate("/payment-failure", { replace: true });
      }
    } catch (err) {
      // ignore
    }
  }, [location.search, navigate]);

  return null;
};

function App() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("theme") === "dark" ||
        (!localStorage.getItem("theme") &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
      );
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  // Initialize payment persistence cleanup on app load
  useEffect(() => {
    initPaymentPersistence();
  }, []);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <Router>
      {/* Redirect handler: watch query params (e.g., ?payment=failed) and navigate accordingly */}
      <RedirectHandler />
      {/* <MaintenanceCheck> */}
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-screen">
              <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
            </div>
          }
        >
          <Routes>
            {/* Public Routes */}
            <Route
              path="/"
              element={
                <Layout isDark={isDark} toggleTheme={toggleTheme}>
                  <LandingPage />
                </Layout>
              }
            />
            <Route
              path="/payment"
              element={
                <Layout isDark={isDark} toggleTheme={toggleTheme}>
                  <PaymentPage />
                </Layout>
              }
            />
            <Route
              path="/events"
              element={
                <Layout isDark={isDark} toggleTheme={toggleTheme}>
                  <EventsPage />
                </Layout>
              }
            />
            <Route
              path="/broadcast"
              element={
                <Layout isDark={isDark} toggleTheme={toggleTheme}>
                  <Broadcast />
                </Layout>
              }
            />
            <Route
              path="/courses"
              element={
                <Layout isDark={isDark} toggleTheme={toggleTheme}>
                  <Courses />
                </Layout>
              }
            ></Route>
            <Route
              path="/ticket/:id"
              element={
                <Layout isDark={isDark} toggleTheme={toggleTheme}>
                  <TicketPage /> {/* Use the new component */}
                </Layout>
              }
            />
            <Route
              path="/event/:id"
              element={
                <Layout isDark={isDark} toggleTheme={toggleTheme}>
                  <EventDetails />
                </Layout>
              }
            />
            <Route
              path="/payment-failure"
              element={
                <Layout isDark={isDark} toggleTheme={toggleTheme}>
                  <PaymentFailure />
                </Layout>
              }
            />
            <Route
              path="/event/:id/register"
              element={
                <Layout isDark={isDark} toggleTheme={toggleTheme}>
                  <EventRegistration />
                </Layout>
              }
            />
            <Route
              path="/event-payment"
              element={
                <Layout isDark={isDark} toggleTheme={toggleTheme}>
                  <EventPaymentPage />
                </Layout>
              }
            />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route
              path="/refund-cancellation-policy"
              element={<RefundCancellationPolicy />}
            />
            <Route path="/terms-conditions" element={<TermsConditions />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute />}>
              <Route
                element={
                  <AdminLayout isDark={isDark} toggleTheme={toggleTheme} />
                }
              >
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
      {/* </MaintenanceCheck> */}
    </Router>
  );
}

export default App;
