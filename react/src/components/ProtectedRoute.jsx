import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/auth";
import PropTypes from "prop-types";

const ProtectedRoute = ({ children }) => {
  const { session } = useAuth();

  if (!session) {
    // user is not authenticated
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
