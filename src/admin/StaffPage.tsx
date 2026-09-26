import { useState } from "react";
import { useRepositoryAll } from "../data/useRepository";
import { staffRepo, id } from "../data/repositories";
import { BUSINESS_ID } from "../data/seed";
import { Card } from "../components/Card";
import { EmptyState } from "../components/EmptyState";
import { useSession } from "../session/SessionContext";
import type { StaffRole, StaffUser } from "../types/domain";

const ROLES: StaffRole[] = ["owner", "manager", "stylist", "receptionist"];

export function StaffPage() {
  const staff = useRepositoryAll(staffRepo);
  const { can } = useSession();
  const canManage = can("manageStaff");
  const [draft, setDraft] = useState<{ name: string; email: string; role: StaffRole } | null>(null);

  if (!canManage) {
    return <EmptyState title="Staff management" description="Your role doesn't have access to this page." />;
  }

  function addStaff() {
    if (!draft || !draft.name.trim()) return;
    const user: StaffUser = { id: id(), businessId: BUSINESS_ID, name: draft.name, email: draft.email, role: draft.role, status: "active" };
    staffRepo.create(user);
    setDraft(null);
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-[22px] font-medium text-ink">Staff</h1>
        <button
          onClick={() => setDraft(draft ? null : { name: "", email: "", role: "stylist" })}
          className="rounded-full bg-ink px-4 py-2 text-[13px] font-medium text-cream"
        >
          {draft ? "Cancel" : "Add Staff"}
        </button>
      </div>

      {draft && (
        <Card className="mt-4">
          <div className="grid grid-cols-3 gap-3">
            <input
              placeholder="Name"
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              className="rounded-lg border border-line px-3 py-2 text-[13px]"
            />
            <input
              placeholder="Email"
              value={draft.email}
              onChange={(e) => setDraft({ ...draft, email: e.target.value })}
              className="rounded-lg border border-line px-3 py-2 text-[13px]"
            />
            <select
              value={draft.role}
              onChange={(e) => setDraft({ ...draft, role: e.target.value as StaffRole })}
              className="rounded-lg border border-line px-3 py-2 text-[13px] capitalize"
            >
              {ROLES.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>
          <button onClick={addStaff} className="mt-3 rounded-full bg-sage px-5 py-2 text-[13px] font-medium text-cream">
            Add
          </button>
        </Card>
      )}

      <div className="mt-5 overflow-hidden rounded-2xl border border-line bg-white">
        {staff.map((s) => (
          <div key={s.id} className="flex items-center justify-between border-b border-line px-5 py-4 last:border-0">
            <div>
              <p className="text-[14px] font-medium text-ink">{s.name}</p>
              <p className="text-[12px] text-clay">{s.email}</p>
            </div>
            <select
              value={s.role}
              onChange={(e) => staffRepo.update(s.id, { role: e.target.value as StaffRole })}
              className="rounded-lg border border-line px-2 py-1.5 text-[13px] capitalize"
            >
              {ROLES.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
