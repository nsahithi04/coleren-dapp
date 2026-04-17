import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function AuthRoute({ children }) {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const isPendingOnboarding = useSelector(
    (state) => state.user.isPendingOnboarding,
  );

  if (!isAuthenticated) return children;
  if (isPendingOnboarding) return children;

  return <Navigate to="/GettingStarted" replace />;
}
