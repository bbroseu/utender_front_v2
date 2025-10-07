import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { FooterSection } from "../UtenderHomePage/sections/FooterSection/FooterSection";

export const ForgotPasswordPage = (): JSX.Element => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Password reset submitted:", formData);
    // Handle password reset logic here
  };

  return (
    <div className="min-h-screen bg-gray-50 font-questrial">

      {/* Forgot Password Form */}
      <div className="flex items-center justify-center py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-2 text-[#1b2631]">
            Ndrysho Fjalëkalimin
          </h2>
          <p className="text-center text-gray-600 text-sm mb-6">
            Shkruani fjalëkalimin e ri
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fjalëkalimi i ri
              </label>
              <div className="relative">
                <Input
                  type="password"
                  name="password"
                  placeholder="Shkruani Fjalëkalimin e ri"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pr-10"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  👁️
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ri-shkruaj Fjalëkalimin
              </label>
              <div className="relative">
                <Input
                  type="password"
                  name="confirmPassword"
                  placeholder="Ri-shkruani Fjalëkalimin e ri"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pr-10"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  👁️
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#f0c419] hover:bg-[#f0c419]/90 text-white font-semibold py-3 rounded-lg text-base"
            >
              Ndrysho
            </Button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <FooterSection />
    </div>
  );
};