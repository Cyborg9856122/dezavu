import { useState } from "react";
import { useRepositoryAll } from "../data/useRepository";
import { serviceRepo, id } from "../data/repositories";
import { BUSINESS_ID } from "../data/seed";
import { Card } from "../components/Card";
import { formatCurrency } from "../lib/format";
import { activeBusinessType } from "../config/activeBusinessType";
import type { Service } from "../types/domain";
import { useSession } from "../session/SessionContext";

const EMPTY: Omit<Service, "id" | "businessId"> = {
  category: activeBusinessType.serviceCategories[0],
  name: "",
  description: "",
  price: 0,
  durationMinutes: 30,
  active: true,
  suitableCharacteristics: [],
  recommendedMaintenance: "medium",
  aiRecommendationEligible: true,
};

export function ServicesPage() {
  const services = useRepositoryAll(serviceRepo);
  const { can } = useSession();
  const [draft, setDraft] = useState<typeof EMPTY | null>(null);

  const canManage = can("manageServices");

  function addService() {
    if (!draft || !draft.name.trim()) return;
    serviceRepo.create({ ...draft, id: id(), businessId: BUSINESS_ID });
    setDraft(null);
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-medium text-ink">Services</h1>
          <p className="text-[13px] text-clay">{services.length} in your catalog</p>
        </div>
        {canManage && (
          <button
            onClick={() => setDraft(draft ? null : EMPTY)}
            className="rounded-full bg-ink px-4 py-2 text-[13px] font-medium text-cream"
          >
            {draft ? "Cancel" : "New Service"}
          </button>
        )}
      </div>

      {draft && (
        <Card className="mt-4">
          <div className="grid grid-cols-2 gap-3">
            <input
              placeholder="Service name"
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              className="rounded-lg border border-line px-3 py-2 text-[13px]"
            />
            <select
              value={draft.category}
              onChange={(e) => setDraft({ ...draft, category: e.target.value })}
              className="rounded-lg border border-line px-3 py-2 text-[13px]"
            >
              {activeBusinessType.serviceCategories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Price"
              value={draft.price}
              onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) })}
              className="rounded-lg border border-line px-3 py-2 text-[13px]"
            />
            <input
              type="number"
              placeholder="Duration (minutes)"
              value={draft.durationMinutes}
              onChange={(e) => setDraft({ ...draft, durationMinutes: Number(e.target.value) })}
              className="rounded-lg border border-line px-3 py-2 text-[13px]"
            />
            <input
              placeholder="Description"
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              className="col-span-2 rounded-lg border border-line px-3 py-2 text-[13px]"
            />
          </div>
          <button onClick={addService} className="mt-3 rounded-full bg-sage px-5 py-2 text-[13px] font-medium text-cream">
            Add service
          </button>
        </Card>
      )}

      <div className="mt-5 overflow-hidden rounded-2xl border border-line bg-white">
        {services.map((s) => (
          <div key={s.id} className="flex items-center justify-between border-b border-line px-5 py-4 last:border-0">
            <div>
              <p className="text-[14px] font-medium text-ink">{s.name}</p>
              <p className="text-[12px] text-clay">
                {s.category} · {s.durationMinutes} min · {formatCurrency(s.price)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[12px] text-clay">{s.aiRecommendationEligible ? "AI enabled" : "AI disabled"}</span>
              {canManage ? (
                <button
                  onClick={() => serviceRepo.update(s.id, { active: !s.active })}
                  className={`rounded-full px-3 py-1 text-[12px] font-medium ${
                    s.active ? "bg-sage/20 text-sage" : "bg-line text-clay"
                  }`}
                >
                  {s.active ? "Active" : "Inactive"}
                </button>
              ) : (
                <span className="text-[12px] text-clay">{s.active ? "Active" : "Inactive"}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
