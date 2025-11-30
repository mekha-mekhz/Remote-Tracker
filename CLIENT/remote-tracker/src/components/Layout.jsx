
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

function Layout() {
    return (
        <div>
            <Navbar />
            {/* Add padding to push content below navbar */}
            <div className="pt-20">
                <Outlet />
            </div>
            <Footer />
        </div>
    );
}

export default Layout;
