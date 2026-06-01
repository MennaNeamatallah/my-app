import Navbar from "../components/Navbar";
import "../styles/DoctorProfile.css";
import profile from "../assets/profile.png";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "https://shiftless-handgrip-mantis.ngrok-free.dev/api";

function DoctorProfile() {

  const navigate = useNavigate();

  const [doctor, setDoctor] = useState({
    name: "",
    age: "",
    specialization: "",
    experience: ""
  });

  useEffect(() => {

    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    // 🔒 منع غير الدكتور
    if (role !== "doctor") {
      navigate("/patient/report");
      return;
    }

    if (!token) {
      alert("Missing auth data");
      return;
    }

    const fetchDoctorProfile = async () => {
      try {

        const res = await fetch(`${API}/doctor/profile`, {
          method: "PUT", // حسب الباك عندك
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({})
        });

        console.log("STATUS:", res.status);

        const data = await res.json();
        console.log("API RESPONSE:", data);

        const info = data?.data || {};

        setDoctor({
          name: info.name || localStorage.getItem("name") || "",
          age: info.age || "",
          specialization: info.specialization || "",
          experience: info.experience_years || ""
        });

      } catch (err) {
        console.log("ERROR:", err);
        alert("فشل تحميل بيانات الدكتور");
      }
    };

    fetchDoctorProfile();

  }, []);

  // 🔥 تحديث البيانات
  const handleUpdate = async () => {
    try {

      const token = localStorage.getItem("token");

      const res = await fetch(`${API}/doctor/profile`, {
        method: "PUT",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          age: doctor.age,
          specialization: doctor.specialization,
          experience_years: doctor.experience
        })
      });

      const data = await res.json();
      console.log("UPDATE RESPONSE:", data);

      if (data.status) {
        alert("تم التحديث بنجاح ✅");
      } else {
        alert(data.message || "فشل التحديث");
      }

    } catch (err) {
      console.log("ERROR UPDATE:", err);
      alert("خطأ في الاتصال (CORS لازم يتحل من الباك)");
    }
  };

  return (
    <div className="page">

      <Navbar page="profile" />

      <div className="profile-wrapper">

        <div className="card-pro">

          {/* الاسم */}
          <input
            placeholder="الاسم"
            value={doctor.name || localStorage.getItem("name") || ""}
            readOnly
          />

          {/* العمر */}
          <input
            placeholder="العمر"
            value={doctor.age || ""}
            onChange={(e) =>
              setDoctor({ ...doctor, age: e.target.value })
            }
          />

          {/* التخصص */}
          <input
            placeholder="التخصص"
            value={doctor.specialization || ""}
            onChange={(e) =>
              setDoctor({ ...doctor, specialization: e.target.value })
            }
          />

          {/* الخبرة */}
          <input
            placeholder="سنين الخبرة"
            value={doctor.experience || ""}
            onChange={(e) =>
              setDoctor({ ...doctor, experience: e.target.value })
            }
          />

          <button className="btn" onClick={handleUpdate}>
            تعديل
          </button>

        </div>

        <div className="img">
          <img src={profile} alt="profile" />
        </div>

      </div>
    </div>
  );
}

export default DoctorProfile;