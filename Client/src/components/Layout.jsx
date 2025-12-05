import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = ({ children, isDark, toggleTheme, showFooter = true }) => {
    const location = useLocation();
    const isHome = location.pathname === "/";

    return (
        <>
            <Navbar isDark={isDark} toggleTheme={toggleTheme} />
            <main className={`min-h-screen ${isHome ? "" : "pt-20"}`}>
                {children}
            </main>
            {showFooter && <Footer />}
        </>
    );
};

export default Layout;
