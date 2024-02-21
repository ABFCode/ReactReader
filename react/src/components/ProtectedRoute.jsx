import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/auth";
import PropTypes from "prop-types";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    // user is not authenticated
    return <Navigate to="/" />;
  }
  return <>{children}</>;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
