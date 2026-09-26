import { useState } from "react";
import { useRepositoryAll } from "../data/useRepository";
import { businessRepo, customerRepo } from "../data/repositories";
import { Card } from "../components/Card";
import { useSession } from "../session/SessionContext";
import { EmptyState } from "../components/EmptyState";

export function SettingsPage() {
  const businesses = useRepositoryAll(businessRepo);
  const customers = useRepositoryAll(customerRepo);
  const business = businesses[0];
  const { can } = useSession();
  const canManage = can("manageSettings");
  const [name, setName] = useState<string | null>(null);

  if (!business) return null;
  if (!canManage) {
    return <EmptyState title="Settings" description="Your role doesn't have access to this page." />;
  }

  return (
    <div className="max-w-3xl space-y-5">
      <h1 className="text-[22px] font-medium text-ink">Settings</h1>

      <Card>
        <p className="text-[13px] font-medium text-ink">Business</p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <input
            value={name ?? business.name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => name !== null && businessRepo.update(business.id, { name })}
            className="rounded-lg border border-line px-3 py-2 text-[13px]"
          />
          <input value={business.contact.phone} readOnly className="rounded-lg border border-line bg-cream px-3 py-2 text-[13px] text-clay" />
          <input value={business.contact.address} readOnly className="rounded-lg border border-line bg-cream px-3 py-2 text-[13px] text-clay" />
          <input value={business.contact.hours} readOnly className="rounded-lg border border-line bg-cream px-3 py-2 text-[13px] text-clay" />
        </div>
      </Card>

      <Card>
        <p className="text-[13px] font-medium text-ink">AI</p>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-[13px] text-ink">Preview generation</p>
          <button
            onClick={() =>
              businessRepo.update(business.id, {
                aiSettings: { ...business.aiSettings, previewGenerationEnabled: !business.aiSettings.previewGenerationEnabled },
              })
            }
            className={`rounded-full px-3 py-1 text-[12px] font-medium ${
              business.aiSettings.previewGenerationEnabled ? "bg-sage/20 text-sage" : "bg-line text-clay"
            }`}
          >
            {business.aiSettings.previewGenerationEnabled ? "Enabled" : "Disabled"}
          </button>
        </div>
        <p className="mt-3 text-[12px] text-clay">Disclaimer shown with every preview:</p>
        <p className="text-[13px] text-ink">"{business.aiSettings.disclaimer}"</p>
      </Card>

      <Card>
        <p className="text-[13px] font-medium text-ink">Privacy</p>
        <p className="mt-2 text-[13px] text-ink">Data retention: {business.privacy.dataRetentionDays} days</p>
        <p className="mt-1 text-[12px] text-clay">
          Deleting a customer removes their scans, consultations, and recommendations. This cannot be undone.
        </p>
      </Card>

      <Card>
        <p className="text-[13px] font-medium text-ink">Subscription</p>
        <div className="mt-3 grid grid-cols-2 gap-3 text-[13px]">
          <p>
            Plan <span className="ml-2 font-medium capitalize text-ink">{business.subscription.plan}</span>
          </p>
          <p>
            Customers <span className="ml-2 font-medium text-ink">{customers.length}</span>
          </p>
          <p>
            AI scans used <span className="ml-2 font-medium text-ink">{business.subscription.aiScansUsed} / {business.subscription.aiScanLimit}</span>
          </p>
          <p>
            Staff limit <span className="ml-2 font-medium text-ink">{business.subscription.staffLimit}</span>
          </p>
        </div>
      </Card>
    </div>
  );
}
