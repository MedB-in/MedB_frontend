import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoutes = ({ sessionChecked }) => {
  const { authenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!sessionChecked) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Checking session...
      </div>
    );
  }

  return authenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location.pathname }} replace />
  );
};

export default ProtectedRoutes;
