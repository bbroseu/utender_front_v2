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
   const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

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

   {/* Contact Form & Info */}
   <div className="py-12 md:py-16">
    <div className="container mx-auto px-4 lg:px-[148px]">
     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
      {/* Contact Information */}
      <motion.div
       initial={{ opacity: 0, x: -30 }}
       whileInView={{ opacity: 1, x: 0 }}
       viewport={{ once: true }}
       transition={{ duration: 0.6 }}
       className="lg:col-span-1"
      >
       <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-[#1b2631] mb-6">Informata Kontakti</h2>

        <div className="space-y-6">
         <div className="flex items-start gap-4">
          <div className="bg-[#f0c419]/10 p-3 rounded-lg">
           <Mail className="w-5 h-5 text-[#f0c419]" />
          </div>
          <div>
           <h3 className="font-semibold text-[#1b2631] mb-1">Email</h3>
           <p className="text-gray-600 text-sm">info@utender.eu</p>
           <p className="text-gray-600 text-sm">support@utender.eu</p>
          </div>
         </div>

         <div className="flex items-start gap-4">
          <div className="bg-[#f0c419]/10 p-3 rounded-lg">
           <Phone className="w-5 h-5 text-[#f0c419]" />
          </div>
          <div>
           <h3 className="font-semibold text-[#1b2631] mb-1">Telefoni</h3>
           <p className="text-gray-600 text-sm">+383 44 123 456</p>
           <p className="text-gray-600 text-sm">+383 49 123 456</p>
          </div>
         </div>

         <div className="flex items-start gap-4">
          <div className="bg-[#f0c419]/10 p-3 rounded-lg">
           <MapPin className="w-5 h-5 text-[#f0c419]" />
          </div>
          <div>
           <h3 className="font-semibold text-[#1b2631] mb-1">Adresa</h3>
           <p className="text-gray-600 text-sm">
            Rr. Garibaldi, Nr. 15
            <br />
            10000 Prishtinë, Kosovë
           </p>
          </div>
         </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
         <h3 className="font-semibold text-[#1b2631] mb-3">Orari i punës</h3>
         <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
           <span>E Hënë - E Premte:</span>
           <span className="font-medium">09:00 - 17:00</span>
          </div>
          <div className="flex justify-between">
           <span>E Shtunë:</span>
           <span className="font-medium">10:00 - 14:00</span>
          </div>
          <div className="flex justify-between">
           <span>E Diel:</span>
           <span className="font-medium text-red-500">Mbyllur</span>
          </div>
         </div>
        </div>
       </div>
      </motion.div>

      {/* Contact Form */}
      <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
       <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-[#1b2631] mb-6">Dërgoni një Mesazh</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
           <label className="block text-sm font-medium text-gray-700 mb-2">Emri juaj *</label>
           <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full"
            placeholder="Shkruani emrin tuaj"
            required
           />
          </div>

          <div>
           <label className="block text-sm font-medium text-gray-700 mb-2">Email adresa *</label>
           <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full"
            placeholder="email@example.com"
            required
           />
          </div>
         </div>

         <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Subjekti</label>
          <Input
           type="text"
           name="subject"
           value={formData.subject}
           onChange={handleChange}
           className="w-full"
           placeholder="Shkruani subjektin e mesazhit"
          />
         </div>

         <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Mesazhi juaj *</label>
          <textarea
           name="message"
           value={formData.message}
           onChange={handleChange}
           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f0c419] focus:border-transparent resize-none"
           rows={6}
           placeholder="Shkruani mesazhin tuaj këtu..."
           required
          />
         </div>

         {submitStatus === "success" && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-green-50 text-green-600 px-4 py-3 rounded-lg">
           ✓ Mesazhi juaj është dërguar me sukses! Do t'ju përgjigjemi së shpejti.
          </motion.div>
         )}

         {submitStatus === "error" && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 text-red-600 px-4 py-3 rounded-lg">
           ✗ Ka ndodhur një gabim. Ju lutemi provoni përsëri.
          </motion.div>
         )}

         <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full md:w-auto bg-[#f0c419] hover:bg-[#f0c419]/90 text-white px-8 py-3 rounded-lg font-semibold text-base flex items-center justify-center gap-2"
         >
          {isSubmitting ? (
           <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            Duke dërguar...
           </>
          ) : (
           <>
            <Send className="w-4 h-4" />
            Dërgo Mesazhin
           </>
          )}
         </Button>
        </form>
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
