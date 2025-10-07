import React from "react";
import { motion } from "framer-motion";

export const HeaderSection = (): JSX.Element => {
 return (
  <motion.div
   initial={{ opacity: 0, x: -50 }}
   whileInView={{ opacity: 1, x: 0 }}
   viewport={{ once: true }}
   transition={{ duration: 0.6 }}
   className="w-full h-full bg-white rounded-xl shadow-lg p-4 md:p-6 lg:p-8 flex flex-col"
  >
   <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 md:mb-4 font-questrial">Cfarë ofron Utender.eu?</h2>
   <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6 font-questrial">
    <span className="text-yellow-400 font-semibold">uTender.eu</span> informon kompani dhe individë për tenderët në Kosovë. Publikojmë të gjitha{" "}
    <span className="text-yellow-400 font-semibold">tenderët aktivë</span> në kohë reale, çdo ditë.
   </p>

   {/* Full height image */}
   <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.6 }} className="flex-1">
    <img className="w-full h-full object-contain rounded" alt="Tender Table" src="/homepage/first1 (2).png" />
   </motion.div>
  </motion.div>
 );
};
