import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useRepositoryAll } from "../data/useRepository";
import {
  consultationRepo,
  customerRepo,
  recommendationRepo,
  scanRepo,
  serviceRepo,
  styleRepo,
} from "../data/repositories";
import { Card } from "../components/Card";
import { MatchBadge } from "../components/Badge";
import { FaceAvatar } from "../components/FaceAvatar";
import { styleToAvatarProps } from "../ai/generatePreview";
import { formatDate, timeAgo } from "../lib/format";
import { EmptyState } from "../components/EmptyState";
import type { Consultation, Recommendation, Style } from "../types/domain";

const TABS = ["Overview", "Scans", "Recommendations", "Looks", "Compare", "Notes"] as const;
type Tab = (typeof TABS)[number];

export function CustomerProfilePage() {
  const { customerId } = useParams();
  const customers = useRepositoryAll(customerRepo);
  const consultations = useRepositoryAll(consultationRepo);
  const scans = useRepositoryAll(scanRepo);
  const recommendations = useRepositoryAll(recommendationRepo);
  const styles = useRepositoryAll(styleRepo);
  const services = useRepositoryAll(serviceRepo);

  const [tab, setTab] = useState<Tab>("Overview");
  const [notesDraft, setNotesDraft] = useState<string | null>(null);
  const [compareIds, setCompareIds] = useState<[string, string] | null>(null);

  const customer = customers.find((c) => c.id === customerId);
  const myConsultations = useMemo(
    () => consultations.filter((c) => c.customerId === customerId).sort((a, b) => b.date.localeCompare(a.date)),
    [consultations, customerId],
  );
  const myScans = useMemo(
    () => scans.filter((s) => s.customerId === customerId).sort((a, b) => b.date.localeCompare(a.date)),
    [scans, customerId],
  );

  if (!customer) {
    return <EmptyState title="Customer not found" />;
  }

  const styleById = (id: string) => styles.find((s) => s.id === id);
  const serviceNames = (ids: string[]) =>
    ids.map((id) => services.find((s) => s.id === id)?.name).filter(Boolean).join(", ");
  const recsFor = (consultationId: string) => recommendations.filter((r) => r.consultationId === consultationId);

  function saveNotes() {
    if (notesDraft === null || !customer) return;
    customerRepo.update(customer.id, { notes: notesDraft });
    setNotesDraft(null);
  }

  return (
    <div className="max-w-4xl">
      <Link to="/admin/customers" className="text-[13px] text-clay hover:text-ink">
        ‹ All customers
      </Link>

      <div className="mt-3 flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-medium text-ink">{customer.name}</h1>
          <p className="text-[13px] text-clay">
            {customer.phone} {customer.email ? `· ${customer.email}` : ""}
          </p>
        </div>
        <div className="text-right text-[12px] text-clay">
          <p>{customer.consultationCount} consultations</p>
          <p>Last visit {timeAgo(customer.lastVisit)}</p>
        </div>
      </div>

      <div className="mt-6 flex gap-1 border-b border-line">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-2.5 text-[13px] font-medium ${
              tab === t ? "border-b-2 border-ink text-ink" : "text-clay hover:text-ink"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-5">
        {tab === "Overview" && (
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <p className="text-[13px] font-medium text-ink">Preferences</p>
              <dl className="mt-3 space-y-2 text-[13px]">
                <div className="flex justify-between">
                  <dt className="text-clay">Maintenance</dt>
                  <dd className="text-ink">{customer.preferences.maintenancePreference}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-clay">Preferred styles</dt>
                  <dd className="text-ink">{customer.preferences.preferredStyles.join(", ") || "—"}</dd>
                </div>
              </dl>
            </Card>
            <Card>
              <p className="text-[13px] font-medium text-ink">Consent</p>
              <p className="mt-3 text-[13px] text-ink">
                {customer.consent.status === "granted" ? "Granted" : "Not on file"}
                {customer.consent.timestamp ? ` · ${formatDate(customer.consent.timestamp)}` : ""}
              </p>
              <p className="text-[12px] text-clay">Policy v{customer.consent.policyVersion}</p>
            </Card>
            <Card className="col-span-2">
              <p className="text-[13px] font-medium text-ink">Staff notes</p>
              <p className="mt-2 whitespace-pre-wrap text-[13px] text-clay">{customer.notes || "No notes yet."}</p>
            </Card>
          </div>
        )}

        {tab === "Scans" && (
          <div className="space-y-3">
            {myScans.length === 0 && <EmptyState title="No scans yet" />}
            {myScans.map((scan) => {
              const consultation = myConsultations.find((c) => c.scanId === scan.id);
              return (
                <Card key={scan.id}>
                  <div className="flex items-center justify-between">
                    <p className="text-[14px] font-medium text-ink">{formatDate(scan.date)}</p>
                    <p className="text-[12px] text-clay">
                      {consultation?.preferences.lookingFor.join(", ") || "General scan"}
                    </p>
                  </div>
                  {scan.analysis && (
                    <p className="mt-2 text-[12px] text-clay">
                      {scan.analysis.faceShape} face · {scan.analysis.estimatedHairLength.replace("_", " ")} hair ·{" "}
                      {scan.analysis.hairTexture}
                    </p>
                  )}
                </Card>
              );
            })}
          </div>
        )}

        {tab === "Recommendations" && (
          <div className="space-y-3">
            {myConsultations.length === 0 && <EmptyState title="No recommendations yet" />}
            {myConsultations.map((c) => (
              <Card key={c.id}>
                <p className="text-[12px] text-clay">{formatDate(c.date)}</p>
                <div className="mt-2 space-y-2">
                  {recsFor(c.id).map((r) => {
                    const style = styleById(r.styleId);
                    if (!style) return null;
                    return (
                      <div key={r.id} className="flex items-center justify-between">
                        <span className="text-[13px] text-ink">{style.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[12px] text-clay capitalize">{r.stylistDecision}</span>
                          <MatchBadge level={r.matchLevel} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            ))}
          </div>
        )}

        {tab === "Looks" && (
          <div className="grid grid-cols-3 gap-4">
            {myConsultations.flatMap((c) => recsFor(c.id)).length === 0 && <EmptyState title="No saved looks yet" />}
            {myConsultations
              .flatMap((c) => recsFor(c.id))
              .map((r) => {
                const style = styleById(r.styleId);
                if (!style) return null;
                const avatar = styleToAvatarProps(style);
                return (
                  <div key={r.id} className="rounded-xl border border-line bg-white p-3 text-center">
                    <div className="flex h-24 items-center justify-center rounded-lg bg-[#8C8C8C]">
                      <FaceAvatar {...avatar} className="h-16 w-auto" />
                    </div>
                    <p className="mt-2 text-[12px] font-medium text-ink">{style.name}</p>
                  </div>
                );
              })}
          </div>
        )}

        {tab === "Compare" && (
          <CompareTab
            consultations={myConsultations}
            recsFor={recsFor}
            styleById={styleById}
            serviceNames={serviceNames}
            selected={compareIds}
            setSelected={setCompareIds}
          />
        )}

        {tab === "Notes" && (
          <Card>
            <p className="text-[13px] font-medium text-ink">Internal notes</p>
            <textarea
              value={notesDraft ?? customer.notes ?? ""}
              onChange={(e) => setNotesDraft(e.target.value)}
              rows={6}
              className="mt-3 w-full rounded-xl border border-line bg-cream px-3 py-2.5 text-[13px] outline-none focus:border-clay/50"
              placeholder="Only visible to staff."
            />
            <button
              onClick={saveNotes}
              className="mt-3 rounded-full bg-ink px-5 py-2 text-[13px] font-medium text-cream"
            >
              Save notes
            </button>
          </Card>
        )}
      </div>
    </div>
  );
}

function CompareTab({
  consultations,
  recsFor,
  styleById,
  serviceNames,
  selected,
  setSelected,
}: {
  consultations: Consultation[];
  recsFor: (id: string) => Recommendation[];
  styleById: (id: string) => Style | undefined;
  serviceNames: (ids: string[]) => string;
  selected: [string, string] | null;
  setSelected: (v: [string, string] | null) => void;
}) {
  if (consultations.length < 2) {
    return <EmptyState title="Need at least two consultations to compare" />;
  }

  const [aId, bId] = selected ?? [consultations[1].id, consultations[0].id];
  const a = consultations.find((c) => c.id === aId)!;
  const b = consultations.find((c) => c.id === bId)!;

  return (
    <div className="grid grid-cols-2 gap-4">
      <CompareColumn c={a} other={bId} consultations={consultations} recsFor={recsFor} styleById={styleById} serviceNames={serviceNames} setSelected={setSelected} />
      <CompareColumn c={b} other={aId} consultations={consultations} recsFor={recsFor} styleById={styleById} serviceNames={serviceNames} setSelected={setSelected} />
    </div>
  );
}

function CompareColumn({
  c,
  other,
  consultations,
  recsFor,
  styleById,
  serviceNames,
  setSelected,
}: {
  c: Consultation;
  other: string;
  consultations: Consultation[];
  recsFor: (id: string) => Recommendation[];
  styleById: (id: string) => Style | undefined;
  serviceNames: (ids: string[]) => string;
  setSelected: (v: [string, string] | null) => void;
}) {
  return (
    <Card>
      <select
        value={c.id}
        onChange={(e) => setSelected([e.target.value, other] as [string, string])}
        className="w-full rounded-lg border border-line bg-cream px-2 py-1.5 text-[13px]"
      >
        {consultations.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {formatDate(opt.date)}
          </option>
        ))}
      </select>
      <div className="mt-3 space-y-2 text-[13px]">
        <p>
          <span className="text-clay">Style preference: </span>
          {c.preferences.stylePreference}
        </p>
        <p>
          <span className="text-clay">Amount of change: </span>
          {["Small", "Moderate", "Big"][c.preferences.amountOfChange]}
        </p>
        <p>
          <span className="text-clay">Services: </span>
          {serviceNames(c.selectedServiceIds) || "—"}
        </p>
        <div>
          <p className="text-clay">Recommendations:</p>
          <ul className="ml-4 list-disc">
            {recsFor(c.id).map((r) => (
              <li key={r.id}>{styleById(r.styleId)?.name}</li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}
