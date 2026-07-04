import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) return null;

  const links =
    user.role === "admin"
      ? [
          { href: "/dashboard/admin", label: "Dashboard" },
          { href: "/attendance", label: "Attendance" },
          { href: "/leave", label: "Leave Approvals" },
          { href: "/payroll", label: "Payroll" },
        ]
      : [
          { href: "/dashboard/employee", label: "Dashboard" },
          { href: "/profile", label: "Profile" },
          { href: "/attendance", label: "Attendance" },
          { href: "/leave", label: "Leave" },
          { href: "/payroll", label: "Payroll" },
        ];

  return (
    <nav className="bg-ink text-white sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="font-display font-bold text-lg tracking-tight">
          HRMS <span className="text-brand-500">•</span> {user.role === "admin" ? "Admin" : "Employee"}
        </div>
        <div className="flex items-center gap-6 text-sm">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => {
                e.preventDefault();
                router.push(l.href);
              }}
              className={`hover:text-brand-500 transition-colors ${
                router.pathname === l.href ? "text-brand-500" : "text-slate-200"
              }`}
            >
              {l.label}
            </a>
          ))}
          <span className="text-slate-400">|</span>
          <span className="text-slate-300">{user.name}</span>
          <button
            onClick={logout}
            className="bg-brand-600 hover:bg-brand-700 px-3 py-1.5 rounded-md transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
