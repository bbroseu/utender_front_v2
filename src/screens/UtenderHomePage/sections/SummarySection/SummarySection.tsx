import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../../../../components/ui/button";

export const SummarySection = (): JSX.Element => {
 const navigate = useNavigate();
 const features = [
  "Listimi i të gjithë tenderëve",
  "Pranimi i të gjithë tenderëve në email",
  "Klasifikimi i tendereve sipas profilit tuaj",
  "Me një klikim, kerko dosje tenderi",
 ];

 const plans = [
  {
   price: "17 €",
   period: "1 Muaj",
   email: "1 Email",
   features: [true, true, true, false],
   buttonClass: "bg-[#1e3a5f] hover:bg-[#2a4a7f] text-white",
  },
  {
   price: "45 €",
   period: "3 Muaj",
   email: "1 Email",
   features: [true, true, true, true],
   buttonClass: "bg-[#1e3a5f] hover:bg-[#2a4a7f] text-white",
  },
  {
   price: "84 €",
   period: "6 Muaj",
   email: "1 Email",
   features: [true, true, true, true],
   buttonClass: "bg-[#1e3a5f] hover:bg-[#2a4a7f] text-white",
  },
  {
   price: "150 €",
   period: "12 Muaj",
   email: "2 Email",
   features: [true, true, true, true],
   buttonClass: "bg-[#FFC107] hover:bg-[#FFB300] text-black font-bold",
   isHighlighted: true,
  },
 ];

 return (
  <section id="packages-section" className="w-full py-8 md:py-12 lg:py-16">
   <div className="container mx-auto px-8 ">
    {/* Header */}
    <motion.div
     initial={{ opacity: 0, y: 30 }}
     whileInView={{ opacity: 1, y: 0 }}
     viewport={{ once: true }}
     transition={{ duration: 0.6 }}
     className="text-center mb-8 md:mb-12"
    >
     <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 font-questrial text-[#1b2631]">Çmime të përballueshme</h2>
     <p className="text-gray-600 text-sm md:text-base font-questrial max-w-2xl mx-auto">
      Lorem ipsum dolor sit amet consectetur. Nam fames nullam
      <br />
      aliquet vivamus integer massa amet vel.
     </p>
    </motion.div>

    {/* Desktop Pricing Table */}
    <motion.div
     initial={{ opacity: 0, y: 40 }}
     whileInView={{ opacity: 1, y: 0 }}
     viewport={{ once: true }}
     transition={{ delay: 0.2, duration: 0.6 }}
     className="hidden lg:block bg-white"
    >
     <table className="w-full">
      <thead>
       <tr>
        {/* Compare Plans Column Header */}
        <td className="p-6 align-top bg-white border-r border-gray-200">
         <div className="mb-6">
          <h3 className="text-lg font-bold mb-2 font-questrial text-[#1b2631]">Compare plans</h3>
          <p className="text-xs text-gray-600 font-questrial leading-relaxed">
           Choose your workspace plan
           <br />
           according to your organizational
           <br />
           plan
          </p>
         </div>
        </td>

        {/* Plan Headers */}
        {plans.map((plan, index) => (
         <td key={index} className={`p-6 text-center align-top bg-white ${index < plans.length - 1 ? "border-r border-gray-200" : ""}`}>
          <div className="mb-4">
           <div className="flex items-baseline justify-center gap-2">
            <span className={`text-3xl font-bold font-questrial ${plan.isHighlighted ? "text-[#FFC107]" : "text-[#1e3a5f]"}`}>
             {plan.price.split(" ")[0]}
            </span>
            <span className={`text-xl font-bold font-questrial ${plan.isHighlighted ? "text-[#FFC107]" : "text-[#1e3a5f]"}`}>
             {plan.price.split(" ")[1]}
            </span>
            <span className="text-sm text-gray-500 font-questrial">/ {plan.period}</span>
           </div>
          </div>
          <Button onClick={() => navigate('/register')} className={`w-full py-2 px-4 font-semibold font-questrial rounded-lg text-sm ${plan.buttonClass}`}>Abonohu</Button>
         </td>
        ))}
       </tr>
      </thead>
      <tbody>
       {/* Email Row */}
       <tr className="border-t border-gray-100">
        <td className="px-6 py-4 font-questrial text-sm text-gray-700 bg-white border-r border-gray-200">Email</td>
        {plans.map((plan, index) => (
         <td
          key={index}
          className={`px-6 py-4 text-center font-questrial text-sm text-gray-700 bg-white ${
           index < plans.length - 1 ? "border-r border-gray-200" : ""
          }`}
         >
          {plan.email}
         </td>
        ))}
       </tr>

       {/* Feature Rows */}
       {features.map((feature, featureIndex) => (
        <tr key={featureIndex} className="border-t border-gray-100">
         <td className="px-6 py-4 font-questrial text-sm text-gray-700 bg-white border-r border-gray-200">{feature}</td>
         {plans.map((plan, planIndex) => (
          <td key={planIndex} className={`px-6 py-4 text-center bg-white ${planIndex < plans.length - 1 ? "border-r border-gray-200" : ""}`}>
           {plan.features[featureIndex] ? (
            <img
             src={plan.isHighlighted ? "/homepage/yellow-vector.svg" : "/homepage/blue-vector.svg"}
             alt="Check"
             className="w-6 h-6 inline-block"
            />
           ) : (
            <span></span>
           )}
          </td>
         ))}
        </tr>
       ))}
      </tbody>
     </table>
    </motion.div>

    {/* Mobile/Tablet Pricing Cards */}
    <div className="lg:hidden">
     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      {plans.map((plan, index) => (
       <motion.div
        key={index}
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1, duration: 0.5 }}
        whileHover={{ scale: 1.02 }}
        className={`bg-white rounded-lg shadow-lg p-6 ${plan.isHighlighted ? "border-2 border-[#FFC107]" : "border border-gray-200"}`}
       >
        <div className="text-center mb-4">
         <div className="flex items-baseline justify-center gap-2">
          <span className={`text-3xl font-bold font-questrial ${plan.isHighlighted ? "text-[#FFC107]" : "text-[#1e3a5f]"}`}>
           {plan.price.split(" ")[0]}
          </span>
          <span className={`text-xl font-bold font-questrial ${plan.isHighlighted ? "text-[#FFC107]" : "text-[#1e3a5f]"}`}>
           {plan.price.split(" ")[1]}
          </span>
          <span className="text-sm text-gray-500 font-questrial">/ {plan.period}</span>
         </div>
         <p className="text-sm text-gray-600 mt-2">{plan.email}</p>
        </div>
        <Button onClick={() => navigate('/register')} className={`w-full py-2 px-4 font-semibold font-questrial rounded-lg text-sm mb-4 ${plan.buttonClass}`}>Abonohu</Button>
        <div className="space-y-2">
         {features.map((feature, featureIndex) => (
          <div key={featureIndex} className="flex items-center gap-2">
           {plan.features[featureIndex] ? (
            <img
             src={plan.isHighlighted ? "/homepage/yellow-vector.svg" : "/homepage/blue-vector.svg"}
             alt="Check"
             className="w-5 h-5 flex-shrink-0"
            />
           ) : (
            <div className="w-5 h-5 flex-shrink-0" />
           )}
           <span className={`text-sm ${plan.features[featureIndex] ? "text-gray-700" : "text-gray-400 line-through"}`}>{feature}</span>
          </div>
         ))}
        </div>
       </motion.div>
      ))}
     </div>
    </div>
   </div>
  </section>
 );
};
