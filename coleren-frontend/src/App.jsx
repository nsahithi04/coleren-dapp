import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "@/router/ProtectedRoute";
import AuthRoute from "@/router/AuthRoute";

import Login from "@/containers/login";
import Signup from "./containers/signup";
import SignupOne from "./containers/signupOne";
import SignupTwo from "./containers/signupTwo";
import Success from "./containers/success";
import ForgotPassword from "./containers/forgotPassword";
import SetPassword from "./containers/resetPassword";
import GettingStarted from "./containers/gettingStarted";
import Dashboard from "./containers/dashboard";
import Feedback from "./containers/feedback";
import Account from "./containers/account";
import Sequences from "./containers/sequences";
import AcceptInvite from "./containers/accept";
import Survey from "./containers/surveys";
import EmailTemplate from "./containers/emailTemplate";
import Connectors from "./containers/connectors";
import SurveyForm from "./containers/surveyForm";
import PublicSurveyForm from "./containers/public/form";

export default function App() {
  return (
    <Routes>
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
        path="/signup-one"
        element={
          <AuthRoute>
            <SignupOne />
          </AuthRoute>
        }
      />
      <Route
        path="/signup-two"
        element={
          <AuthRoute>
            <SignupTwo />
          </AuthRoute>
        }
      />
      <Route
        path="/success"
        element={
          <ProtectedRoute>
            <Success />
          </ProtectedRoute>
        }
      />
      <Route
        path="/gettingStarted"
        element={
          <ProtectedRoute>
            <GettingStarted />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/feedback"
        element={
          <ProtectedRoute>
            <Feedback />
          </ProtectedRoute>
        }
      />
      <Route path="/sequences/:type/:tab" element={<Sequences />} />
      <Route
        path="/sequences"
        element={<Navigate to="/sequences/salesRep/overview" />}
      />
      <Route
        path="/surveys/"
        element={
          <ProtectedRoute>
            <Survey />
          </ProtectedRoute>
        }
      />
      <Route
        path="/surveys/email"
        element={
          <ProtectedRoute>
            <EmailTemplate />
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

      <Route
        path="/connectors"
        element={
          <ProtectedRoute>
            <Connectors />
          </ProtectedRoute>
        }
      />
      <Route
        path="/accept-invite"
        element={
          <ProtectedRoute>
            <AcceptInvite />
          </ProtectedRoute>
        }
      />

      <Route
        path="/surveys/create"
        element={
          <ProtectedRoute>
            <SurveyForm />
          </ProtectedRoute>
        }
      />

      <Route path="/survey/:surveyId" element={<PublicSurveyForm />} />

      <Route path="/account" element={<Navigate to="/account/profile" />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route
        path="/set-password"
        element={
          <AuthRoute>
            <SetPassword />
          </AuthRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
