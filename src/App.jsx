import { setAuthenticated } from "./redux/slices/authSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Route, Routes } from "react-router-dom";
import ProtectedRoutes from "./components/Atoms/ProtectedRoutes";
import * as PublicPages from "./pages/PublicPages/index";
import * as Clinics from "./pages/ControlPanel/Clinics";
import * as Appointments from "./pages/ControlPanel/Appointments";
import * as Patients from "./pages/ControlPanel/Patients";
import * as Users from "./pages/ControlPanel/Users";
import * as DoctorsPage from "./pages/ControlPanel/Doctors";
import AppLogs from "./pages/ControlPanel/AppLogs/AppLogs";
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
import EnquiriesPage from "./pages/ControlPanel/Enquiries/EnquiriesPage";
import { NavigationProvider } from "./utils/Navigation";
import { checkSession } from "./services/user";

const App = () => {
  const dispatch = useDispatch();
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    const checkAuthOnStart = async () => {
      const userDetails = localStorage.getItem("userDetails");
      const accessToken = localStorage.getItem("accessToken");

      if (userDetails && accessToken) {
        dispatch(setAuthenticated(true));
        setSessionChecked(true);
        return;
      }

      if (userDetails && !accessToken) {
        try {
          await checkSession();
          dispatch(setAuthenticated(true));
        } catch (err) {
          console.error("Initial auth check failed", err);
        }
      }

      setSessionChecked(true);
    };

    checkAuthOnStart();
  }, [dispatch]);

  return (
    <NavigationProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<PublicPages.LandingPage />} />
        <Route path="/find-doctor-clinic" element={<PublicPages.FindDoctorClinicPage />} />
        <Route path="/find-doctor" element={<PublicPages.DoctorSearchPage />} />
        <Route path="/doctor-profile" element={<PublicPages.DoctorProfilePage />} />
        <Route path="/doctor-clinic" element={<PublicPages.DoctorClinicPage />} />
        <Route path="/for-doctor" element={<PublicPages.ForDoctorPage />} />
        <Route path="/for-clinic" element={<PublicPages.ForDoctorPage />} />
        <Route path="/for-labs" element={<PublicPages.ForLabsPage />} />
        <Route path="/register-clinic" element={<PublicPages.ClinicRegistrationPage />} />
        <Route path="/register-clinic/:registrationId" element={<PublicPages.ClinicRegistrationPage />} />
        <Route path="/register-doctor" element={<PublicPages.DoctorRegistrationPage />} />
        <Route path="/registration-status/:registrationId" element={<PublicPages.ClinicRegistrationStatusPage />} />
        <Route path="/about-us" element={<PublicPages.AboutUsPage />} />
        <Route path="/privacy-policy" element={<PublicPages.PrivacyPolicyPage />} />
        <Route path="/terms-and-conditions" element={<PublicPages.TermsAndConditionsPage />} />

        {/* Login page */}
        <Route path="/login" element={<LoginPage />} />
        {/* Login troubleshoot */}
        <Route path="/login-troubleshooting" element={<PublicPages.LoginTroubleshoot />} />
        {/* Register page */}
        <Route path="/register" element={<RegisterPage />} />
        {/* Verification page */}
        <Route path="/verify-email" element={<VerificationPage />} />
        {/* Forgot password page */}
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoutes sessionChecked={sessionChecked} />}>
          <Route path="/app" element={<ControlPanel />} >
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
              <Route path="leave-management/:doctorId/:clinicId" element={<DoctorsPage.MangeDoctorPage />} />
              <Route path="fee-management" element={<Clinics.FeeManagement />} />
              <Route path="clinicUserMenus" element={<Clinics.ClinicUserMenus />} />
              <Route path="clinicUserAddRights/:clinicId" element={<EnquiriesPage />} />
              <Route path="reports" element={<Clinics.Reports />} />
            </Route>

            {/* Appointments */}
            <Route path="appointments">
              <Route index element={<DoctorsPage.DoctorAppointmentsPage />} />
              <Route path="my-appointments" element={<Appointments.PatientAppointmentsPage />} />
              <Route path="book-appointment" element={<Appointments.BookFromClinic />} />
              <Route path="appointments-management" element={<Clinics.AppointmentsManagement />} />
              <Route path="book-appointment/:clinicId" element={<Appointments.DoctorSelection />} />
              <Route path="book-slots/:clinicId/:doctorId" element={<Appointments.BookSlots />} />
            </Route>

            {/* Patients */}
            <Route path="patients">
              <Route index element={<Patients.PatientManagementPage />} />
              <Route path="prescriptions/:patientId/:doctorId/:clinicId/:appointmentId/:appointmentDate/:appointmentStatus" element={<Patients.Prescriptions />} />
              <Route path="prescriptions-new/:patientId/:doctorId/:clinicId/:appointmentId/:appointmentDate/:appointmentStatus" element={<Patients.PrescriptionPage />} />
              <Route path="records" element={<Patients.PatientPrescription />} />
            </Route>

            {/* User profile */}
            <Route path="users">
              <Route path="user-profile" element={< Users.UserProfilePage />} />
              <Route path="user-rights" element={<Users.UserRightsPage />} />
              <Route path="manage-user-rights" element={<Users.ManageUserRightsPage />} />
              <Route path="manage-user-rights/:clinicId" element={<Users.ManageUserRightsPage />} />
            </Route>

            {/* Menu details */}
            <Route path="menu-management" element={<MenuManagementPage />} />

            {/* App logs */}
            <Route path="app-logs" element={<AppLogs />} />

            {/* Products */}
            <Route path="products" element={< ProductsPage />} />

            {/* Doctors */}
            <Route path="doctors" >
              <Route index element={< DoctorsPage.DoctorsPage />} />
              <Route path="leave-management/:doctorId/:clinicId" element={<DoctorsPage.MangeDoctorPage />} />
              <Route path="manage-consultation" element={<DoctorsPage.ManageConsultation />} />
              <Route path="overview" element={<DoctorsPage.Overview />} />
            </Route>

            {/* Subscriptions */}
            <Route path="subscriptions" element={< UserSubscriptionPage />} />

            {/* Enquiries */}
            <Route path="enquiries" element={< EnquiriesPage />} />
          </Route>
        </Route>

        {/* 404 page */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </NavigationProvider>
  );
};

export default App;