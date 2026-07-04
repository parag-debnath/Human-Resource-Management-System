const styles = {
  Pending: "bg-amber-100 text-amber-700",
  Approved: "bg-emerald-100 text-emerald-700",
  Rejected: "bg-rose-100 text-rose-700",
  Present: "bg-emerald-100 text-emerald-700",
  Absent: "bg-rose-100 text-rose-700",
  "Half-day": "bg-amber-100 text-amber-700",
  Leave: "bg-slate-100 text-slate-700",
};

export default function StatusBadge({ status }) {
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${styles[status] || "bg-slate-100 text-slate-700"}`}>
      {status}
    </span>
  );
}
