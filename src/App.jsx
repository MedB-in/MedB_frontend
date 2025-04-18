import { setAuthenticated } from "./redux/slices/authSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Routes } from "react-router-dom";
import ProtectedRoutes from "./components/Atoms/ProtectedRoutes";
import useAuth from "./hooks/useAuth";
import * as PublicPages from "./pages/PublicPages/index";
import * as Clinics from "./pages/ControlPanel/Clinics";
import * as Appointments from "./pages/ControlPanel/Appointments";
import * as Patients from "./pages/ControlPanel/Patients";
import * as Users from "./pages/ControlPanel/Users";
import * as DoctorsPage from "./pages/ControlPanel/Doctors";
import Dashboard from "./pages/ControlPanel/DashBoard/DashBoardPage";
import ControlPanel from "./pages/ControlPanel/Index";
import MenuManagementPage from "./pages/ControlPanel/MenuManagement/MenuManagementPage";
import ProductsPage from "./pages/ControlPanel/Products/ProductsPage";
import UserSubscriptionPage from "./pages/ControlPanel/UserSubscription/UserSubscriptionPage";
import LoginPage from "./pages/Login/LoginPage";
import RegisterPage from "./pages/Register/RegisterPage";
import VerificationPage from "./pages/Verification/VerificationPage";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ErrorPage from "./pages/404Page/ErrorPage";


const App = () => {
  const { isAuthenticated } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setAuthenticated(isAuthenticated()));
  }, [isAuthenticated, dispatch]);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/home" element={<PublicPages.LandingPage />} />
      <Route path="/find-doctor-clinic" element={<PublicPages.FindDoctorClinicPage />} />
      <Route path="/find-doctor" element={<PublicPages.DoctorSearchPage />} />
      <Route path="/doctor-profile" element={<PublicPages.DoctorProfilePage />} />
      <Route path="/doctor-clinic" element={<PublicPages.DoctorClinicPage />} />
      <Route path="/for-doctor" element={<PublicPages.ForDoctorPage />} />
      <Route path="/for-clinic" element={<PublicPages.ForDoctorPage />} />
      <Route path="/register-clinic" element={<PublicPages.ClinicRegistrationPage />} />
      <Route path="/registration-status/:registrationId" element={<PublicPages.ClinicRegistrationStatusPage />} />


      {/* Login page */}
      <Route path="/login" element={<LoginPage />} />
      {/* Register page */}
      <Route path="/register" element={<RegisterPage />} />
      {/* Verification page */}
      <Route path="/verify-email" element={<VerificationPage />} />
      {/* Forgot password page */}
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoutes />}>
        <Route path="/" element={<ControlPanel />} >
          {/* Dashboard */}
          <Route index element={<Dashboard />} />

          {/* Clinics */}
          <Route path="clinics">
            <Route index element={<Clinics.ClinicsPage />} />
            <Route path="overview" element={<Clinics.Overview />} />
            <Route path=":clinicId" element={<Clinics.ClinicDetails />} />
            <Route path="slots/:clinicId/:doctorId" element={<Clinics.ClinicSlot />} />
            <Route path="users/:clinicId" element={<Clinics.ClinicUsers />} />
            <Route path="clinic-profile" element={<Clinics.ClinicProfile />} />
            <Route path="clinic-registrations" element={<Clinics.ClinicRegistrations />} />
          </Route>

          {/* Appointments */}
          <Route path="appointments">
            <Route index element={<Appointments.PatientAppointmentsPage />} />
            <Route path="book-appointment" element={<Appointments.BookFromClinic />} />
            <Route path="appointments-management" element={<Clinics.AppointmentsManagement />} />
            <Route path="book-appointment/:clinicId" element={<Appointments.DoctorSelection />} />
            <Route path="book-slots/:clinicId/:doctorId" element={<Appointments.BookSlots />} />
          </Route>

          {/* Patients */}
          <Route path="patients">
            <Route index element={<Patients.PatientManagementPage />} />
            <Route path="prescriptions/:patientId/:doctorId/:clinicId/:appointmentId/:appointmentDate" element={<Patients.Prescriptions />} />
          </Route>

          {/* User profile */}
          <Route path="users">
            <Route path="user-profile" element={< Users.UserProfilePage />} />
            <Route path="user-rights" element={<Users.UserRightsPage />} />
            <Route path="manage-user-rights" element={<Users.ManageUserRightsPage />} />
          </Route>

          {/* Menu details */}
          <Route path="menu-management" element={<MenuManagementPage />} />

          {/* Products */}
          <Route path="products" element={< ProductsPage />} />

          {/* Doctors */}
          <Route path="doctors" >
            <Route index element={< DoctorsPage.DoctorsPage />} />
            <Route path="leave-management/:doctorId/:clinicId" element={<DoctorsPage.MangeDoctorPage />} />
            <Route path="manage-consultation" element={<DoctorsPage.ManageConsultation />} />
          </Route>

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