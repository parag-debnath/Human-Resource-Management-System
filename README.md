# HRMS — Human Resource Management System

Built with: **Next.js + Tailwind CSS** (frontend) and **Node.js + Express + MongoDB** (backend), matching your requirements doc.

## What's included

| Requirement | Where it lives |
|---|---|
| Sign Up / Sign In (JWT auth) | `backend/routes/authRoutes.js`, `frontend/pages/index.js`, `frontend/pages/signup.js` |
| Role-based access (Admin vs Employee) | `backend/middleware/auth.js`, `frontend/lib/useProtect.js` |
| Employee Dashboard / Admin Dashboard | `frontend/pages/dashboard/employee.js`, `frontend/pages/dashboard/admin.js` |
| Profile view/edit | `backend/routes/employeeRoutes.js`, `frontend/pages/profile.js` |
| Attendance (check-in/out, daily/weekly view) | `backend/routes/attendanceRoutes.js`, `frontend/pages/attendance.js` |
| Leave apply / approve / reject | `backend/routes/leaveRoutes.js`, `frontend/pages/leave.js` |
| Payroll (read-only for employee, editable by admin) | `backend/routes/payrollRoutes.js`, `frontend/pages/payroll.js` |

## 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
# edit .env: set MONGO_URI (local Mongo or a free MongoDB Atlas cluster) and a JWT_SECRET
npm run dev
```

Runs on `http://localhost:5000`. Test it's alive: open that URL, you should see `{"status":"HRMS API running"}`.

**No MongoDB installed?** Fastest option for a hackathon: create a free cluster at mongodb.com/atlas, grab the connection string, paste it into `MONGO_URI`.

## 2. Frontend setup

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

Runs on `http://localhost:3000`. Make sure the backend is running first.

## 3. Try it out

1. Go to `http://localhost:3000/signup`, create an **Admin/HR** account and a separate **Employee** account.
2. Sign in as Employee → check in, apply for leave, edit your profile.
3. Sign in as Admin → approve/reject the leave request, edit the employee's salary, browse attendance.

## Notes / things you may want to extend for judging

- **Email verification** is simplified (`isVerified` defaults to `true`) — there's no real mail-sending flow. If you want it, plug in `nodemailer` in `authRoutes.js`.
- **File uploads** (profile picture, documents) currently just store a URL string, not an actual file. For a demo, paste any image URL. Swap in `multer` + cloud storage if you need real uploads.
- **Password rule** enforced: 8+ characters, at least one letter and one number.
- **Calendar-based leave picker**: the leave form currently uses native date inputs (`type="date"`) for simplicity — swap in a calendar component (e.g. `react-day-picker`) if you want the visual month calendar from your spec.
- Passwords are hashed with bcrypt; auth uses JWT (7-day expiry) sent as `Authorization: Bearer <token>`.

## Folder structure

```
hrms-project/
├── backend/
│   ├── config/db.js
│   ├── models/ (User, Attendance, Leave)
│   ├── middleware/auth.js
│   ├── routes/ (auth, employee, attendance, leave, payroll)
│   └── server.js
└── frontend/
    ├── pages/ (index=login, signup, dashboard/employee, dashboard/admin, profile, attendance, leave, payroll)
    ├── components/ (Navbar, Card, StatusBadge)
    ├── context/AuthContext.js
    └── lib/ (api.js, useProtect.js)
```
