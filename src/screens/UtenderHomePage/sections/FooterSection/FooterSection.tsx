import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "../../../../components/ui/button";
import { RootState } from "../../../../store/store";

export const FooterSection = (): JSX.Element => {
 const navigate = useNavigate();
 const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

 const navigationLinks = [
  { text: "Tenderët", separator: "/", href: "/tenders" },
  { text: "Pakot", separator: "/", href: "#packages-section", isHash: true },
  { text: "Kontakto", separator: "/", href: "/contact" },
  { text: "Abonohu", separator: "/", href: isAuthenticated ? "/tenders" : "/signup" },
 ];

 const handleNavigate = (link: { href: string; isHash?: boolean; text?: string }) => {
  if (link.isHash) {
   // Navigate to home page first if not already there
   if (window.location.pathname !== '/') {
    navigate('/');
    // Wait for navigation then scroll
    setTimeout(() => {
     const element = document.querySelector(link.href);
     element?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
   } else {
    // Already on home page, just scroll
    const element = document.querySelector(link.href);
    element?.scrollIntoView({ behavior: 'smooth' });
   }
  } else if (link.text === "Abonohu" && isAuthenticated) {
   // For logged-in users clicking Abonohu, navigate to tenders and scroll to top
   navigate(link.href);
   setTimeout(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
   }, 100);
  }
 };

 const emailAddresses = ["info@utender.eu", "info@bbros.eu"];

 const socialMediaLinks = [
  {
   icon: "/ic-baseline-facebook.svg",
   alt: "Ic baseline facebook",
   text: "Utender.eu",
   href: "https://www.facebook.com/utender.eu",
  },
  {
   icon: "/ph-instagram-logo-fill.svg",
   alt: "Ph instagram logo",
   text: "Utender.eu",
   href: "https://www.instagram.com/utender.eu",
  },
 ];

 return (
  <footer className="w-full bg-white">
   <div className="container mx-auto w-full px-4 py-6 lg:py-6">
    {/* Desktop Layout */}
    <div className="hidden lg:flex items-end gap-6">
     <div className="flex flex-col items-start gap-32 flex-1">
      <div className="relative w-[180px] h-[170px]">
       <Link to="/" className="absolute top-0 left-0">
        <img className="w-[33px] h-10 hover:opacity-70 transition-opacity cursor-pointer" alt="Group" src="/group-1321316878-1.png" />
       </Link>

       <nav className="flex flex-col w-[180px] items-start gap-[13px] absolute top-[117px] left-0">
        <div className="inline-flex items-start gap-4 flex-[0_0_auto]">
         {navigationLinks.slice(0, 2).map((link, index) => (
          <React.Fragment key={index}>
           {link.isHash || (link.text === "Abonohu" && isAuthenticated) ? (
            <Button
             variant="ghost"
             onClick={() => handleNavigate(link)}
             className="h-auto p-0 [font-family:'Inter',Helvetica] font-medium text-[#1b2631] text-sm tracking-[0] leading-[19.6px] whitespace-nowrap hover:bg-transparent hover:text-[#f0c419] transition-colors cursor-pointer"
            >
             {link.text}
            </Button>
           ) : (
            <Link to={link.href}>
             <Button
              variant="ghost"
              className="h-auto p-0 [font-family:'Inter',Helvetica] font-medium text-[#1b2631] text-sm tracking-[0] leading-[19.6px] whitespace-nowrap hover:bg-transparent hover:text-[#f0c419] transition-colors"
             >
              {link.text}
             </Button>
            </Link>
           )}
           <div className="mt-[-1.00px] [font-family:'Inter',Helvetica] font-normal text-[#f0c419] text-sm tracking-[0] leading-[19.6px] whitespace-nowrap">
            {link.separator}
           </div>
          </React.Fragment>
         ))}
        </div>

        <div className="flex items-start gap-4 self-stretch w-full flex-[0_0_auto]">
         {navigationLinks.slice(2).map((link, index) => (
          <React.Fragment key={index + 2}>
           {link.isHash || (link.text === "Abonohu" && isAuthenticated) ? (
            <Button
             variant="ghost"
             onClick={() => handleNavigate(link)}
             className="h-auto p-0 [font-family:'Inter',Helvetica] font-medium text-[#1b2631] text-sm tracking-[0] leading-[19.6px] whitespace-nowrap hover:bg-transparent hover:text-[#f0c419] transition-colors cursor-pointer"
            >
             {link.text}
            </Button>
           ) : (
            <Link to={link.href}>
             <Button
              variant="ghost"
              className="h-auto p-0 [font-family:'Inter',Helvetica] font-medium text-[#1b2631] text-sm tracking-[0] leading-[19.6px] whitespace-nowrap hover:bg-transparent hover:text-[#f0c419] transition-colors"
             >
              {link.text}
             </Button>
            </Link>
           )}
           <div className="mt-[-1.00px] [font-family:'Inter',Helvetica] font-normal text-[#f0c419] text-sm tracking-[0] leading-[19.6px] whitespace-nowrap">
            {link.separator}
           </div>
          </React.Fragment>
         ))}
        </div>
       </nav>
      </div>
     </div>

     <div className="flex flex-col items-start justify-end gap-8 flex-1 self-stretch">
      <div className="flex flex-col w-[163px] items-start gap-14 flex-[0_0_auto]">
       <div className="flex flex-col items-start gap-2 self-stretch w-full flex-[0_0_auto]">
        <div className="w-fit mt-[-1.00px] opacity-60 [font-family:'Inter',Helvetica] font-medium text-[#1b2631] text-[10px] tracking-[0.40px] leading-[13px] whitespace-nowrap">
         CONTACT US
        </div>

        <div className="w-fit [font-family:'Inter',Helvetica] font-medium text-[#1b2631] text-md tracking-[0] leading-[21.6px] whitespace-nowrap">
         +383 45 592 500
        </div>
       </div>

       <div className="flex-[0_0_auto] inline-flex flex-col items-start gap-2">
        <div className="w-fit mt-[-1.00px] opacity-60 [font-family:'Inter',Helvetica] font-medium text-[#1b2631] text-[10px] tracking-[0.40px] leading-[13px] whitespace-nowrap">
         EMAIL
        </div>

        {emailAddresses.map((email, index) => (
         <div
          key={index}
          className="w-fit [font-family:'Inter',Helvetica] font-normal text-[#1b2631] text-sm tracking-[0] leading-[19.6px] whitespace-nowrap"
         >
          {email}
         </div>
        ))}
       </div>
      </div>
     </div>

     <div className="flex flex-col items-start justify-end gap-8 flex-1 self-stretch">
      <div className="relative w-[208.5px] h-[170px]">
       <div className="absolute top-0 left-px inline-flex flex-col items-start gap-2">
        <div className="w-fit mt-[-1.00px] opacity-60 [font-family:'Inter',Helvetica] font-medium text-[#1b2631] text-[10px] tracking-[0.40px] leading-[13px] whitespace-nowrap">
         ADDRESS
        </div>

        <address className="w-fit [font-family:'Inter',Helvetica] font-medium text-[#1b2631] text-md tracking-[0] leading-[21.6px] not-italic">
         Rr. Trinë Smajli Prishtinë
         <br />
         Republika e Kosovës
        </address>
       </div>

       <div className="absolute top-[97px] left-0 inline-flex flex-col items-start gap-2">
        <div className="w-fit mt-[-1.00px] opacity-60 [font-family:'Inter',Helvetica] font-medium text-[#1b2631] text-[10px] tracking-[0.40px] leading-[13px] whitespace-nowrap">
         SOCIAL MEDIA
        </div>

        <div className="flex flex-col items-start gap-1 flex-[0_0_auto]">
         {socialMediaLinks.map((social, index) => (
          <a
           key={index}
           href={social.href}
           target="_blank"
           rel="noopener noreferrer"
           className="flex items-center gap-[11px] hover:opacity-70 transition-opacity"
          >
           <Button
            variant="ghost"
            className="h-auto p-0 flex items-center gap-[11px] self-stretch w-full flex-[0_0_auto] hover:bg-transparent"
           >
            <img className="w-6 h-6" alt={social.alt} src={social.icon} />
            <span className="w-fit [font-family:'Inter',Helvetica] font-medium text-[#1b2631] text-sm tracking-[-0.28px] leading-[16.8px] whitespace-nowrap">
             {social.text}
            </span>
           </Button>
          </a>
         ))}
        </div>
       </div>
      </div>
     </div>

     <div className="flex flex-col items-end justify-between flex-1 self-stretch">
      <Button
       variant="ghost"
       className="h-auto p-0 hover:bg-transparent hover:opacity-70 transition-opacity"
       onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
       <img className="w-10 h-10" alt="To top" src="/to-top.svg" />
      </Button>

      <div className="inline-flex items-center gap-4 flex-[0_0_auto]">
       <div className="inline-flex items-center gap-[5px] flex-[0_0_auto]">
        <div className="w-fit mt-[-1.00px] opacity-60 [font-family:'Inter',Helvetica] font-normal text-[#1b2631] text-[10px] tracking-[0] leading-[13px] whitespace-nowrap">
         With
        </div>

        <img className="w-3.5 h-[13px]" alt="Vector" src="/vector-10.svg" />

        <div className="w-fit mt-[-1.00px] opacity-60 [font-family:'Inter',Helvetica] font-normal text-[#1b2631] text-[10px] tracking-[0] leading-[13px] whitespace-nowrap">
         by BBros
        </div>
       </div>

       <div className="w-fit mt-[-1.00px] opacity-60 [font-family:'Inter',Helvetica] font-normal text-[#1b2631] text-[10px] tracking-[0] leading-[13px] whitespace-nowrap">
        © 2023 — Copyright
       </div>
      </div>
     </div>
    </div>

    {/* Mobile/Tablet Layout */}
    <div className="lg:hidden">
     <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
      {/* Logo and Navigation Column */}
      <div className="flex flex-col items-start">
       <Link to="/">
        <img className="w-[33px] h-10 mb-6 hover:opacity-70 transition-opacity cursor-pointer" alt="Group" src="/group-1321316878-1.png" />
       </Link>

       <nav className="flex flex-col gap-2">
        {navigationLinks.map((link, index) => (
         <React.Fragment key={index}>
          {link.isHash || (link.text === "Abonohu" && isAuthenticated) ? (
           <Button
            variant="ghost"
            onClick={() => handleNavigate(link)}
            className="h-auto p-0 text-left justify-start font-medium text-[#1b2631] text-sm hover:text-[#f0c419] hover:bg-transparent transition-colors cursor-pointer"
           >
            {link.text}
           </Button>
          ) : (
           <Link to={link.href}>
            <Button
             variant="ghost"
             className="h-auto p-0 text-left justify-start font-medium text-[#1b2631] text-sm hover:text-[#f0c419] hover:bg-transparent transition-colors"
            >
             {link.text}
            </Button>
           </Link>
          )}
         </React.Fragment>
        ))}
       </nav>
      </div>

      {/* Contact Column */}
      <div className="flex flex-col items-start">
       <div className="mb-4">
        <div className="opacity-60 font-medium text-[#1b2631] text-xs tracking-wider mb-2">CONTACT US</div>
        <div className="font-medium text-[#1b2631] text-lg">+383 45 592 500</div>
       </div>

       <div>
        <div className="opacity-60 font-medium text-[#1b2631] text-xs tracking-wider mb-2">EMAIL</div>
        {emailAddresses.map((email, index) => (
         <div key={index} className="font-normal text-[#1b2631] text-sm mb-1">
          {email}
         </div>
        ))}
       </div>
      </div>

      {/* Address and Social Media Column */}
      <div className="flex flex-col items-start">
       <div className="mb-6">
        <div className="opacity-60 font-medium text-[#1b2631] text-xs tracking-wider mb-2">ADDRESS</div>
        <address className="font-medium text-[#1b2631] text-base not-italic">
         Rr. Trinë Smajli Prishtinë
         <br />
         Republika e Kosovës
        </address>
       </div>

       <div>
        <div className="opacity-60 font-medium text-[#1b2631] text-xs tracking-wider mb-2">SOCIAL MEDIA</div>
        <div className="flex flex-col gap-2">
         {socialMediaLinks.map((social, index) => (
          <a
           key={index}
           href={social.href}
           target="_blank"
           rel="noopener noreferrer"
           className="flex items-center gap-2 hover:opacity-70 transition-opacity"
          >
           <Button variant="ghost" className="h-auto p-0 flex items-center gap-2 justify-start hover:bg-transparent">
            <img className="w-5 h-5" alt={social.alt} src={social.icon} />
            <span className="font-medium text-[#1b2631] text-sm">{social.text}</span>
           </Button>
          </a>
         ))}
        </div>
       </div>
      </div>

      {/* Copyright Column */}
      <div className="flex flex-col items-start sm:items-end justify-between h-full">
       <Button
        variant="ghost"
        className="h-auto p-2 hover:bg-gray-200 rounded-full mb-4"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
       >
        <img className="w-8 h-8" alt="To top" src="/to-top.svg" />
       </Button>

       <div className="flex flex-col items-start sm:items-end gap-2 text-xs">
        <div className="flex items-center gap-1">
         <span className="opacity-60 font-normal text-[#1b2631]">With</span>
         <img className="w-3 h-3" alt="Heart" src="/vector-10.svg" />
         <span className="opacity-60 font-normal text-[#1b2631]">by BBros</span>
        </div>
        <div className="opacity-60 font-normal text-[#1b2631]">© 2023 — Copyright</div>
       </div>
      </div>
     </div>
    </div>
   </div>
  </footer>
 );
};
