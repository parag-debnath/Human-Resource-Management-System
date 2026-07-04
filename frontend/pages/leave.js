import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import StatusBadge from "../components/StatusBadge";
import { useProtect } from "../lib/useProtect";
import api from "../lib/api";

export default function Leave() {
  const { user, loading } = useProtect();
  const [leaves, setLeaves] = useState([]);
  const [form, setForm] = useState({ leaveType: "Paid", startDate: "", endDate: "", remarks: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = () => {
    const endpoint = user.role === "admin" ? "/leaves" : "/leaves/my";
    api.get(endpoint).then((res) => setLeaves(res.data));
  };

  useEffect(() => {
    if (!user) return;
    load();
  }, [user]);

  const applyLeave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await api.post("/leaves/apply", form);
      setForm({ leaveType: "Paid", startDate: "", endDate: "", remarks: "" });
      setSuccess("Leave request submitted.");
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit leave request");
    }
  };

  const decide = async (id, status) => {
    const addComment = window.confirm(`Do you want to add a default comment for this ${status.toLowerCase()} decision?`);
    const adminComment = addComment ? `Processed: ${status}` : "";
    await api.put(`/leaves/${id}/status`, { status, adminComment });
    load();
  };

  if (loading || !user) return null;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-1">{user.role === "admin" ? "Leave Approvals" : "Leave & Time-Off"}</h1>
        <p className="text-slate-500 mb-8">
          {user.role === "admin" ? "Review, approve, or reject employee leave requests." : "Apply for leave and track your requests."}
        </p>

        {user.role !== "admin" && (
          <Card title="Apply for Leave" className="mb-6">
            {error && <div className="mb-3 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">{error}</div>}
            {success && <div className="mb-3 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">{success}</div>}
            <form onSubmit={applyLeave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-600 mb-1">Leave Type</label>
                <select value={form.leaveType} onChange={(e) => setForm({ ...form, leaveType: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2">
                  <option>Paid</option>
                  <option>Sick</option>
                  <option>Unpaid</option>
                </select>
              </div>
              <div />
              <div>
                <label className="block text-sm text-slate-600 mb-1">Start Date</label>
                <input type="date" required value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">End Date</label>
                <input type="date" required value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm text-slate-600 mb-1">Remarks</label>
                <textarea value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2" rows={2} placeholder="Optional note for your manager" />
              </div>
              <div className="sm:col-span-2">
                <button type="submit" className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                  Submit Request
                </button>
              </div>
            </form>
          </Card>
        )}

        <Card title={user.role === "admin" ? "All Leave Requests" : "My Leave Requests"}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b border-slate-200">
                  {user.role === "admin" && <th className="py-2 pr-4">Employee</th>}
                  <th className="py-2 pr-4">Type</th>
                  <th className="py-2 pr-4">Dates</th>
                  <th className="py-2 pr-4">Remarks</th>
                  <th className="py-2 pr-4">Status</th>
                  {user.role === "admin" && <th className="py-2 pr-4">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {leaves.map((l) => (
                  <tr key={l._id} className="border-b border-slate-100">
                    {user.role === "admin" && <td className="py-2 pr-4">{l.employee?.name}</td>}
                    <td className="py-2 pr-4">{l.leaveType}</td>
                    <td className="py-2 pr-4">{l.startDate} → {l.endDate}</td>
                    <td className="py-2 pr-4 text-slate-500">{l.remarks || "—"}</td>
                    <td className="py-2 pr-4"><StatusBadge status={l.status} /></td>
                    {user.role === "admin" && (
                      <td className="py-2 pr-4">
                        {l.status === "Pending" ? (
                          <div className="flex gap-2">
                            <button onClick={() => decide(l._id, "Approved")} className="text-emerald-600 hover:underline">Approve</button>
                            <button onClick={() => decide(l._id, "Rejected")} className="text-rose-600 hover:underline">Reject</button>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs">{l.adminComment || "Decided"}</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
                {leaves.length === 0 && (
                  <tr><td colSpan={6} className="py-6 text-center text-slate-400">No leave requests yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  );
}
