import React from "react";
import { motion } from "framer-motion";
import { ContentSection } from "./sections/ContentSection/ContentSection";
import { DataTableSection } from "./sections/DataTableSection/DataTableSection";
import { FooterSection } from "./sections/FooterSection/FooterSection";
import { HeaderSection } from "./sections/HeaderSection/HeaderSection";
import { InsightsSection } from "./sections/InsightsSection/InsightsSection";
import { NavigationSection } from "./sections/NavigationSection/NavigationSection";
import { SummarySection } from "./sections/SummarySection/SummarySection";

export const UtenderHomePage = (): JSX.Element => {

 return (
  <div className="relative w-full bg-white font-questrial">
   <div className="absolute top-[-373px] left-[calc(50.00%_-_358px)] w-[716px] h-[716px] bg-[#2972f51a] rounded-[358px] blur-[200px]" />

   <main className="flex flex-col w-full">
    <section className="w-full">
     <DataTableSection />
    </section>

    {/* Scrolling Tape/Marquee - Centered in Container */}
    <div className="container">
     <div className=" px-4 my-8">
      <div className="w-full overflow-hidden">
       <motion.div
        className="flex"
        animate={{
         x: ["0%", "-50%"],
        }}
        transition={{
         x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 30,
          ease: "linear",
         },
        }}
       >
        {/* Duplicate images for seamless loop */}
        <div className="flex items-center  gap-0 shrink-0">
         <img className="h-[63px] w-auto" alt="Frame" src="/frame-1618868864.svg" />
         <img className="h-[63px] w-auto" alt="Frame" src="/frame-1618868864.svg" />
        </div>
        <div className="flex items-center  gap-0 shrink-0">
         <img className="h-[63px] w-auto" alt="Frame" src="/frame-1618868864.svg" />
         <img className="h-[63px] w-auto" alt="Frame" src="/frame-1618868864.svg" />
        </div>
       </motion.div>
      </div>
     </div>
     <div className="px-4  py-8 lg:py-12 relative">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
       <section className="w-full min-h-[400px] lg:min-h-[600px] relative z-10">
        <HeaderSection />
       </section>
       <section className="w-full min-h-[400px] lg:min-h-[600px]">
        <NavigationSection />
       </section>
      </div>
     </div>
    </div>

    <div className="container">
     <section className="w-full">
      <ContentSection />
     </section>
    </div>

    <section className="w-full">
     <SummarySection />
    </section>

    <section className="w-full">
     <InsightsSection />
    </section>

    <section className="w-full">
     <FooterSection />
    </section>
   </main>
  </div>
 );
};
