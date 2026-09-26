import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { staffRepo } from "../data/repositories";
import type { StaffUser } from "../types/domain";

/**
 * Mock staff "login" — a role switcher, not real authentication. Product
 * Spec §22/§46 call for real role-based access control backed by a real
 * auth provider; that requires the backend this pass deliberately deferred
 * (per the local-only data-layer decision). Swapping this for real auth
 * later means replacing this context's internals, not the permission checks
 * that read from it.
 */
interface SessionContextValue {
  staff: StaffUser | null;
  setStaffId: (id: string) => void;
  can: (permission: "manageStaff" | "manageServices" | "manageSettings" | "viewAnalytics") => boolean;
}

const SessionContext = createContext<SessionContextValue | null>(null);

const STORAGE_KEY = "dezavu:activeStaffId";

const ROLE_PERMISSIONS: Record<StaffUser["role"], SessionContextValue["can"] extends (p: infer P) => boolean ? P[] : never> = {
  owner: ["manageStaff", "manageServices", "manageSettings", "viewAnalytics"],
  manager: ["manageServices", "manageSettings", "viewAnalytics"],
  stylist: ["viewAnalytics"],
  receptionist: [],
};

export function SessionProvider({ children }: { children: ReactNode }) {
  const [staffId, setStaffIdState] = useState<string | null>(() => window.localStorage.getItem(STORAGE_KEY));
  const [staff, setStaff] = useState<StaffUser | null>(null);

  useEffect(() => {
    const all = staffRepo.getAll();
    const active = all.find((s) => s.id === staffId) ?? all[0] ?? null;
    setStaff(active);
    if (active && active.id !== staffId) {
      window.localStorage.setItem(STORAGE_KEY, active.id);
      setStaffIdState(active.id);
    }
  }, [staffId]);

  const setStaffId = (id: string) => {
    window.localStorage.setItem(STORAGE_KEY, id);
    setStaffIdState(id);
  };

  const can: SessionContextValue["can"] = (permission) =>
    staff ? ROLE_PERMISSIONS[staff.role].includes(permission) : false;

  return <SessionContext.Provider value={{ staff, setStaffId, can }}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}
