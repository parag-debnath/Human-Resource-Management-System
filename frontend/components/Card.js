export default function Card({ title, children, className = "" }) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-slate-200 p-6 ${className}`}>
      {title && <h3 className="text-lg font-semibold mb-4 text-ink">{title}</h3>}
      {children}
    </div>
  );
}
