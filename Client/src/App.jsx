import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// Import Pages
import LandingPage from "./Pages/Landing.jsx";
import PaymentPage from "./Pages/PaymentPage.jsx";
import EventsPage from "./Pages/EventsPage.jsx";
import FoundersPage from "./Pages/FoundersPage.jsx";

// Import Layout
import Layout from "./components/Layout.jsx";

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
        </div>
      </div>
    </Router>
  );
}

export default App;
