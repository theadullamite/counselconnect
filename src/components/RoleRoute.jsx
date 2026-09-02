import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RoleRoute({ children, allowedRole }) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!profile) {
    return <p>Loading profile...</p>;
  }

  if (profile.role !== allowedRole) {
    if (profile.role === "client") {
      return <Navigate to="/client-dashboard" replace />;
    }

    if (profile.role === "counsellor") {
      return <Navigate to="/counsellor-dashboard" replace />;
    }

    return <Navigate to="/" replace />;
  }

  return children;
}

export default RoleRoute;