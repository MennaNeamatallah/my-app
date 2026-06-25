import "../styles/login.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logo.png";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const BASE_URL = "https://nutqiproject-production-5f8a.up.railway.app/api";

  const handleLogin = async () => {
    if (!email || !password) {
      alert("املأ البيانات");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.token) {
        alert(data.message || "Login failed");
        return;
      }

      // ✅ auth
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("name", data.user.name);
      localStorage.setItem("user_id", data.user.id);

      if (data.user.role === "doctor") {
        localStorage.setItem("doctor_id", data.doctor_id);
        navigate("/doctor/patients");
      } else {
        localStorage.setItem("patient_id", data.user_id);
        navigate("/patient/report");
      }

    } catch (err) {
      console.log(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="logo">
        <img src={logo} alt="logo" />
      </div>

      <div className="login-box">
        <h3>تسجيل الدخول</h3>

        <div className="input-group">
          <input onChange={(e) => setEmail(e.target.value)} />
          <label>البريد الإلكتروني</label>
        </div>

        <div className="input-group">
          <input type="password" onChange={(e) => setPassword(e.target.value)} />
          <label>كلمة المرور</label>
        </div>

        <span onClick={() => navigate("/forgot")}>
          <p className="forgot">هل نسيت كلمة المرور؟</p>
        </span>

        <button className="login-btn" onClick={handleLogin} disabled={loading}>
          {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
        </button>


        <p className="signup-text">
          ليس لديك حساب؟{" "}
          <span onClick={() => navigate("/register")}>
            إنشاء حساب
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;