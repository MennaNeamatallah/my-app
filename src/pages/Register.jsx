import "../styles/Register.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import logo from "../assets/logo.png";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");

  const navigate = useNavigate();

  const BASE_URL = "https://shiftless-handgrip-mantis.ngrok-free.dev/api";

  const handleRegister = async () => {
    try {
      console.log("REGISTER CLICKED 🔥");

      if (!name || !email || !password || !password_confirmation) {
        alert("من فضلك املأ كل البيانات");
        return;
      }

      const res = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          password_confirmation,
          role: "doctor",
        }),
      });

      const text = await res.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.log("❌ response مش JSON:", text);
        alert("السيرفر مش شغال صح");
        return;
      }

      if (!res.ok) {
        alert(data.message || "Register failed");
        return;
      }

      alert("تم إنشاء الحساب 🎉");
      navigate("/login");

    } catch (err) {
      console.log(err);
      alert("مشكلة في الاتصال بالسيرفر");
    }
  };

  return (
    <div className="register-container">

      <div className="logo">
        <img src={logo} alt="logo" />
      </div>

      <div className="register-box">

        <h3>إنشاء حساب الدكتور</h3>

        <div className="input-group">
          <input onChange={(e) => setName(e.target.value)} />
          <label>الاسم</label>
        </div>

        <div className="input-group">
          <input onChange={(e) => setEmail(e.target.value)} />
          <label>البريد الإلكتروني</label>
        </div>

        <div className="input-group">
          <input type="password" onChange={(e) => setPassword(e.target.value)} />
          <label>كلمة المرور</label>
        </div>

        <div className="input-group">
          <input type="password" onChange={(e) => setPasswordConfirmation(e.target.value)} />
          <label>تأكيد كلمة المرور</label>
        </div>

        <button className="register-btn" onClick={handleRegister}>
          إنشاء حساب
        </button>

        <p className="login-link"> تمتلك حساب؟{" "} <span onClick={() => navigate("/login")} className="link" > تسجيل الدخول </span>
        </p>
      </div>
    </div>
  );
}

export default Register;