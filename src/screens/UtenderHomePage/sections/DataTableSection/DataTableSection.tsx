import React from "react";
import { motion } from "framer-motion";
import { Button } from "../../../../components/ui/button";

export const DataTableSection = (): JSX.Element => {
 return (
  <motion.section
   initial={{ opacity: 0 }}
   animate={{ opacity: 1 }}
   transition={{ duration: 0.6 }}
   className="flex flex-col w-full items-center gap-[10px] md:gap-[15px] relative px-4 lg:px-0"
  >
   <motion.header
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2, duration: 0.6 }}
    className="flex flex-col max-w-[681px] items-center gap-2.5 relative"
   >
    <h1 className="relative self-stretch  font-bold text-2xl md:text-4xl pt-14 lg:text-5xl text-center tracking-[-0.90px] md:tracking-[-1.80px] leading-[32px] md:leading-[48px] lg:leading-[58px]">
     <span className="text-[#1b2631] tracking-[-0.43px] md:tracking-[-0.86px]">Njoftimet më të shpejta për tenderët në </span>
     <span className="text-[#f0c419] tracking-[-0.43px] md:tracking-[-0.86px]">Kosovë</span>
    </h1>

    <p className="relative max-w-[553px] opacity-70 font-normal text-[#161c2d] text-base md:text-[17px] lg:text-[19px] text-center tracking-[-0.20px] leading-6 md:leading-7 lg:leading-8">
     Lorem ipsum dolor sit amet consectetur. Nam fames nullam aliquet vivamus integer massa amet vel.
    </p>
   </motion.header>

   {/* Table Image */}
   <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 0.4, duration: 0.6 }}
    className="w-full max-w-[1144px]"
   >
    <img
     className="w-full h-auto"
     alt="Table"
     src="/homepage/table.png"
    />
   </motion.div>

   <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.6, duration: 0.6 }}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
   >
    <Button className="h-auto inline-flex items-center justify-center gap-[6.41px] px-8 md:px-20 lg:px-[140px] py-2.5 md:py-3 bg-[#f0c419] rounded-[10px] hover:bg-[#f0c419]/90">
     <span className="   font-semibold text-[#f0f5ff] text-base md:text-lg">Shiko më shumë</span>
    </Button>
   </motion.div>
  </motion.section>
 );
};
