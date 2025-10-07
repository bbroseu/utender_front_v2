import React from "react";
import { motion } from "framer-motion";

export const ContentSection = (): JSX.Element => {
 return (
  <div className="w-full px-4  py-8 lg:py-12">
   <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className="bg-white rounded-xl shadow-lg p-4 md:p-6 lg:p-8 relative overflow-hidden"
   >
    {/* Background vector image - U shape at bottom */}
    <img
     className="absolute left-4 lg:left-8 -bottom-4 w-[100px] md:w-[150px] lg:w-[200px] h-auto opacity-30 z-0"
     alt="Background Vector"
     src="/homepage/uvector.svg"
    />

    <div className="flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-12 relative z-10">
     {/* Left side - Text content */}
     <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2, duration: 0.6 }}
      className="w-full lg:w-2/5"
     >
      <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 md:mb-4 font-questrial">
       Cfarë tenderë publikohen në
       <br className="hidden lg:block" />
       Utender.eu
      </h2>

      <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6 font-questrial">
       Të gjithë tenderët publik dhe privat. Tenderët publikohen çdo ditë dhe në kohe reale.
       <br />
       <br />
       Ana ndahen në <span className="text-yellow-400 font-semibold">kategori</span> dhe{" "}
       <span className="text-yellow-400 font-semibold">regjione</span> të ndryshme. Poashtu ofrohen detaje të tenderëve bashkë me dokumentin zyrtar të
       publikuar.
      </p>
     </motion.div>

     {/* Right side - Table Image */}
     <motion.div
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.4, duration: 0.6 }}
      className="flex-1"
     >
      <img className="w-full h-auto rounded" alt="Tender Categories Table" src="/homepage/third.png" />
     </motion.div>
    </div>
   </motion.div>
  </div>
 );
};
