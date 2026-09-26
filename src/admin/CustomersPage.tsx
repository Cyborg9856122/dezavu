import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useRepositoryAll } from "../data/useRepository";
import { customerRepo } from "../data/repositories";
import { timeAgo } from "../lib/format";
import { EmptyState } from "../components/EmptyState";

export function CustomersPage() {
  const customers = useRepositoryAll(customerRepo);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter(
      (c) => c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.id.toLowerCase().includes(q),
    );
  }, [customers, query]);

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-medium text-ink">Customers</h1>
          <p className="text-[13px] text-clay">{customers.length} total</p>
        </div>
      </div>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by name, phone, or customer ID"
        className="mt-5 w-full rounded-xl border border-line bg-white px-4 py-3 text-[14px] outline-none focus:border-clay/50"
      />

      <div className="mt-5 overflow-hidden rounded-2xl border border-line bg-white">
        {filtered.length === 0 && <EmptyState title="No customers found" description="Try a different search." />}
        {filtered.map((c) => (
          <Link
            key={c.id}
            to={`/admin/customers/${c.id}`}
            className="flex items-center justify-between border-b border-line px-5 py-4 last:border-0 hover:bg-cream"
          >
            <div>
              <p className="text-[14px] font-medium text-ink">{c.name}</p>
              <p className="text-[12px] text-clay">{c.phone}</p>
            </div>
            <div className="text-right">
              <p className="text-[12px] text-clay">Last visit {timeAgo(c.lastVisit)}</p>
              <p className="text-[12px] text-clay">{c.consultationCount} consultations</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
