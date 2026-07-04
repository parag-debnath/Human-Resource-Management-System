import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import { useProtect } from "../lib/useProtect";
import api from "../lib/api";

export default function Payroll() {
  const { user, loading } = useProtect();
  const [data, setData] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ basic: 0, allowances: 0, deductions: 0 });

  const load = () => {
    const endpoint = user.role === "admin" ? "/payroll" : "/payroll/my";
    api.get(endpoint).then((res) => setData(res.data));
  };

  useEffect(() => {
    if (!user) return;
    load();
  }, [user]);

  const startEdit = (emp) => {
    setEditingId(emp._id);
    setForm({ basic: emp.salary.basic, allowances: emp.salary.allowances, deductions: emp.salary.deductions });
  };

  const saveEdit = async (id) => {
    await api.put(`/payroll/${id}`, form);
    setEditingId(null);
    load();
  };

  if (loading || !user || !data) return null;

  const net = (s) => (s.basic || 0) + (s.allowances || 0) - (s.deductions || 0);

  if (user.role !== "admin") {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="max-w-3xl mx-auto px-6 py-10">
          <h1 className="text-2xl font-bold mb-1">Payroll</h1>
          <p className="text-slate-500 mb-8">Your salary details (read-only).</p>
          <Card>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-slate-500">Basic</div><div className="font-medium text-right">₹{data.salary.basic}</div>
              <div className="text-slate-500">Allowances</div><div className="font-medium text-right">₹{data.salary.allowances}</div>
              <div className="text-slate-500">Deductions</div><div className="font-medium text-right">₹{data.salary.deductions}</div>
              <div className="pt-2 border-t border-slate-200 font-semibold">Net Pay</div>
              <div className="pt-2 border-t border-slate-200 font-semibold text-right text-brand-600">₹{net(data.salary)}</div>
            </div>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-1">Payroll Management</h1>
        <p className="text-slate-500 mb-8">View and update salary structures.</p>
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b border-slate-200">
                  <th className="py-2 pr-4">Employee</th>
                  <th className="py-2 pr-4">Basic</th>
                  <th className="py-2 pr-4">Allowances</th>
                  <th className="py-2 pr-4">Deductions</th>
                  <th className="py-2 pr-4">Net</th>
                  <th className="py-2 pr-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((e) => (
                  <tr key={e._id} className="border-b border-slate-100">
                    <td className="py-2 pr-4">{e.name}</td>
                    {editingId === e._id ? (
                      <>
                        <td className="py-2 pr-4"><input type="number" value={form.basic} onChange={(ev) => setForm({ ...form, basic: +ev.target.value })} className="w-24 border border-slate-300 rounded px-2 py-1" /></td>
                        <td className="py-2 pr-4"><input type="number" value={form.allowances} onChange={(ev) => setForm({ ...form, allowances: +ev.target.value })} className="w-24 border border-slate-300 rounded px-2 py-1" /></td>
                        <td className="py-2 pr-4"><input type="number" value={form.deductions} onChange={(ev) => setForm({ ...form, deductions: +ev.target.value })} className="w-24 border border-slate-300 rounded px-2 py-1" /></td>
                        <td className="py-2 pr-4 font-medium">₹{net(form)}</td>
                        <td className="py-2 pr-4">
                          <button onClick={() => saveEdit(e._id)} className="text-brand-600 hover:underline mr-3">Save</button>
                          <button onClick={() => setEditingId(null)} className="text-slate-400 hover:underline">Cancel</button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-2 pr-4">₹{e.salary.basic}</td>
                        <td className="py-2 pr-4">₹{e.salary.allowances}</td>
                        <td className="py-2 pr-4">₹{e.salary.deductions}</td>
                        <td className="py-2 pr-4 font-medium">₹{net(e.salary)}</td>
                        <td className="py-2 pr-4">
                          <button onClick={() => startEdit(e)} className="text-brand-600 hover:underline">Edit</button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  );
}
