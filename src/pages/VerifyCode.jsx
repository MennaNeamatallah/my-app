import { useNavigate } from "react-router-dom";
import "../styles/VerifyCode.css";
import verify1 from "../assets/Verify1.png";
import verify2 from "../assets/Verify2.png";
import verify3 from "../assets/Verify3.png";
import verify4 from "../assets/Verify4.png";
import { useState } from "react";

const API = "https://nutqiproject-production-5f8a.up.railway.app/api";

function VerifyCode() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const handleChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  const handleVerify = async () => {
    const code = otp.join("");
    const email = localStorage.getItem("resetEmail");

    try {
      const res = await fetch(`${API}/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp: code,
        }),
      });

      if (!res.ok) throw new Error();

      localStorage.setItem("resetOtp", code);
      navigate("/reset");

    } catch (err) {
      alert("كود غير صحيح");
    }
  };

  return (
    <div className="verify-container">

      <div className="verify-content">

        <div className="verify-box">
          <h1>تأكيد الرمز</h1>

          <p>
            تم ارسال رمز التحقق الي بريدك الإلكتروني
            <br /> .من فضلك أدخله
          </p>

          <div className="code-inputs">
            {otp.map((digit, i) => (
              <input
                key={i}
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e.target.value, i)}
              />
            ))}
          </div>

          <button onClick={handleVerify}>
            تأكيد
          </button>

          <p className="reset-code">
            لم يصلك الرمز بعد ؟{" "}
            <span>إعادة إرسال</span>
          </p>

        </div>

        {/* الصور */}
        <img src={verify1} className="img-phone" />
        <img src={verify2} className="img-code" />
        <img src={verify3} className="img-mail" />
        <img src={verify4} className="img-left" />

      </div>
    </div>
  );
}

export default VerifyCode;