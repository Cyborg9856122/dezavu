import { useMemo, useState } from "react";
import { BackLink } from "../components/BackLink";
import { Button } from "../components/Button";
import { FaceAvatar } from "../components/FaceAvatar";
import { styleToAvatarProps } from "../ai/generatePreview";
import { MATCH_LEVEL_LABEL } from "../ai/recommendationEngine";
import { describePreferences } from "../config/activeBusinessType";
import { useRepositoryAll } from "../data/useRepository";
import { consultationRepo, recommendationRepo, scanRepo, serviceRepo, styleRepo } from "../data/repositories";
import { formatDateTime, formatShortDate, timeAgo } from "../lib/format";
import { useI18n } from "../i18n/I18nContext";
import type { Consultation, Customer, Recommendation, Scan, Service, Style } from "../types/domain";

interface ReturningWelcomeProps {
  customer: Customer;
  onBack: () => void;
  /** Starts a new session that reuses the given past session's preferences. */
  onContinuePrevious: (source: Consultation) => void;
  onStartNew: () => void;
}

const isChosen = (r: Recommendation) => r.stylistDecision === "accepted" || r.stylistDecision === "modified";

export function ReturningWelcome({ customer, onBack, onContinuePrevious, onStartNew }: ReturningWelcomeProps) {
  const { t } = useI18n();
  const consultations = useRepositoryAll(consultationRepo);
  const recommendations = useRepositoryAll(recommendationRepo);
  const scans = useRepositoryAll(scanRepo);
  const styles = useRepositoryAll(styleRepo);
  const services = useRepositoryAll(serviceRepo);

  // Every session this customer has had — new or continued, finished or not — newest first.
  const sessions = useMemo(
    () => consultations.filter((c) => c.customerId === customer.id).sort((a, b) => b.date.localeCompare(a.date)),
    [consultations, customer.id],
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = sessions.find((s) => s.id === selectedId) ?? sessions[0];

  const recsFor = (sessionId: string) => recommendations.filter((r) => r.consultationId === sessionId);
  const scanFor = (session: Consultation) => (session.scanId ? scans.find((s) => s.id === session.scanId) : undefined);
  const leadStyleFor = (sessionId: string) => {
    const recs = recsFor(sessionId);
    const lead = recs.find(isChosen) ?? recs[0];
    return lead ? styles.find((s) => s.id === lead.styleId) : undefined;
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col px-6 pb-8 pt-5">
      <BackLink onClick={onBack} />

      <div className="mt-4 min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
        <h1 className="text-[24px] font-light text-cream">
          {t("returning.welcomeBack")}, {customer.name.split(" ")[0]}
        </h1>
        <p className="mt-1 text-[14px] text-cream/50">
          {t("returning.lastVisit")} {timeAgo(customer.lastVisit)}.
        </p>

        {sessions.length > 0 && selected ? (
          <>
            <div className="mt-6 flex items-baseline justify-between">
              <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-cream/40">
                {t("returning.sessionHistory")}
              </p>
              <p className="text-[12px] text-cream/40">
                {sessions.length} {t("search.consultations").toLowerCase()}
              </p>
            </div>

            <div className="-mx-1 mt-3 flex gap-3 overflow-x-auto px-1 pb-2 pt-1" role="listbox" aria-label={t("returning.sessionHistory")}>
              {sessions.map((session) => (
                <SessionThumbnail
                  key={session.id}
                  session={session}
                  scan={scanFor(session)}
                  leadStyle={leadStyleFor(session.id)}
                  active={session.id === selected.id}
                  onSelect={() => setSelectedId(session.id)}
                />
              ))}
            </div>

            <SessionDetails
              key={selected.id}
              session={selected}
              recs={recsFor(selected.id)}
              styles={styles}
              services={services}
            />
          </>
        ) : (
          <p className="mt-5 text-[13px] text-cream/40">{t("returning.noPrevious")}</p>
        )}
      </div>

      <div className="mt-5 flex flex-col gap-3">
        {selected && (
          <Button tone="dark" variant="primary" onClick={() => onContinuePrevious(selected)}>
            {selected.id === sessions[0]?.id ? t("returning.continuePrevious") : t("returning.continueSelected")}
          </Button>
        )}
        <Button tone="dark" variant={selected ? "secondary" : "primary"} onClick={onStartNew}>
          {t("returning.startNew")}
        </Button>
      </div>
    </div>
  );
}

function SessionThumbnail({
  session,
  scan,
  leadStyle,
  active,
  onSelect,
}: {
  session: Consultation;
  scan: Scan | undefined;
  leadStyle: Style | undefined;
  active: boolean;
  onSelect: () => void;
}) {
  const { t } = useI18n();

  return (
    <button
      type="button"
      role="option"
      aria-selected={active}
      onClick={onSelect}
      className={`group w-32 shrink-0 rounded-2xl border p-2 text-start transition-all duration-200 ease-out hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-light ${
        active
          ? "border-sage-light bg-sage-light/10 shadow-[0_6px_20px_-8px_rgba(157,176,127,0.45)]"
          : "border-white/10 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.08]"
      }`}
    >
      <div className="relative flex h-24 items-center justify-center overflow-hidden rounded-xl bg-surround-dark transition-colors duration-200 group-hover:bg-[#383838]">
        {scan?.imageDataUrl ? (
          <img
            src={scan.imageDataUrl}
            alt=""
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <FaceAvatar
            {...(leadStyle ? styleToAvatarProps(leadStyle) : { hairColor: "#5B4A3A", style: "natural" as const })}
            className="h-20 w-auto transition-transform duration-300 group-hover:scale-105"
          />
        )}
        {session.status === "in_progress" && (
          <span className="absolute right-1.5 top-1.5 rounded-full bg-ink/80 px-2 py-0.5 text-[10px] text-cream/70">
            {t("session.status.in_progress")}
          </span>
        )}
      </div>
      <p className={`mt-2 text-[12px] font-medium ${active ? "text-cream" : "text-cream/80 group-hover:text-cream"}`}>
        {formatShortDate(session.date)}
      </p>
      <p className="truncate text-[11px] text-cream/45">{leadStyle?.name ?? "—"}</p>
    </button>
  );
}

function SessionDetails({
  session,
  recs,
  styles,
  services,
}: {
  session: Consultation;
  recs: Recommendation[];
  styles: Style[];
  services: Service[];
}) {
  const { t } = useI18n();
  const prefs = describePreferences(session.preferences);
  const serviceNames = session.selectedServiceIds
    .map((id) => services.find((s) => s.id === id)?.name)
    .filter(Boolean)
    .join(", ");

  return (
    <div className="mt-3 animate-fade-in rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-[14px] font-medium text-cream">{formatDateTime(session.date)}</p>
        <p className="text-[12px] text-cream/50">{t(`session.status.${session.status}`)}</p>
      </div>

      {recs.length > 0 && (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
          {recs.map((r) => {
            const style = styles.find((s) => s.id === r.styleId);
            if (!style) return null;
            const chosen = isChosen(r);
            return (
              <div key={r.id} className={`w-24 shrink-0 text-center ${chosen ? "" : "opacity-45"}`}>
                <div
                  className={`relative flex h-24 items-center justify-center rounded-xl bg-surround-dark ${
                    chosen ? "ring-1 ring-sage-light/70" : ""
                  }`}
                >
                  <FaceAvatar {...styleToAvatarProps(style)} className="h-20 w-auto" />
                  {chosen && (
                    <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-sage-light text-[9px] text-ink">
                      ✓
                    </span>
                  )}
                </div>
                <p className="mt-1.5 text-[12px] leading-tight text-cream/80">{style.name}</p>
                <p className="mt-0.5 text-[10px] uppercase tracking-[0.08em] text-cream/40">
                  {MATCH_LEVEL_LABEL[r.matchLevel]}
                </p>
              </div>
            );
          })}
        </div>
      )}

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-[13px]">
        <div>
          <dt className="text-cream/40">{t("session.lookingFor")}</dt>
          <dd className="text-cream">{prefs.lookingFor}</dd>
        </div>
        <div>
          <dt className="text-cream/40">{t("session.stylePreference")}</dt>
          <dd className="text-cream">{prefs.stylePreference}</dd>
        </div>
        <div>
          <dt className="text-cream/40">{t("session.amountOfChange")}</dt>
          <dd className="text-cream">{prefs.amountOfChange}</dd>
        </div>
        <div>
          <dt className="text-cream/40">{t("session.stylingTime")}</dt>
          <dd className="text-cream">{prefs.stylingTime}</dd>
        </div>
        {serviceNames && (
          <div className="col-span-2">
            <dt className="text-cream/40">{t("session.services")}</dt>
            <dd className="text-cream">{serviceNames}</dd>
          </div>
        )}
        {session.stylistNotes && (
          <div className="col-span-2">
            <dt className="text-cream/40">{t("summary.notes")}</dt>
            <dd className="whitespace-pre-wrap text-cream">{session.stylistNotes}</dd>
          </div>
        )}
      </dl>
    </div>
  );
}
