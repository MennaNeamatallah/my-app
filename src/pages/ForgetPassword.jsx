import { useNavigate } from "react-router-dom";
import "../styles/ForgetPassword.css";
import forget1 from "../assets/forget1.png";
import forget2 from "../assets/forget2.png";
import forget3 from "../assets/forget3.png";
import { useState } from "react";

const API = "https://nutqiproject-production-5f8a.up.railway.app/api";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSend = async () => {
    try {
      const res = await fetch(`${API}/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error();

      localStorage.setItem("resetEmail", email);
      navigate("/verify");

    } catch (err) {
      alert("فشل إرسال الرمز");
    }
  };

  return (
    <div className="forgot-container">

      <div className="forgot-content">

        <div className="forgot-box">
          <h1>نسيت كلمة المرور؟</h1>

          <p>من فضلك ادخل بريدك اللإكتروني و سنرسل
            <br />لك كود لتعيين كلمة مرور جديدة
          </p>

          <div className="input-group">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label>ادخل البريد الإلكتروني </label>
          </div>

          <button onClick={handleSend}>
            إرسال الرمز
          </button>

          <span onClick={() => navigate("/login")}>
            الرجوع لتسجيل الدخول
          </span>
        </div>

        {/* الصور */}
        <img src={forget1} className="img-girl" />
        <img src={forget2} className="img-q" />
        <img src={forget3} className="img-side" />

      </div>
    </div>
  );
}

export default ForgotPassword;