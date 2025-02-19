import { setAuthenticated } from "./redux/slices/authSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Routes } from "react-router-dom";
import ProtectedRoutes from "./components/Atoms/ProtectedRoutes";
import useAuth from "./hooks/useAuth";
import ErrorPage from "./pages/404Page/ErrorPage";
import * as Clinics from "./pages/ControlPanel/Clinics";
import Dashboard from "./pages/ControlPanel/DashBoard/DashBoardPage";
import DoctorsPage from "./pages/ControlPanel/Doctors/DoctorsPage";
import ControlPanel from "./pages/ControlPanel/Index";
import MenuManagementPage from "./pages/ControlPanel/MenuManagement/MenuManagementPage";
import ProductsPage from "./pages/ControlPanel/Products/ProductsPage";
import UserSubscriptionPage from "./pages/ControlPanel/UserSubscription/UserSubscriptionPage";
import LoginPage from "./pages/Login/LoginPage";
import RegisterPage from "./pages/Register/RegisterPage";
import VerificationPage from "./pages/Verification/VerificationPage";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import UserProfilePage from "./pages/ControlPanel/UserProfile/UserProfilePage";

const App = () => {
  const { isAuthenticated } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setAuthenticated(isAuthenticated()));
  }, [isAuthenticated, dispatch]);

  return (
    <Routes>

      {/* Public routes */}
      {/* Login page */}
      <Route path="/login" element={<LoginPage />} />
      {/* Register page */}
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-email" element={<VerificationPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      {/* Public routes */}


      {/* Protected routes */}
      <Route element={<ProtectedRoutes />}>
        <Route path="/" element={<ControlPanel />} >
          {/* Dashboard */}
          <Route index element={<Dashboard />} />

          {/* User profile */}
          <Route path="user-profile" element={<UserProfilePage />} />

          {/* Menu details */}
          <Route path="menu-management" element={<MenuManagementPage />} />

          {/* Products */}
          <Route path="products" element={< ProductsPage />} />

          {/* Clinics */}
          <Route path="clinics">
            <Route index element={<Clinics.ClinicsPage />} />
            <Route path=":clinicId" element={<Clinics.ClinicDetails />} />
            <Route path="slots/:clinicId/:doctorId" element={<Clinics.ClinicSlot />} />
          </Route>

          {/* Doctors */}
          <Route path="doctors" element={< DoctorsPage />} />

          {/* Subscriptions */}
          <Route path="subscriptions" element={< UserSubscriptionPage />} />
        </Route>
      </Route>

      {/* 404 page */}
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
};

export default App;