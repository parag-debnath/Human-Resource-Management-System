import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import StatusBadge from "../components/StatusBadge";
import { useProtect } from "../lib/useProtect";
import api from "../lib/api";

export default function Attendance() {
  const { user, loading } = useProtect();
  const [records, setRecords] = useState([]);
  const [error, setError] = useState("");

  const load = () => {
    const endpoint = user.role === "admin" ? "/attendance" : "/attendance/my";
    api.get(endpoint).then((res) => setRecords(res.data));
  };

  useEffect(() => {
    if (!user) return;
    load();
  }, [user]);

  const checkIn = async () => {
    setError("");
    try {
      await api.post("/attendance/checkin");
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Check-in failed");
    }
  };

  const checkOut = async () => {
    setError("");
    try {
      await api.post("/attendance/checkout");
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Check-out failed");
    }
  };

  if (loading || !user) return null;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-1">Attendance</h1>
        <p className="text-slate-500 mb-8">
          {user.role === "admin" ? "Attendance records across all employees." : "Daily and weekly attendance view."}
        </p>

        {error && (
          <div className="mb-4 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">{error}</div>
        )}

        {user.role !== "admin" && (
          <Card className="mb-6">
            <div className="flex gap-3">
              <button onClick={checkIn} className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                Check In
              </button>
              <button onClick={checkOut} className="border border-slate-300 hover:bg-slate-50 px-4 py-2 rounded-lg text-sm font-medium">
                Check Out
              </button>
            </div>
          </Card>
        )}

        <Card title={user.role === "admin" ? "All Attendance Records" : "My Attendance History"}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b border-slate-200">
                  {user.role === "admin" && <th className="py-2 pr-4">Employee</th>}
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Check-in</th>
                  <th className="py-2 pr-4">Check-out</th>
                  <th className="py-2 pr-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r._id} className="border-b border-slate-100">
                    {user.role === "admin" && <td className="py-2 pr-4">{r.employee?.name}</td>}
                    <td className="py-2 pr-4">{r.date}</td>
                    <td className="py-2 pr-4">{r.checkIn ? new Date(r.checkIn).toLocaleTimeString() : "—"}</td>
                    <td className="py-2 pr-4">{r.checkOut ? new Date(r.checkOut).toLocaleTimeString() : "—"}</td>
                    <td className="py-2 pr-4"><StatusBadge status={r.status} /></td>
                  </tr>
                ))}
                {records.length === 0 && (
                  <tr><td colSpan={5} className="py-6 text-center text-slate-400">No records yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  );
}
