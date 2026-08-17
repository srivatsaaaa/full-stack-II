import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles, user }) {
  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export default ProtectedRoute;
