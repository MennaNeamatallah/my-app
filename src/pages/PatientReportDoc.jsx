import Navbar from "../components/Navbar";
import { FaEdit, FaStickyNote } from "react-icons/fa";
import "../styles/patientReport.css";
import { useState, useEffect } from "react";

const API = "https://shiftless-handgrip-mantis.ngrok-free.dev/api";
const BASE = "https://shiftless-handgrip-mantis.ngrok-free.dev";

function PatientReport() {
  const role = localStorage.getItem("role");
  const isDoctor = role === "doctor";

  const token = localStorage.getItem("token");
  const patientId = localStorage.getItem("patient_id");

  const [session, setSession] = useState(null);
  const [patient, setPatient] = useState(null); // 👈 جديد
  const [stats, setStats] = useState(null);
  const [records, setRecords] = useState([]);
  const [doctorNote, setDoctorNote] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);

  const formatDate = (date) => {
    if (!date) return "-";
    const d = new Date(date);
    if (isNaN(d)) return "-";
    return d.toLocaleDateString("en-GB");
  };

  // ======================
  // FETCH SESSIONS
  // ======================
  const fetchPatientSessions = async () => {
    if (!token || !patientId) return;

    try {
      const res = await fetch(
        `${API}/doctor/patients/${patientId}/sessions`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      const data = await res.json();

      console.log("PATIENT SESSIONS:", data);

      if (data.status && data.data?.length > 0) {

        // 👇 حفظ بيانات المريض
        setPatient(data.patient);

        const allRecords = data.data.flatMap((s) =>
          (s.records || []).map((r) => ({
            ...r,
            sessionInfo: s,
          }))
        );

        setRecords(allRecords);


      } else {
        setRecords([]);
      }
    } catch (err) {
      console.log("FETCH ERROR:", err);
    }
  };

  // ======================
  // GET FEEDBACK
  // ======================
  const fetchFeedbacks = async (sessionId) => {
    try {
      const res = await fetch(`${API}/patient/sessions/${sessionId}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      });

      const data = await res.json();

      console.log("FEEDBACKS:", data);

      if (res.ok && data.status) {
        setFeedbacks(data.data?.doctor_feedback ? [data.data] : []);
      } else {
        setFeedbacks([]);
      }
    } catch (err) {
      console.log("GET FEEDBACK ERROR:", err);
      setFeedbacks([]);
    }
  };

  useEffect(() => {
    fetchPatientSessions();
  }, []);

  // ======================
  // SEND FEEDBACK
  // ======================
  const sendFeedback = async () => {
    if (!doctorNote.trim()) {
      alert("اكتبي الملاحظة الأول");
      return;
    }

    // 👇 fix
    const sessionId = session?.session?.id || session?.id;

    if (!sessionId) {
      alert("لا توجد جلسة");
      return;
    }

    try {
      const res = await fetch(
        `${API}/sessions/${sessionId}/doctor-feedback`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify({
            doctor_feedback: doctorNote,
          }),
        }
      );

      const data = await res.json();

      console.log("SEND FEEDBACK:", data);

      if (res.ok) {
        alert("تم إرسال الملاحظة بنجاح");
        setDoctorNote("");

        fetchFeedbacks(sessionId);
      } else {
        alert(data.message || "فشل إرسال الملاحظة");
      }
    } catch (err) {
      console.log("REQUEST ERROR:", err);
      alert("مشكلة في الاتصال بالسيرفر");
    }
  };

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

  return (
    <div className="page">
      <Navbar page="report" />

      <div className="container">

        <div className="table-box">
          <h>الجلسات</h>

          <table>
            <thead>
              <tr>
                <th>التاريخ</th>
                <th>المستوى</th>
                <th>لدغة</th>
                <th>صحيح</th>
                <th>دقة النطق</th>
                <th>الصوت</th>
              </tr>
            </thead>

            <tbody>
              {records.length ? (
                records.map((r) => (
                  <tr key={r.id}>
                    <td>
                      {formatDate(r.sessionInfo?.created_at)}
                    </td>

                    <td>
                      {r.sessionInfo?.level || "-"}
                    </td>
                    <td>
                      {translateDiagnosis(patient?.speech_disorder)}
                    </td>

                    <td>{r.is_correct ? "✔" : "✖"}</td>

                    <td>
                      {r.accuracy_score != null
                        ? Number(r.accuracy_score).toFixed(2) + "%"
                        : "-"}
                    </td>

                    <td>
                      {r.file_url ? (
                        <audio
                          controls
                          preload="none"
                          src={
                            r.file_url.startsWith("http")
                              ? r.file_url.replace("http://", "https://")
                              : `${BASE}/${r.file_url.replace(/^\/+/, "")}`
                          }
                        />
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">لا توجد بيانات</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

export default PatientReport;