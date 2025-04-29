import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoutes = () => {
  const { authenticated } = useSelector((state) => state.auth);
  const location = useLocation();
  return authenticated ? (
    <Outlet />
  ) : (
    <Navigate to={"/home"} state={{ from: location.pathname }} replace={true} />
  );
}

export default ProtectedRoutes;
