import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";
import { Menu, X, User, LogOut } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logout } from "../../store/slices/authSlice";
import { useLogoutMutation } from "../../store/api/authApi";

const navigationItems = [
 { label: "Tenderët", width: "w-[74px]", path: "/tenders" },
 { label: "Pakot", width: "w-12", path: "/#packages-section", scrollTo: true },
 { label: "Kontakto", width: "w-[76px]", path: "/contact" },
 { label: "Abonohu", width: "w-[76px]", path: "/register" },
];

export const Navbar = (): JSX.Element => {
 const navigate = useNavigate();
 const location = useLocation();
 const dispatch = useAppDispatch();
 const { isAuthenticated, user } = useAppSelector((state) => state.auth);
 const [logoutMutation] = useLogoutMutation();


 const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
 const [showNavbar, setShowNavbar] = useState(true);
 const [lastScrollY, setLastScrollY] = useState(0);
 const [isScrolled, setIsScrolled] = useState(false);
 const [showUserMenu, setShowUserMenu] = useState(false);

 const handleNavClick = (item: any) => {
  if (item.scrollTo) {
   // If it's a scroll link
   if (location.pathname !== '/') {
    // Navigate to homepage first, then scroll
    navigate('/');
    setTimeout(() => {
     const element = document.getElementById('packages-section');
     if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
     }
    }, 100);
   } else {
    // Already on homepage, just scroll
    const element = document.getElementById('packages-section');
    if (element) {
     element.scrollIntoView({ behavior: 'smooth' });
    }
   }
  } else {
   // Normal navigation
   navigate(item.path);
  }
 };

 const handleLogout = async () => {
  try {
   await logoutMutation().unwrap();
  } catch (error) {
   console.error('Logout failed:', error);
  } finally {
   dispatch(logout());
   navigate('/');
  }
  setShowUserMenu(false);
 };

 useEffect(() => {
  const controlNavbar = () => {
   if (typeof window !== "undefined") {
    // Check if page is scrolled
    setIsScrolled(window.scrollY > 50);

    if (window.scrollY > lastScrollY && window.scrollY > 100) {
     // scrolling down & scrolled more than 100px
     setShowNavbar(false);
    } else {
     // scrolling up
     setShowNavbar(true);
    }
    setLastScrollY(window.scrollY);
   }
  };

  if (typeof window !== "undefined") {
   window.addEventListener("scroll", controlNavbar);

   return () => {
    window.removeEventListener("scroll", controlNavbar);
   };
  }
 }, [lastScrollY]);

 // Close mobile menu when route changes
 useEffect(() => {
  setIsMobileMenuOpen(false);
 }, [location]);

 return (
  <>
   {/* Fixed Header - Always shows */}
   <AnimatePresence>
    {(!isScrolled || showNavbar) && (
     <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      exit={{ y: -100 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`${
       isScrolled ? "fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-md z-50" : "relative bg-transparent z-50"
      }`}
     >
      <div className="hidden lg:flex items-center justify-between px-[148px] py-4">
       <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
        <img className="w-[35px] h-[42px]" alt="Group" src="/group-1321316878.png" />
       </div>

       <nav className="flex items-center space-x-[58px]">
        {navigationItems.map((item, index) => (
         <div
          key={index}
          onClick={() => handleNavClick(item)}
          className={`${item.width} h-[22px] font-questrial font-bold text-[#1b2631] text-lg tracking-[0] leading-[normal] cursor-pointer hover:opacity-80 transition-opacity ${
           location.pathname === item.path ? "text-[#f0c419]" : ""
          }`}
         >
          {item.label}
         </div>
        ))}
       </nav>

       {isAuthenticated ? (
        <div className="relative">
         <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="flex items-center gap-2 bg-[#f0c419] hover:bg-[#f0c419]/90 text-[#f0f5ff] px-[25px] py-2.5 rounded-[10px] h-auto font-questrial font-semibold text-[18.5px] tracking-[0] leading-[normal]"
         >
          <User className="h-4 w-4" />
          {user?.name || user?.email?.split('@')[0] || 'User'}
         </button>

         {showUserMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
           <button
            onClick={() => {
             navigate('/profile');
             setShowUserMenu(false);
            }}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
           >
            Profili
           </button>
           <button
            onClick={handleLogout}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center gap-2"
           >
            <LogOut className="h-4 w-4" />
            Çkyçu
           </button>
          </div>
         )}
        </div>
       ) : (
        <Button
         onClick={() => navigate("/login")}
         className="bg-[#f0c419] hover:bg-[#f0c419]/90 text-[#f0f5ff] px-[25px] py-2.5 rounded-[10px] h-auto font-questrial font-semibold text-[18.5px] tracking-[0] leading-[normal]"
        >
         Kyqu
        </Button>
       )}
      </div>

      {/* Mobile/Tablet Header */}
      <div className="lg:hidden px-4 py-3">
       <div className="flex items-center justify-between">
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-600 hover:text-gray-800">
         <Menu className="h-6 w-6" />
        </button>

        <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
         <img className="w-[28px] h-[34px]" alt="Group" src="/group-1321316878.png" />
        </div>

        {isAuthenticated ? (
         <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="flex items-center gap-2 bg-[#f0c419] hover:bg-[#f0c419]/90 text-white px-3 py-1.5 rounded-md text-xs font-semibold"
         >
          <User className="h-3 w-3" />
          {user?.name || user?.email?.split('@')[0] || 'User'}
         </button>
        ) : (
         <Button
          onClick={() => navigate("/login")}
          className="bg-[#f0c419] hover:bg-[#f0c419]/90 text-white px-3 py-1.5 rounded-md text-xs font-semibold"
         >
          Kyqu
         </Button>
        )}
       </div>
      </div>
     </motion.header>
    )}
   </AnimatePresence>

   {/* Mobile Menu Overlay */}
   {isMobileMenuOpen && (
    <div className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300" onClick={() => setIsMobileMenuOpen(false)} />
   )}

   {/* Mobile Menu Drawer */}
   <div
    className={`lg:hidden fixed top-0 left-0 h-full w-72 bg-white z-50 transform transition-transform duration-300 ease-in-out ${
     isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
    }`}
   >
    <div className="p-4">
     <div className="flex items-center justify-between mb-8">
      <img className="w-[30px] h-[36px]" alt="Group" src="/group-1321316878.png" />
      <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-600 hover:text-gray-800">
       <X className="h-6 w-6" />
      </button>
     </div>

     <nav className="space-y-1">
      {navigationItems.map((item, index) => (
       <div
        key={index}
        onClick={() => {
         handleNavClick(item);
         setIsMobileMenuOpen(false);
        }}
        className={`block px-4 py-3 text-base font-semibold text-[#1b2631] hover:bg-[#f0c419]/10 hover:text-[#f0c419] rounded-lg cursor-pointer transition-colors ${
         location.pathname === item.path ? "bg-[#f0c419]/10 text-[#f0c419]" : ""
        }`}
       >
        {item.label}
       </div>
      ))}
     </nav>

     <div className="absolute bottom-8 left-4 right-4 space-y-2">
      {isAuthenticated ? (
       <>
        <button
         onClick={() => {
          navigate('/profile');
          setIsMobileMenuOpen(false);
         }}
         className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
        >
         <User className="h-4 w-4" />
         Profili
        </button>
        <button
         onClick={() => {
          handleLogout();
          setIsMobileMenuOpen(false);
         }}
         className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
        >
         <LogOut className="h-4 w-4" />
         Çkyçu
        </button>
       </>
      ) : (
       <Button
        onClick={() => {
         navigate("/login");
         setIsMobileMenuOpen(false);
        }}
        className="w-full bg-[#f0c419] hover:bg-[#f0c419]/90 text-white py-3 rounded-lg font-semibold"
       >
        Kyqu
       </Button>
      )}
     </div>
    </div>
   </div>
  </>
 );
};