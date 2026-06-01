
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Marketing from "./pages/Marketing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgetPassword";
import VerifyCode from "./pages/VerifyCode";
import ResetPassword from "./pages/ResetPassword";
import DoctorPatients from "./pages/DoctorPatients";
import PatientReportDoc from "./pages/PatientReportDoc";
import PatientReportPat from "./pages/PatientReportPat";
import DoctorProfile from "./pages/DoctorProfile";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Marketing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/verify" element={<VerifyCode />} />
        <Route path="/reset" element={<ResetPassword />} />
        <Route path="/doctor/patients" element={<DoctorPatients />} />
        <Route path="/doctor/profile" element={<DoctorProfile />} />

        <Route path="/doctor/report" element={<PatientReportDoc />} />
        <Route path="/patient/report" element={<PatientReportPat />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;