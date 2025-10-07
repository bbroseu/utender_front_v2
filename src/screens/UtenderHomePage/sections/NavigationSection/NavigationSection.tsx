import React from "react";
import { motion } from "framer-motion";

export const NavigationSection = (): JSX.Element => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="w-full h-full bg-white rounded-xl shadow-lg p-4 md:p-6 lg:p-8"
    >
      <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 md:mb-4 font-questrial">Si shkon procedura e regjistrimit?</h2>
      <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6 font-questrial">
        Klikoni butonin <span className="text-yellow-400 font-semibold">ABONOHU</span> dhe plotësoni të dhënat tuaja saktë. Pritni
        konfirmimin e administratorit. Pas konfirmimit, përfitoni shërbimin tonë.
        Abonohu tani dhe fito një javë <span className="text-yellow-400 font-semibold">FALAS!</span>
      </p>

      {/* Registration Forms Image */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="w-full"
      >
        <img
          className="w-full h-auto rounded"
          alt="Registration Forms"
          src="/homepage/second.png"
        />
      </motion.div>
    </motion.div>
  );
};