import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Card from "../../components/Card";
import StatusBadge from "../../components/StatusBadge";
import { useProtect } from "../../lib/useProtect";
import api from "../../lib/api";

export default function AdminDashboard() {
  const { user, loading } = useProtect("admin");
  const [employees, setEmployees] = useState([]);
  const [pendingLeaves, setPendingLeaves] = useState([]);

  useEffect(() => {
    if (!user) return;
    api.get("/employees").then((res) => setEmployees(res.data));
    api.get("/leaves").then((res) => setPendingLeaves(res.data.filter((l) => l.status === "Pending")));
  }, [user]);

  if (loading || !user) return null;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-1">Admin Dashboard</h1>
        <p className="text-slate-500 mb-8">Manage employees, attendance, and approvals.</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card>
            <div className="text-3xl font-bold text-brand-600">{employees.length}</div>
            <div className="text-sm text-slate-500 mt-1">Total Employees</div>
          </Card>
          <Card>
            <div className="text-3xl font-bold text-amber-600">{pendingLeaves.length}</div>
            <div className="text-sm text-slate-500 mt-1">Pending Leave Requests</div>
          </Card>
          <Card>
            <div className="text-3xl font-bold text-emerald-600">
              {employees.filter((e) => e.role === "employee").length}
            </div>
            <div className="text-sm text-slate-500 mt-1">Active Staff</div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Employee List">
            <div className="max-h-80 overflow-y-auto -mx-2">
              {employees.map((e) => (
                <div key={e._id} className="flex justify-between items-center px-2 py-2 hover:bg-slate-50 rounded-lg text-sm">
                  <div>
                    <div className="font-medium text-ink">{e.name}</div>
                    <div className="text-slate-500 text-xs">{e.employeeId} · {e.department || "No dept."}</div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600 capitalize">{e.role}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card title="Pending Leave Approvals">
            {pendingLeaves.length === 0 ? (
              <p className="text-sm text-slate-500">Nothing pending. All caught up.</p>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {pendingLeaves.map((l) => (
                  <div key={l._id} className="flex justify-between items-center text-sm px-2 py-2 hover:bg-slate-50 rounded-lg">
                    <div>
                      <div className="font-medium text-ink">{l.employee?.name}</div>
                      <div className="text-slate-500 text-xs">{l.leaveType} · {l.startDate} → {l.endDate}</div>
                    </div>
                    <StatusBadge status={l.status} />
                  </div>
                ))}
              </div>
            )}
            <a href="/leave" onClick={(e) => { e.preventDefault(); window.location.href = "/leave"; }}
              className="inline-block mt-4 text-sm text-brand-600 font-medium hover:underline">
              Go to full approvals →
            </a>
          </Card>
        </div>
      </main>
    </div>
  );
}
