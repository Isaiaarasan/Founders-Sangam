import React, { useState, useEffect, Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Loader2 } from "lucide-react";
import "./App.css";

// Lazy Load Pages
const LandingPage = lazy(() => import("./Pages/Landing.jsx"));
const PaymentPage = lazy(() => import("./Pages/PaymentPage.jsx"));
const EventsPage = lazy(() => import("./Pages/EventsPage.jsx"));
const FoundersPage = lazy(() => import("./Pages/FoundersPage.jsx"));

// Import Layout
import Layout from "./components/Layout.jsx";

// Loading Fallback Component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-white dark:bg-slate-950">
    <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
  </div>
);

function App() {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <Router>
      <div className={`${isDark ? "dark" : ""}`}>
        <div className="font-sans antialiased bg-white dark:bg-slate-950 min-h-screen text-slate-900 dark:text-white transition-colors duration-500 selection:bg-amber-400 selection:text-black">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Route for the Main Landing Page */}
              <Route
                path="/"
                element={
                  <Layout isDark={isDark} toggleTheme={toggleTheme}>
                    <LandingPage isDark={isDark} toggleTheme={toggleTheme} />
                  </Layout>
                }
              />

              {/* Route for the Payment Page */}
              <Route
                path="/payment"
                element={
                  <Layout isDark={isDark} toggleTheme={toggleTheme}>
                    <PaymentPage />
                  </Layout>
                }
              />

              {/* Route for the Events Page */}
              <Route
                path="/events"
                element={
                  <Layout isDark={isDark} toggleTheme={toggleTheme}>
                    <EventsPage />
                  </Layout>
                }
              />

              {/* Route for the Founders Page */}
              <Route
                path="/founders"
                element={
                  <Layout isDark={isDark} toggleTheme={toggleTheme}>
                    <FoundersPage />
                  </Layout>
                }
              />
            </Routes>
          </Suspense>
        </div>
      </div>
    </Router>
  );
}

export default App;
