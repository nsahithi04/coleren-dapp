import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function AuthRoute({ children }) {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const isPendingOnboarding = useSelector(
    (state) => state.user.isPendingOnboarding,
  );

  if (isPendingOnboarding) return children;

  return isAuthenticated ? <Navigate to="/home" replace /> : children;
}
