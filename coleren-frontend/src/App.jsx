import { Routes, Route, Navigate } from "react-router-dom";

import Login from "@/containers/auth/login";
import Signup from "@/containers/auth/signup";
import SignupOne from "@/containers/auth/signupOne";
import SignupTwo from "@/containers/auth/signupTwo";
import SignupSuccess from "@/containers/auth/signupSuccess";
import ForgotPassword from "@/containers/auth/forgotPassword";
import SetOtp from "@/containers/auth/setotp";
import SetPassword from "@/containers/auth/setPassword";

import GettingStarted from "@/containers/gettingStarted";
import Dashboard from "@/containers/dashboard";
import Feedback from "@/containers/feedback";
import Account from "@/containers/account";
import Sequences from "@/containers/sequences";
import Surveys from "@/containers/surveys";
import Connectors from "@/containers/connectors";

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
        path="/GettingStarted"
        element={
          <ProtectedRoute>
            <GettingStarted />
          </ProtectedRoute>
        }
      />

      <Route
        path="/Dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/Feedback"
        element={
          <ProtectedRoute>
            <Feedback />
          </ProtectedRoute>
        }
      />

      <Route
        path="/account/:tab"
        element={
          <ProtectedRoute>
            <Account />
          </ProtectedRoute>
        }
      />

      <Route path="/account" element={<Navigate to="/account/profile" />} />

      <Route
        path="/sequences"
        element={
          <ProtectedRoute>
            <Sequences />
          </ProtectedRoute>
        }
      />

      <Route
        path="/sequences/:tab"
        element={
          <ProtectedRoute>
            <Sequences />
          </ProtectedRoute>
        }
      />

      <Route
        path="/surveys"
        element={
          <ProtectedRoute>
            <Surveys />
          </ProtectedRoute>
        }
      />
      <Route
        path="/connectors"
        element={
          <ProtectedRoute>
            <Connectors />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
