import { Routes, Route, Navigate } from "react-router-dom";
import Login from "@/pages/auth/Login";
import Signup from "@/pages/auth/Signup";
import SignupOne from "@/pages/auth/SignupOne";
import SignupTwo from "@/pages/auth/SignupTwo";
import SignupSuccess from "@/pages/auth/SignupSuccess";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import Home from "@/pages/Home";
import SetOtp from "@/pages/auth/SetOtp";
import SetPassword from "@/pages/auth/SetPassword";
import ProtectedRoute from "@/router/ProtectedRoute";
import AuthRoute from "@/router/AuthRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route
        path="/login"
        element={
          <AuthRoute>
            <Login />
          </AuthRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <AuthRoute>
            <Signup />
          </AuthRoute>
        }
      />
      <Route
        path="/signup/step-one"
        element={
          <AuthRoute>
            <SignupOne />
          </AuthRoute>
        }
      />
      <Route
        path="/signup/step-two"
        element={
          <AuthRoute>
            <SignupTwo />
          </AuthRoute>
        }
      />
      <Route
        path="/signup/success"
        element={
          <AuthRoute>
            <SignupSuccess />
          </AuthRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <AuthRoute>
            <ForgotPassword />
          </AuthRoute>
        }
      />
      <Route
        path="/set-otp"
        element={
          <AuthRoute>
            <SetOtp />
          </AuthRoute>
        }
      />
      <Route
        path="/set-password"
        element={
          <AuthRoute>
            <SetPassword />
          </AuthRoute>
        }
      />

      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
