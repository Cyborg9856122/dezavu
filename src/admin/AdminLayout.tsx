import { NavLink, Outlet, Link } from "react-router-dom";
import { Logo } from "../components/Logo";
import { useSession } from "../session/SessionContext";
import { useRepositoryAll } from "../data/useRepository";
import { staffRepo, businessRepo } from "../data/repositories";
import { useThemeClass } from "../data/useAppearance";

const NAV = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/customers", label: "Customers" },
  { to: "/admin/consultations", label: "Consultations" },
  { to: "/admin/services", label: "Services" },
  { to: "/admin/styles", label: "Style Library" },
  { to: "/admin/staff", label: "Staff" },
  { to: "/admin/settings", label: "Settings" },
];

export function AdminLayout() {
  const { staff, setStaffId } = useSession();
  const allStaff = useRepositoryAll(staffRepo);
  const businesses = useRepositoryAll(businessRepo);
  const business = businesses[0];
  const themeClass = useThemeClass("admin");

  return (
    <div className={`flex h-screen w-screen bg-cream text-ink ${themeClass}`}>
      <aside className="flex w-60 shrink-0 flex-col border-r border-line bg-white px-4 py-6">
        <Logo variant="primary" className="px-2 text-[16px]" />
        <p className="mt-1 px-2 text-[12px] text-clay">{business?.name}</p>

        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2.5 text-[14px] font-medium transition-colors ${
                  isActive ? "bg-ink text-cream" : "text-clay hover:bg-cream hover:text-ink"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <Link
          to="/kiosk"
          className="rounded-lg border border-line px-3 py-2.5 text-center text-[13px] font-medium text-clay hover:border-clay/40"
        >
          Open Kiosk ↗
        </Link>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-end gap-3 border-b border-line bg-white px-6 py-3">
          <label className="text-[12px] text-clay">
            Signed in as
            <select
              value={staff?.id ?? ""}
              onChange={(e) => setStaffId(e.target.value)}
              className="ml-2 rounded-lg border border-line bg-cream px-2 py-1.5 text-[13px] text-ink"
            >
              {allStaff.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} — {s.role}
                </option>
              ))}
            </select>
          </label>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto px-8 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
