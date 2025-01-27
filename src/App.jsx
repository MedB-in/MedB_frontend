import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Routes, Route } from "react-router-dom";
import useAuth from "./hooks/useAuth";
import { setAuthenticated } from "./redux/slices/authSlice";
import ProtectedRoutes from "./components/Atoms/ProtectedRoutes";
import LoginPage from "./pages/Login/LoginPage";
import Dashboard from "./pages/DashBoard/DashBoardPage";
import ErrorPage from "./pages/404Page/ErrorPage";

const App = () => {
  const { isAuthenticated } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setAuthenticated(isAuthenticated()));
  }, [isAuthenticated, dispatch]);

  return (
    <Routes>
      {/* Login page */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoutes />}>
        <Route path="/" element={<Dashboard />} />
      </Route>

      {/* 404 page */}
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
};

export default App;
