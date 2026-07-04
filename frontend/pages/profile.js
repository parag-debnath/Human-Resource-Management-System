import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import { useProtect } from "../lib/useProtect";
import api from "../lib/api";

export default function Profile() {
  const { user, loading } = useProtect();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ phone: "", address: "", profilePicture: "" });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    api.get("/employees/me").then((res) => {
      setProfile(res.data);
      setForm({
        phone: res.data.phone || "",
        address: res.data.address || "",
        profilePicture: res.data.profilePicture || "",
      });
    });
  }, [user]);

  const save = async () => {
    const { data } = await api.put("/employees/me", form);
    setProfile(data);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading || !user || !profile) return null;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-1">My Profile</h1>
        <p className="text-slate-500 mb-8">Personal details, job info, and documents.</p>

        {saved && (
          <div className="mb-4 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
            Profile updated.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="Personal Details">
            <div className="space-y-3 text-sm">
              <div><span className="text-slate-500">Name:</span> <span className="font-medium">{profile.name}</span></div>
              <div><span className="text-slate-500">Employee ID:</span> <span className="font-medium">{profile.employeeId}</span></div>
              <div><span className="text-slate-500">Email:</span> <span className="font-medium">{profile.email}</span></div>

              {editing ? (
                <>
                  <div>
                    <label className="block text-slate-500 mb-1">Phone</label>
                    <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500" />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1">Address</label>
                    <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500" />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1">Profile Picture URL</label>
                    <input value={form.profilePicture} onChange={(e) => setForm({ ...form, profilePicture: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500" />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button onClick={save} className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm">Save changes</button>
                    <button onClick={() => setEditing(false)} className="border border-slate-300 px-4 py-2 rounded-lg text-sm">Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <div><span className="text-slate-500">Phone:</span> <span className="font-medium">{profile.phone || "—"}</span></div>
                  <div><span className="text-slate-500">Address:</span> <span className="font-medium">{profile.address || "—"}</span></div>
                  <button onClick={() => setEditing(true)} className="mt-2 text-brand-600 font-medium text-sm hover:underline">
                    Edit my details
                  </button>
                </>
              )}
            </div>
          </Card>

          <Card title="Job Details">
            <div className="space-y-3 text-sm">
              <div><span className="text-slate-500">Job Title:</span> <span className="font-medium">{profile.jobTitle || "—"}</span></div>
              <div><span className="text-slate-500">Department:</span> <span className="font-medium">{profile.department || "—"}</span></div>
              <div><span className="text-slate-500">Date Joined:</span> <span className="font-medium">{new Date(profile.dateJoined).toLocaleDateString()}</span></div>
              <div className="pt-2 border-t border-slate-100">
                <span className="text-slate-500">Salary Structure (read-only):</span>
                <div className="mt-1 text-slate-700">
                  Basic: {profile.salary?.basic ?? 0} · Allowances: {profile.salary?.allowances ?? 0} · Deductions: {profile.salary?.deductions ?? 0}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
