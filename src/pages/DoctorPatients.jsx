import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { FaUsers } from "react-icons/fa";
import "../styles/doctorPatients.css";
import { useEffect, useState } from "react";

const API = "https://shiftless-handgrip-mantis.ngrok-free.dev/api";

const translateDiagnosis = (value) => {
  const map = {
    r: "ر",
    s: "س",
    t: "ت",
    k: "ك",
    g: "ج",
    kh: "خ",
    gh: "غ",
  };

  return map[value?.toLowerCase()] || value || "-";
};

function DoctorPatients() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const doctorId = localStorage.getItem("doctor_id");

  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchPatients = async () => {
    if (!token || !doctorId) return;

    setLoading(true);

    try {
      const res = await fetch(
        `${API}/doctor/${doctorId}/patients-overview`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      const data = await res.json();

      if (data.status) {
        setPatients(data.data || []);
      } else {
        setPatients([]);
      }
    } catch (err) {
      console.log(err);
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [doctorId]);

  const handleOpenPatient = (patient) => {
    localStorage.setItem("patient_id", patient.patient_id);
    navigate("/doctor/report");
  };

  const filtered = patients.filter((p) =>
    (p.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">
      <Navbar page="patients" />

      <div className="container">
        <div className="table-box">

          <h2><FaUsers /> المرضى</h2>

          <div className="search-box">
            <button>🔍</button>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="اسم المريض"
            />
          </div>

          <table>
            <thead>
              <tr>
                <th>الاسم</th>
                <th>العمر</th>
                <th>لدغة</th>
                <th>المستوى</th>
                <th>آخر جلسة</th>

              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr><td colSpan="6">جاري التحميل...</td></tr>
              ) : filtered.length > 0 ? (
                filtered.map((p) => (
                  <tr key={p.patient_id} onClick={() => handleOpenPatient(p)}>
                    <td>{p.name}</td>
                    <td>{p.age}</td>
                    <td>{translateDiagnosis(p.speech_disorder)}</td>
                    <td>{p.level}</td>
                    <td>
                      {p.last_session_date
                        ? new Date(p.last_session_date).toLocaleDateString()
                        : "-"}
                    </td>

                  </tr>
                ))
              ) : (
                <tr><td colSpan="6">لا يوجد مرضى</td></tr>
              )}
            </tbody>

          </table>

        </div>
      </div>
    </div>
  );
}

export default DoctorPatients;