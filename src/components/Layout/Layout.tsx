import React from "react";
import { useLocation } from "react-router-dom";
import { Navbar } from "../Navbar/Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps): JSX.Element => {
  const location = useLocation();

  // Don't show navbar on pages that have their own header
  const pagesWithCustomHeader = ['/tenders', '/profile'];
  const showNavbar = !pagesWithCustomHeader.includes(location.pathname);

  return (
    <div className="min-h-screen bg-white">
      {showNavbar && (
        <div className="relative z-50">
          <Navbar />
        </div>
      )}
      <main className="relative z-10">{children}</main>
    </div>
  );
};