import Navbar from "../components/Navbar";
import { FaStickyNote } from "react-icons/fa";
import "../styles/patientReport.css";
import { useState, useEffect } from "react";

const API = "https://shiftless-handgrip-mantis.ngrok-free.dev/api";
const BASE = "https://shiftless-handgrip-mantis.ngrok-free.dev";

function PatientReport() {
    const token = localStorage.getItem("token");

    const [session, setSession] = useState(null);
    const [patient, setPatient] = useState(null);
    const [records, setRecords] = useState([]);
    const [doctorFeedback, setDoctorFeedback] = useState("");

    const formatDate = (date) => {
        if (!date) return "-";
        const d = new Date(date);
        if (isNaN(d)) return "-";
        return d.toLocaleDateString("en-GB");
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

    // ======================
    // PATIENT SESSIONS
    // ======================
    const fetchPatientSessions = async () => {
        if (!token) return;

        try {
            const res = await fetch(`${API}/patient/sessions`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                    "ngrok-skip-browser-warning": "true",
                },
            });

            const data = await res.json();

            if (data.status && data.data?.length > 0) {
                setPatient(data.patient);

                const sessionWithRecords =
                    data.data.find((s) => s.records?.length > 0) ||
                    data.data[0];

                setSession(sessionWithRecords);
                setRecords(sessionWithRecords.records || []);

                fetchSingleSession(sessionWithRecords.session.id);
            } else {
                setSession(null);
                setRecords([]);
            }
        } catch (err) {
            console.log("FETCH ERROR:", err);
        }
    };

    // ======================
    // SINGLE SESSION
    // ======================
    const fetchSingleSession = async (sessionId) => {
        if (!sessionId || !token) return;

        try {
            const res = await fetch(`${API}/patient/sessions/${sessionId}`, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                    "ngrok-skip-browser-warning": "true",
                },
            });

            const data = await res.json();

            if (data.status && data.data) {
                setDoctorFeedback(data.data.session?.doctor_feedback || "");
            }
        } catch (err) {
            console.log("FEEDBACK ERROR:", err);
        }
    };

    useEffect(() => {
        fetchPatientSessions();
    }, []);

    return (
        <div className="page">
            <Navbar page="report" />

            <div className="container">

                <div className="table-box">
                    <h3>الجلسات</h3>

                    <table>
                        <thead>
                            <tr>
                                <th>التاريخ</th>
                                <th>المستوى</th>
                                <th>لدغة</th>
                                <th>صحيح</th>
                                <th>التقدم</th>
                                <th>الصوت</th>
                            </tr>
                        </thead>

                        <tbody>
                            {records.length ? (
                                records.map((r) => (
                                    <tr key={r.id}>
                                        <td>{formatDate(session?.session?.created_at)}</td>

                                        <td>{session?.session?.level || "-"}</td>

                                        {/* ✅ FIX: expected_text */}
                                        <td>{r.expected_text || "-"}</td>

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
                                                    src={
                                                        r.file_url.startsWith("http")
                                                            ? r.file_url
                                                            : `${BASE}/${r.file_url.replace(/^\/+/, "")}`
                                                    }
                                                />
                                            ) : "-"}
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