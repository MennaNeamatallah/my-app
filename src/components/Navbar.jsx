import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaHome, FaFileAlt, FaSignOutAlt, FaUser, FaUsers } from "react-icons/fa";
import "../styles/navbar.css";
import logo from "../assets/logo.png";

function Navbar() {

  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    setRole(localStorage.getItem("role"));
    setName(localStorage.getItem("name"));
  }, []);

  const isActive = (path) => {
    return location.pathname === path;
  };
  const goProfile = () => {
    if (role === "doctor") {
      navigate("/doctor/profile");
    } else {
      navigate("/patient/report"); // 🚨 المريض ممنوع من صفحة الدكتور
    }
  };

  return (
    <div className="navbar">

      <div className="nav-logo">
        <img src={logo} alt="logo" />
      </div>

      <div className="nav-links">

        {/* Profile */}
        <span
          className={
            role === "doctor"
              ? isActive("/doctor/profile")
                ? "active"
                : ""
              : "disabled"
          }
          onClick={role === "doctor" ? goProfile : undefined}
        >
          <FaUser /> {name || "مستخدم"}
        </span>



        {role === "doctor" && (
          <span
            className={isActive("/doctor/patients") ? "active" : ""}
            onClick={() => navigate("/doctor/patients")}
          >
            <FaUsers /> قائمة المرضى
          </span>
        )}

        <span
          className={
            isActive(
              role === "doctor"
                ? "/doctor/report"
                : "/patient/report"
            )
              ? "active"
              : ""
          }
          onClick={() =>
            navigate(
              role === "doctor"
                ? "/doctor/report"
                : "/patient/report"
            )
          }
        >
          <FaFileAlt /> التقرير
        </span>
        <span onClick={() => {
          localStorage.clear();
          navigate("/");
        }}>
          <FaSignOutAlt /> خروج
        </span>

      </div>
    </div>
  );
}

export default Navbar;