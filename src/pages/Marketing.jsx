import logo from "../assets/logo.png";
import img1 from "../assets/marketing1.png";
import img2 from "../assets/marketing2.png";
import { FaMicrophone, FaChartLine, FaUserMd } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../styles/marketing.css";

function Marketing() {
  const navigate = useNavigate();

  return (
    <div className="marketing-container">
      {/* اللوجو */}
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>

      {/* الجزء الأول */}
      <div className="marketing-box">
        {/* النص */}
        <div className="text">
          <h2>نطق أفضل ..... خطوة بخطوة</h2>
          <p>
          تطبيق ذكي يساعد الأطفال علي تحسين النطق من 
          <br />
          خلال تمارين تفاعيلية , تسجيل للصوت , ومتابعة
          <br />
          مستمرة من أخصائي تخاطب .
          </p>

          <button onClick={() => navigate("/login")}>
            ابدأ رحلة النطق الصحيح
          </button>
        </div>

        {/* الصورة */}
        <div className="right-side">
          <img src={img1} alt="صورة" className="top-image" />
        </div>
      </div>

      {/* العنوان اللي فوق المربعات */}
      <div className="features-title">
        سجل النطق، تابع التقدم، تقييم من المختصين
      </div>

      {/* المربعات */}
      <div className="features">
        <div className="card">
          <div className="icon-wrapper">
           <FaMicrophone className="icon" />
          </div>
          
          <h2>سجل النطق</h2>
          <p>مرونة و سهولة في تسجيل نطق الطفل في أي وقت وأي مكان</p>
        </div>

        <div className="card">
          <div className="icon-wrapper">
           <FaChartLine className="icon" />
          </div>
          <h2>تابع التقدم</h2>
          <p>تقارير بسيطة وواضحة توضح تطور النطق خطوة بخطوة</p>
        </div>

        <div className="card">
          <div className="icon-wrapper">
           <FaUserMd className="icon" />
          </div>
          
          <h2>تقييم المختصين</h2>
          <p>متابعة من اخصائيين تخاطب لمراجعة الأداء و توجيه العلاج</p>
        </div>
      </div>

      {/* الجزء اللي تحت */}
      <div className="bottom-section">
        <div className="bottom-text">
         <p>مع نطقي العلاج أسهل والتقدم</p>
          <br />
        <span> أوضح والطفل أكثر ثقة</span>
        </div>

        <img src={img2} alt="صورة" className="bottom-image" />
      </div>
    </div>
  );
}

export default Marketing;