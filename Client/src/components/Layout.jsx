import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = ({ children, isDark, toggleTheme, showFooter = true }) => {
    return (
        <>
            <Navbar isDark={isDark} toggleTheme={toggleTheme} />
            <main className="min-h-screen pt-8">
                {children}
            </main>
            {showFooter && <Footer />}
        </>
    );
};

export default Layout;
