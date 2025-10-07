import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { FooterSection } from "../UtenderHomePage/sections/FooterSection/FooterSection";
import { useLoginMutation } from "../../store/api/authApi";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { loginStart, loginSuccess, loginFailure, clearError } from "../../store/slices/authSlice";
import { AlertCircle, CheckCircle } from "lucide-react";

export const LoginPage = (): JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading, error } = useAppSelector((state) => state.auth);
  const [login] = useLoginMutation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Clear messages when user starts typing
    if (error) {
      dispatch(clearError());
    }
    if (successMessage) {
      setSuccessMessage("");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // Prevent default form submission and page refresh
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    console.log("🔥 LOGIN BUTTON CLICKED - handleSubmit called");

    // Clear any previous messages
    dispatch(clearError());
    setSuccessMessage("");

    console.log("📊 Current error state before submit:", error);

    // Trim whitespace from inputs
    const email = formData.email.trim();
    const password = formData.password.trim();

    console.log("📝 Form data:", { email, passwordLength: password.length });

    // Enhanced validation
    if (!email || !password) {
      console.log("❌ Validation failed: Empty fields");
      const errorMsg = "Ju lutem plotësoni të gjitha fushat";
      dispatch(loginFailure(errorMsg));
      console.log("📢 Error state should now be:", errorMsg);
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log("❌ Validation failed: Invalid email format");
      const errorMsg = "Ju lutem shkruani një email të vlefshëm";
      dispatch(loginFailure(errorMsg));
      console.log("📢 Error state should now be:", errorMsg);
      return;
    }

    if (password.length < 6) {
      console.log("❌ Validation failed: Password too short");
      const errorMsg = "Fjalëkalimi duhet të ketë të paktën 6 karaktere";
      dispatch(loginFailure(errorMsg));
      console.log("📢 Error state should now be:", errorMsg);
      return;
    }

    console.log("✅ Validation passed, proceeding with API call...");

    try {
      dispatch(loginStart());

      console.log("🔄 Calling login API with:", { email, password: "***" });

      const result = await login({
        email,
        password,
      }).unwrap();

      console.log("✅ Login API successful:", result);

      dispatch(loginSuccess({
        user: result.user,
        token: result.token,
      }));

      // Show success message briefly before redirect
      setSuccessMessage("Kyqja u krye me sukses! Duke ju ridrejtuar...");
      setTimeout(() => {
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      }, 1500);

    } catch (error: any) {
      console.error("❌ Login error caught:", error);
      console.error("📋 Error details:", {
        status: error?.status,
        data: error?.data,
        message: error?.message,
        fullError: JSON.stringify(error)
      });

      let errorMessage = "Ka ndodhur një gabim. Ju lutem provoni përsëri.";

      // Check for 401 Unauthorized (wrong credentials)
      if (error?.status === 401 || error?.originalStatus === 401) {
        errorMessage = "Email ose fjalëkalim i gabuar. Kontrolloni të dhënat dhe provoni përsëri.";
      }
      // Check for 429 Too Many Requests
      else if (error?.status === 429 || error?.originalStatus === 429) {
        errorMessage = "Shumë përpjekje. Ju lutem prisni pak dhe provoni përsëri.";
      }
      // Check for 500 Server Error
      else if (error?.status === 500 || error?.originalStatus === 500) {
        errorMessage = "Gabim në server. Ju lutem provoni më vonë.";
      }
      // Check for error message in response data
      else if (error?.data?.message) {
        errorMessage = error.data.message;
      }
      // Check for generic error message
      else if (error?.message) {
        errorMessage = error.message;
      }
      // Check for network errors
      else if (error?.error) {
        errorMessage = "Problem me lidhjen. Kontrolloni internetin dhe provoni përsëri.";
      }

      console.error("📢 Dispatching error message:", errorMessage);
      dispatch(loginFailure(errorMessage));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-questrial">
      {/* Login Form */}
      <div className="flex items-center justify-center py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-2 text-[#1b2631]">
            Kyqu
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
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                type="email"
                name="email"
                placeholder="Shkruani email-in tuaj"
                value={formData.email}
                onChange={handleChange}
                className="w-full"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fjalëkalimi
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Shkruani Fjalëkalimin"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pr-10"
                  autoComplete="current-password"
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

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-600">Keni harruar fjalëkalimin?</span>
              </label>
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-sm text-[#f0c419] hover:underline">
                Ndryshoni
              </button>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#f0c419] hover:bg-[#f0c419]/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg text-base"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Duke u kyqur...</span>
                </div>
              ) : (
                "Kyqu"
              )}
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">OSE</span>
              </div>
            </div>

            <Button
              type="button"
              className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-lg text-base flex items-center justify-center gap-2"
            >
              <img src="/google.svg" alt="Google" className="w-5 h-5" />
              Continue with Google
            </Button>

            <p className="text-center text-sm text-gray-600 mt-6">
              Nuk jeni të regjistruar?{" "}
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="text-[#f0c419] hover:underline font-semibold">
                Regjistrohuni këtu
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