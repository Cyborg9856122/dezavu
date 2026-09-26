import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useRepositoryAll } from "../data/useRepository";
import {
  consultationRepo,
  customerRepo,
  recommendationRepo,
  serviceRepo,
  styleRepo,
} from "../data/repositories";
import { Card } from "../components/Card";
import { MatchBadge } from "../components/Badge";
import { EmptyState } from "../components/EmptyState";
import { formatDate, formatCurrency } from "../lib/format";
import type { StylistDecision } from "../types/domain";

export function ConsultationDetailPage() {
  const { consultationId } = useParams();
  const consultations = useRepositoryAll(consultationRepo);
  const customers = useRepositoryAll(customerRepo);
  const recommendations = useRepositoryAll(recommendationRepo);
  const styles = useRepositoryAll(styleRepo);
  const services = useRepositoryAll(serviceRepo);
  const [notes, setNotes] = useState<string | null>(null);

  const consultation = consultations.find((c) => c.id === consultationId);
  if (!consultation) return <EmptyState title="Consultation not found" />;

  const customer = customers.find((c) => c.id === consultation.customerId);
  const recs = recommendations.filter((r) => consultation.recommendationIds.includes(r.id));
  const selectedServices = services.filter((s) => consultation.selectedServiceIds.includes(s.id));
  const total = selectedServices.reduce((sum, s) => sum + s.price, 0);

  function decide(recId: string, decision: StylistDecision) {
    recommendationRepo.update(recId, { stylistDecision: decision });
  }

  return (
    <div className="max-w-3xl">
      <Link to="/admin/consultations" className="text-[13px] text-clay hover:text-ink">
        ‹ All consultations
      </Link>

      <div className="mt-3 flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-medium text-ink">{customer?.name ?? "Unknown customer"}</h1>
          <p className="text-[13px] text-clay">{formatDate(consultation.date)}</p>
        </div>
        <p className="text-[13px] text-clay">Est. total {formatCurrency(total)}</p>
      </div>

      <Card className="mt-5">
        <p className="text-[13px] font-medium text-ink">Recommendations</p>
        <div className="mt-3 space-y-3">
          {recs.map((r) => {
            const style = styles.find((s) => s.id === r.styleId);
            return (
              <div key={r.id} className="rounded-xl border border-line p-3">
                <div className="flex items-center justify-between">
                  <p className="text-[14px] font-medium text-ink">{style?.name}</p>
                  <MatchBadge level={r.matchLevel} />
                </div>
                <ul className="mt-1 ml-4 list-disc text-[12px] text-clay">
                  {r.reasons.map((reason, i) => (
                    <li key={i}>{reason}</li>
                  ))}
                </ul>
                <div className="mt-3 flex items-center gap-2">
                  {(["accepted", "modified", "rejected"] as StylistDecision[]).map((d) => (
                    <button
                      key={d}
                      onClick={() => decide(r.id, d)}
                      className={`rounded-full border px-3 py-1 text-[12px] font-medium capitalize ${
                        r.stylistDecision === d
                          ? "border-ink bg-ink text-cream"
                          : "border-line text-clay hover:border-clay/40"
                      }`}
                    >
                      {d === "accepted" ? "Accept" : d === "modified" ? "Modify" : "Reject"}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="mt-4">
        <p className="text-[13px] font-medium text-ink">Selected services</p>
        <ul className="mt-2 space-y-1 text-[13px] text-ink">
          {selectedServices.map((s) => (
            <li key={s.id} className="flex justify-between">
              <span>{s.name}</span>
              <span className="text-clay">{formatCurrency(s.price)}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="mt-4">
        <p className="text-[13px] font-medium text-ink">Stylist notes</p>
        <textarea
          value={notes ?? consultation.stylistNotes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          className="mt-2 w-full rounded-xl border border-line bg-cream px-3 py-2.5 text-[13px] outline-none focus:border-clay/50"
        />
        <button
          onClick={() => {
            if (notes !== null) consultationRepo.update(consultation.id, { stylistNotes: notes });
          }}
          className="mt-2 rounded-full bg-ink px-5 py-2 text-[13px] font-medium text-cream"
        >
          Save notes
        </button>
      </Card>
    </div>
  );
}
