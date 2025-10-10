import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { FooterSection } from "../UtenderHomePage/sections/FooterSection/FooterSection";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export const ContactPage = (): JSX.Element => {
 const [formData, setFormData] = useState({
  name: "",
  email: "",
  subject: "",
  message: "",
 });

 const [isSubmitting, setIsSubmitting] = useState(false);
 const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

 const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  setFormData({
   ...formData,
   [e.target.name]: e.target.value,
  });
 };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
   const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://api.utender.eu';

   const response = await fetch(`${apiBaseUrl}/api/contact`, {
    method: 'POST',
    headers: {
     'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
   });

   const result = await response.json();

   if (result.success) {
    setSubmitStatus("success");
    // Reset form after 3 seconds
    setTimeout(() => {
     setFormData({ name: "", email: "", subject: "", message: "" });
     setSubmitStatus("idle");
    }, 3000);
   } else {
    setSubmitStatus("error");
    setTimeout(() => {
     setSubmitStatus("idle");
    }, 5000);
   }
  } catch (error) {
   console.error("Error submitting contact form:", error);
   setSubmitStatus("error");
   setTimeout(() => {
    setSubmitStatus("idle");
   }, 5000);
  } finally {
   setIsSubmitting(false);
  }
 };

 return (
  <div className="min-h-screen bg-white font-questrial">
   {/* Hero Section */}
   <div className="bg-gradient-to-br from-[#f0c419]/10 to-white py-16 md:py-20">
    <div className="container mx-auto px-4 lg:px-[148px]">
     <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center max-w-2xl mx-auto"
     >
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1b2631] mb-4">Na Kontaktoni</h1>
      <p className="text-gray-600 text-lg">
       Keni pyetje? Jemi këtu për t'ju ndihmuar. Dërgoni një mesazh dhe do t'ju përgjigjemi sa më shpejt të jetë e mundur.
      </p>
     </motion.div>
    </div>
   </div>

   {/* Contact Information */}
   <div className="py-12 md:py-16">
    <div className="container mx-auto px-4 lg:px-[148px]">
     <div className="max-w-4xl mx-auto">
      {/* Contact Information */}
      <motion.div
       initial={{ opacity: 0, y: 30 }}
       whileInView={{ opacity: 1, y: 0 }}
       viewport={{ once: true }}
       transition={{ duration: 0.6 }}
      >
       <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
        <h2 className="text-3xl md:text-4xl font-bold text-[#1b2631] mb-8 text-center">Informata Kontakti</h2>

        <div className="space-y-8">
         <div className="flex items-start gap-6">
          <div className="bg-[#f0c419]/10 p-4 rounded-lg">
           <Mail className="w-8 h-8 text-[#f0c419]" />
          </div>
          <div>
           <h3 className="text-xl font-semibold text-[#1b2631] mb-2">Email</h3>
           <p className="text-gray-600 text-lg">info@utender.eu</p>
           <p className="text-gray-600 text-lg">support@utender.eu</p>
          </div>
         </div>

         <div className="flex items-start gap-6">
          <div className="bg-[#f0c419]/10 p-4 rounded-lg">
           <Phone className="w-8 h-8 text-[#f0c419]" />
          </div>
          <div>
           <h3 className="text-xl font-semibold text-[#1b2631] mb-2">Telefoni</h3>
           <p className="text-gray-600 text-lg">+383 44 123 456</p>
           <p className="text-gray-600 text-lg">+383 49 123 456</p>
          </div>
         </div>

         <div className="flex items-start gap-6">
          <div className="bg-[#f0c419]/10 p-4 rounded-lg">
           <MapPin className="w-8 h-8 text-[#f0c419]" />
          </div>
          <div>
           <h3 className="text-xl font-semibold text-[#1b2631] mb-2">Adresa</h3>
           <p className="text-gray-600 text-lg">
            Xhevded Doda (Dukagjini Tower)
            <br />
            Prishtinë, Kosovë
           </p>
          </div>
         </div>
        </div>

        <div className="mt-10 pt-10 border-t border-gray-200">
         <h3 className="text-xl font-semibold text-[#1b2631] mb-6 text-center">Orari i punës</h3>
         <div className="space-y-4 text-lg text-gray-600">
          <div className="flex justify-between items-center">
           <span>E Hënë - E Premte:</span>
           <span className="font-medium text-[#1b2631]">09:00 - 17:00</span>
          </div>
          <div className="flex justify-between items-center">
           <span>E Shtunë:</span>
           <span className="font-medium text-[#1b2631]">10:00 - 14:00</span>
          </div>
          <div className="flex justify-between items-center">
           <span>E Diel:</span>
           <span className="font-medium text-red-500">Mbyllur</span>
          </div>
         </div>
        </div>
       </div>
      </motion.div>
     </div>
    </div>
   </div>

   {/* Footer */}
   <FooterSection />
  </div>
 );
};
