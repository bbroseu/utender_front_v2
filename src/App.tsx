import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { Layout } from "./components/Layout/Layout";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { BackToTop } from "./components/BackToTop";
import { UtenderHomePage } from "./screens/UtenderHomePage/UtenderHomePage";
import { RegisterPage } from "./screens/RegisterPage/RegisterPage";
import { LoginPage } from "./screens/LoginPage/LoginPage";
import { ForgotPasswordPage } from "./screens/ForgotPasswordPage/ForgotPasswordPage";
import { SuccessPage } from "./screens/SuccessPage/SuccessPage";
import { TenderListPage } from "./screens/TenderListPage/TenderListPage";
import { ProfilePage } from "./screens/ProfilePage/ProfilePage";
import { ContactPage } from "./screens/ContactPage/ContactPage";
import { useAppDispatch } from "./store/hooks";
import { loadUserFromStorage } from "./store/slices/authSlice";

export const App = (): JSX.Element => {
  const dispatch = useAppDispatch();

  // Load user from localStorage on app initialization
  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<UtenderHomePage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Auth routes - redirect if already authenticated */}
          <Route
            path="/login"
            element={
              <ProtectedRoute requireAuth={false}>
                <LoginPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/register"
            element={
              <ProtectedRoute requireAuth={false}>
                <RegisterPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <ProtectedRoute requireAuth={false}>
                <ForgotPasswordPage />
              </ProtectedRoute>
            }
          />

          {/* Protected routes - require authentication */}
          <Route
            path="/tenders"
            element={
              <ProtectedRoute>
                <TenderListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/success"
            element={
              <ProtectedRoute>
                <SuccessPage />
              </ProtectedRoute>
            }
          />
        </Routes>
        <BackToTop />
      </Layout>
    </Router>
  );
};