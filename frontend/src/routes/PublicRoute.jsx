import { Navigate } from 'react-router-dom';
import { isAuthenticated, getRole } from '../utils/auth';

const PublicRoute = ({ children }) => {
  if (isAuthenticated()) {
    const role = getRole();
    // Redirect to appropriate dashboard based on role
    if (role === 'Admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/app/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;




