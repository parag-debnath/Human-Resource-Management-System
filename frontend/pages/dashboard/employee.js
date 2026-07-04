import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Card from "../../components/Card";
import { useProtect } from "../../lib/useProtect";
import api from "../../lib/api";

export default function EmployeeDashboard() {
  const { user, loading } = useProtect("employee");
  const [today, setToday] = useState(null);
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    if (!user) return;
    api.get("/attendance/my").then((res) => {
      const todayStr = new Date().toISOString().split("T")[0];
      setToday(res.data.find((r) => r.date === todayStr) || null);
    });
    api.get("/leaves/my").then((res) => setLeaves(res.data.slice(0, 3)));
  }, [user]);

  if (loading || !user) return null;

  const cards = [
    { href: "/profile", label: "Profile", desc: "View and edit your details" },
    { href: "/attendance", label: "Attendance", desc: "Check in / check out" },
    { href: "/leave", label: "Leave Requests", desc: "Apply and track status" },
    { href: "/payroll", label: "Payroll", desc: "View your salary" },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-1">Welcome back, {user.name.split(" ")[0]}</h1>
        <p className="text-slate-500 mb-8">Here's what's happening today.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {cards.map((c) => (
            <a key={c.href} href={c.href}
              onClick={(e) => { e.preventDefault(); window.location.href = c.href; }}
              className="block bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md hover:border-brand-500 transition-all">
              <div className="font-semibold text-ink mb-1">{c.label}</div>
              <div className="text-sm text-slate-500">{c.desc}</div>
            </a>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="Today's Attendance">
            {today ? (
              <div className="text-sm space-y-1 text-slate-600">
                <p>Check-in: {today.checkIn ? new Date(today.checkIn).toLocaleTimeString() : "—"}</p>
                <p>Check-out: {today.checkOut ? new Date(today.checkOut).toLocaleTimeString() : "—"}</p>
                <p>Status: {today.status}</p>
              </div>
            ) : (
              <p className="text-sm text-slate-500">You haven't checked in yet today.</p>
            )}
          </Card>
          <Card title="Recent Leave Requests">
            {leaves.length === 0 ? (
              <p className="text-sm text-slate-500">No leave requests yet.</p>
            ) : (
              <ul className="text-sm space-y-2 text-slate-600">
                {leaves.map((l) => (
                  <li key={l._id} className="flex justify-between">
                    <span>{l.leaveType} · {l.startDate} → {l.endDate}</span>
                    <span className="font-medium">{l.status}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}
