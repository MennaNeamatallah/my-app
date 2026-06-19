import { useNavigate } from "react-router-dom";
import "../styles/ResetPassword.css";
import reset1 from "../assets/Reset1.png";
import reset2 from "../assets/Reset2.png";
import { useState } from "react";

const API = "https://nutqiproject-production-5f8a.up.railway.app/api";

function ResetPassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleReset = async () => {
    const email = localStorage.getItem("resetEmail");
    const otp = localStorage.getItem("resetOtp");

    if (password !== confirmPassword) {
      alert("كلمة المرور غير متطابقة");
      return;
    }

    try {
      const res = await fetch(`${API}/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp,
          password,
          password_confirmation: confirmPassword,
        }),
      });

      if (!res.ok) throw new Error();

      localStorage.removeItem("resetEmail");
      localStorage.removeItem("resetOtp");

      navigate("/login");

    } catch (err) {
      alert("فشل تغيير كلمة المرور");
    }
  };

  return (
    <div className="reset-container">

      <div className="reset-content">

        <div className="reset-box">
          <h1>تعيين كلمة مرور جديدة</h1>

          <input
            type="password"
            placeholder="كلمة المرور الجديدة"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="تأكيد كلمة المرور"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button onClick={handleReset}>
            حفظ
          </button>

          <span onClick={() => navigate("/login")}>
            الرجوع لتسجيل الدخول
          </span>
        </div>

        {/* الصور */}
        <img src={reset1} className="img-right" />
        <img src={reset2} className="img-left" />

      </div>
    </div>
  );
}

export default ResetPassword;