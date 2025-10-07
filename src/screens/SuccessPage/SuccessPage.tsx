import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { FooterSection } from "../UtenderHomePage/sections/FooterSection/FooterSection";

export const SuccessPage = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 font-questrial">

      {/* Success Content */}
      <div className="flex items-center justify-center py-20">
        <div className="text-center max-w-2xl px-4">
          <h1 className="text-4xl font-bold text-[#1b2631] mb-8">
            Abonimi u krye me <span className="text-[#f0c419]">sukses</span>
          </h1>

          <div className="mb-8">
            <img
              src="/abonimi.svg"
              alt="Success"
              className="w-64 h-64 mx-auto"
            />
          </div>

          <p className="text-gray-600 text-lg mb-3">
            Faleminderit për abonimin,
          </p>
          <p className="text-gray-600 text-lg mb-8">
            Konfirmimin nga Administratori do të pranoni në email.
          </p>

          <Button
            onClick={() => navigate('/')}
            className="w-full bg-[#f0c419] hover:bg-[#f0c419]/90 text-white py-3 rounded-lg font-semibold text-base"
          >
            Vazhdo në ballinë
          </Button>
        </div>
      </div>

      {/* Footer */}
      <FooterSection />
    </div>
  );
};