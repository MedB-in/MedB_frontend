import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Routes, Route } from "react-router-dom";
import useAuth from "./hooks/useAuth";
import { setAuthenticated } from "./redux/slices/authSlice";
import ProtectedRoutes from "./components/Atoms/ProtectedRoutes";
import LoginPage from "./pages/Login/LoginPage";
import ControlPanel from "./pages/ControlPanel/Index";
import Dashboard from "./pages/ControlPanel/DashBoard/DashBoardPage";
import ErrorPage from "./pages/404Page/ErrorPage";
import MenuManagementPage from "./pages/ControlPanel/MenuManagement/MenuManagementPage";
import ProductsPage from "./components/Organs/Products/Products";
import ClinicsPage from "./components/Organs/Clinics/Clinics";
import DoctorsPage from "./components/Organs/Doctors/Doctors";
import UserSubscriptionPage from "./components/Organs/UserSubscription/UserSubscription";

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
        <Route path="/" element={<ControlPanel />} >
          {/* Dashboard */}
          <Route index element={<Dashboard />} />
          {/* Menu details */}
          <Route path="menu-management" element={<MenuManagementPage />} />
          <Route path="products" element={< ProductsPage />} />
          <Route path="clinics" element={< ClinicsPage />} />
          <Route path="doctors" element={< DoctorsPage />} />
          <Route path="subscriptions" element={< UserSubscriptionPage />} />
        </Route>
      </Route>

      {/* 404 page */}
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
};

export default App;