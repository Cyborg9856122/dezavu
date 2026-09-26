import { Link } from "react-router-dom";
import { useRepositoryAll } from "../data/useRepository";
import { consultationRepo, customerRepo, recommendationRepo, styleRepo } from "../data/repositories";
import { formatDate } from "../lib/format";
import { EmptyState } from "../components/EmptyState";
import { MatchBadge } from "../components/Badge";

export function ConsultationsPage() {
  const consultations = useRepositoryAll(consultationRepo);
  const customers = useRepositoryAll(customerRepo);
  const recommendations = useRepositoryAll(recommendationRepo);
  const styles = useRepositoryAll(styleRepo);

  const sorted = [...consultations].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="max-w-4xl">
      <h1 className="text-[22px] font-medium text-ink">Consultations</h1>
      <p className="text-[13px] text-clay">{consultations.length} total</p>

      <div className="mt-5 overflow-hidden rounded-2xl border border-line bg-white">
        {sorted.length === 0 && <EmptyState title="No consultations yet" />}
        {sorted.map((c) => {
          const customer = customers.find((x) => x.id === c.customerId);
          const topRec = recommendations.find((r) => c.recommendationIds.includes(r.id));
          const style = topRec ? styles.find((s) => s.id === topRec.styleId) : undefined;
          return (
            <Link
              key={c.id}
              to={`/admin/consultations/${c.id}`}
              className="flex items-center justify-between border-b border-line px-5 py-4 last:border-0 hover:bg-cream"
            >
              <div>
                <p className="text-[14px] font-medium text-ink">{customer?.name ?? "Unknown customer"}</p>
                <p className="text-[12px] text-clay">{formatDate(c.date)}</p>
              </div>
              <div className="flex items-center gap-3">
                {style && <span className="text-[13px] text-clay">{style.name}</span>}
                {topRec && <MatchBadge level={topRec.matchLevel} />}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
