import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ child }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return child;
};

export default ProtectedRoute;