import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const MaintenanceCheck = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = !!localStorage.getItem("adminToken"); // Simple check

  // Initialize loading based on whether we need to check
  // Don't block landing page or admin login
  const shouldSkipCheck = location.pathname === "/" || location.pathname === "/admin/login";
  const [loading, setLoading] = useState(!shouldSkipCheck);

  useEffect(() => {
    if (shouldSkipCheck) {
      return;
    }

    const checkMaintenance = async () => {
      try {
        const res = await axios.get(
          "https://founders-sangam.onrender.com/settings/status",
          { timeout: 5000 } // Increased timeout slightly
        );
        if (res.data.success && res.data.isMaintenanceMode && !isAdmin) {
          navigate("/maintenance");
        }
      } catch (err) {
        console.error("Failed to check maintenance status");
        // If check fails, we generally allow access or retry, but for now we let it pass
        // to avoid blocking users if server is hiccups.
      } finally {
        setLoading(false);
      }
    };

    checkMaintenance();
  }, [location.pathname, isAdmin, navigate, shouldSkipCheck]);

  if (loading && !shouldSkipCheck) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return children;
};

export default MaintenanceCheck;
