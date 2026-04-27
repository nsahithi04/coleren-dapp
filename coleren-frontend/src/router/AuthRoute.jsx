import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

export default function AuthRoute({ children }) {
  const { isAuthenticated, isPendingOnboarding } = useSelector(
    (state) => state.user,
  );

  const location = useLocation();

  if (isAuthenticated) {
    if (isPendingOnboarding) {
      if (location.pathname !== "/signup-two") {
        return <Navigate to="/signup-two" replace />;
      }
      return children;
    }

    return <Navigate to="/success" replace />;
  }

  return children;
}
