import { useMemo } from "react";
import { StatTile } from "../components/StatTile";
import { Card } from "../components/Card";
import { useRepositoryAll } from "../data/useRepository";
import {
  consultationRepo,
  customerRepo,
  recommendationRepo,
  scanRepo,
  serviceRepo,
  styleRepo,
} from "../data/repositories";
import { isWithinDays } from "../lib/format";

export function DashboardPage() {
  const customers = useRepositoryAll(customerRepo);
  const consultations = useRepositoryAll(consultationRepo);
  const scans = useRepositoryAll(scanRepo);
  const recommendations = useRepositoryAll(recommendationRepo);
  const services = useRepositoryAll(serviceRepo);
  const styles = useRepositoryAll(styleRepo);

  const today = useMemo(
    () => ({
      newCustomers: customers.filter((c) => isWithinDays(c.createdAt, 1)).length,
      existingSeen: consultations.filter((c) => isWithinDays(c.date, 1)).length,
      scans: scans.filter((s) => isWithinDays(s.date, 1)).length,
    }),
    [customers, consultations, scans],
  );

  const metrics = useMemo(
    () => ({
      total: customers.length,
      newThisMonth: customers.filter((c) => isWithinDays(c.createdAt, 30)).length,
      returning: customers.filter((c) => c.consultationCount > 1).length,
    }),
    [customers],
  );

  const topServices = useMemo(() => {
    const counts = new Map<string, number>();
    consultations.forEach((c) => c.selectedServiceIds.forEach((id) => counts.set(id, (counts.get(id) ?? 0) + 1)));
    return [...counts.entries()]
      .map(([serviceId, count]) => ({ service: services.find((s) => s.id === serviceId), count }))
      .filter((x) => x.service)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [consultations, services]);

  const topStyles = useMemo(() => {
    const counts = new Map<string, number>();
    recommendations.forEach((r) => counts.set(r.styleId, (counts.get(r.styleId) ?? 0) + 1));
    return [...counts.entries()]
      .map(([styleId, count]) => ({ style: styles.find((s) => s.id === styleId), count }))
      .filter((x) => x.style)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [recommendations, styles]);

  const decisionCounts = useMemo(() => {
    const accepted = recommendations.filter((r) => r.stylistDecision === "accepted").length;
    const rejected = recommendations.filter((r) => r.stylistDecision === "rejected").length;
    return { accepted, rejected };
  }, [recommendations]);

  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <h1 className="text-[22px] font-medium text-ink">Dashboard</h1>
        <p className="text-[13px] text-clay">An overview of today and how demand is trending.</p>
      </div>

      <section>
        <h2 className="mb-3 text-[13px] font-medium uppercase tracking-[0.08em] text-clay">Today's Activity</h2>
        <div className="grid grid-cols-3 gap-4">
          <StatTile label="New customers" value={today.newCustomers} />
          <StatTile label="Consultations" value={today.existingSeen} />
          <StatTile label="Scans" value={today.scans} />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-[13px] font-medium uppercase tracking-[0.08em] text-clay">Customer Metrics</h2>
        <div className="grid grid-cols-3 gap-4">
          <StatTile label="Total customers" value={metrics.total} />
          <StatTile label="New this month" value={metrics.newThisMonth} />
          <StatTile label="Returning customers" value={metrics.returning} />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-[13px] font-medium uppercase tracking-[0.08em] text-clay">AI Insights</h2>
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <p className="text-[13px] font-medium text-ink">Most recommended styles</p>
            <ul className="mt-3 space-y-2">
              {topStyles.length === 0 && <li className="text-[13px] text-clay">No data yet.</li>}
              {topStyles.map(({ style, count }) => (
                <li key={style!.id} className="flex items-center justify-between text-[13px]">
                  <span className="text-ink">{style!.name}</span>
                  <span className="text-clay">{count}</span>
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <p className="text-[13px] font-medium text-ink">Most requested services</p>
            <ul className="mt-3 space-y-2">
              {topServices.length === 0 && <li className="text-[13px] text-clay">No data yet.</li>}
              {topServices.map(({ service, count }) => (
                <li key={service!.id} className="flex items-center justify-between text-[13px]">
                  <span className="text-ink">{service!.name}</span>
                  <span className="text-clay">{count}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <StatTile label="Recommendations accepted" value={decisionCounts.accepted} />
          <StatTile label="Recommendations rejected" value={decisionCounts.rejected} />
        </div>
      </section>
    </div>
  );
}
