import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated, getRole, getUser } from "../utils/auth";

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const location = useLocation();
  const path = location.pathname;

  // 1️⃣ NOT LOGGED IN → LOGIN
  if (!isAuthenticated()) return <Navigate to="/login" replace />;

  const user = getUser();
  const role = getRole();

  // 2️⃣ ADMIN CHECK
  if (requiredRole === "Admin" && role !== "Admin") {
    return <Navigate to="/app/dashboard" replace />;
  }

  // 3️⃣ CUSTOMER & NOT ONBOARDING COMPLETE
  const onboardingPage = "/onboarding-wizard";
  if (role === "Customer" && user?.isOnboardingComplete === false) {
    // Allow onboarding route
    if (path !== onboardingPage) {
      return <Navigate to={onboardingPage} replace />;
    }
  }

  if (role === "Customer" && user?.isOnboardingComplete === false) {
  if (path !== "/onboarding-wizard") return <Navigate to="/onboarding-wizard" replace />;
}


  // 4️⃣ SUCCESS → ALLOW ROUTE
  return children;
};

export default ProtectedRoute;
