import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { FooterSection } from "../UtenderHomePage/sections/FooterSection/FooterSection";
import { useRegisterMutation } from "../../store/api/authApi";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { loginSuccess, clearError } from "../../store/slices/authSlice";
import { AlertCircle, CheckCircle } from "lucide-react";

export const RegisterPage = (): JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, error } = useAppSelector((state) => state.auth);
  const [register, { isLoading }] = useRegisterMutation();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    companyName: "",
    fiscalNumber: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [validationError, setValidationError] = useState("");

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Clear errors when component mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Clear messages when user starts typing
    if (error) {
      dispatch(clearError());
    }
    if (validationError) {
      setValidationError("");
    }
    if (successMessage) {
      setSuccessMessage("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());
    setValidationError("");
    setSuccessMessage("");

    // Validation
    const { username, email, password, confirmPassword } = formData;

    if (!username || !email || !password || !confirmPassword) {
      setValidationError("Ju lutem plotësoni të gjitha fushat e detyrueshme");
      return;
    }

    if (username.length < 3) {
      setValidationError("Përdoruesi duhet të ketë të paktën 3 karaktere");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationError("Ju lutem shkruani një email të vlefshëm");
      return;
    }

    if (password.length < 6) {
      setValidationError("Fjalëkalimi duhet të ketë të paktën 6 karaktere");
      return;
    }

    if (password !== confirmPassword) {
      setValidationError("Fjalëkalimet nuk përputhen");
      return;
    }

    try {
      const registrationData = {
        username: username.trim(),
        email: email.trim(),
        password,
        firstName: formData.firstName?.trim(),
        lastName: formData.lastName?.trim(),
        phone: formData.phone?.trim(),
        companyName: formData.companyName?.trim(),
        fiscalNumber: formData.fiscalNumber?.trim(),
      };

      const result = await register(registrationData).unwrap();

      console.log("Registration successful:", result);

      // Show success message
      setSuccessMessage("Regjistrimi u krye me sukses! Duke ju ridrejtuar në faqen kryesore...");

      // Navigate to login page after a brief delay
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error: any) {
      console.error("Registration error:", error);

      let errorMessage = "Ka ndodhur një gabim. Ju lutem provoni përsëri.";

      if (error.status === 409) {
        errorMessage = "Përdoruesi ose email-i ekziston tashmë";
      } else if (error.status === 400) {
        errorMessage = "Të dhënat e futura janë të pavlefshme";
      } else if (error.status === 500) {
        errorMessage = "Gabim në server. Ju lutem provoni më vonë.";
      } else if (error.data?.message) {
        errorMessage = error.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setValidationError(errorMessage);
    }
  };

  return (
    <div className="flex flex-col bg-gray-50 font-questrial">

      {/* Register Form */}
      <div className="flex items-center justify-center py-8 md:py-16 px-4 min-h-[calc(100vh-300px)]">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-2 text-[#1b2631]">
            Abonohu
          </h2>
          <p className="text-center text-gray-600 text-sm mb-6">
            Shkruani të dhënat e kërkuara më poshtë
          </p>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">{successMessage}</span>
            </div>
          )}

          {/* Error Message */}
          {(error || validationError) && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error || validationError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Përdorues <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                name="username"
                placeholder="Shkruani emrin e përdoruesit"
                value={formData.username}
                onChange={handleChange}
                className="w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Adresa <span className="text-red-500">*</span>
              </label>
              <Input
                type="email"
                name="email"
                placeholder="Shkruani email adresën"
                value={formData.email}
                onChange={handleChange}
                className="w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fjalëkalimi <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Shkruani Fjalëkalimin"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ri-shkruaj Fjalëkalimin <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Ri-shkruani Fjalëkalimin"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Numri telefonit
              </label>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kompania
              </label>
              <Input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Numri Fiskal / NIPT
              </label>
              <Input
                type="text"
                name="fiscalNumber"
                value={formData.fiscalNumber}
                onChange={handleChange}
                className="w-full"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#f0c419] hover:bg-[#f0c419]/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg text-base"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Duke u regjistruar...</span>
                </div>
              ) : (
                "Abonohu"
              )}
            </Button>

            <p className="text-center text-sm text-gray-600 mt-6">
              Jeni të regjistruar?{" "}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-[#f0c419] hover:underline font-semibold">
                Kyçuni këtu
              </button>
            </p>
          </form>
        </div>
      </div>

      {/* Footer */}
      <FooterSection />
    </div>
  );
};