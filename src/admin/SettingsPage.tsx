import { useState } from "react";
import { useRepositoryAll } from "../data/useRepository";
import { businessRepo, customerRepo } from "../data/repositories";
import { Card } from "../components/Card";
import { useSession } from "../session/SessionContext";
import { EmptyState } from "../components/EmptyState";
import { useAppearance } from "../data/useAppearance";
import type { ThemeMode } from "../types/domain";

const THEME_OPTIONS: { value: ThemeMode; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

/** Fixed swatch colours so each preview shows the real mode regardless of the current theme. */
const PREVIEW: Record<ThemeMode, { bg: string; bar: string; accent: string }> = {
  light: { bg: "#f7f5f1", bar: "#e6e2db", accent: "#566349" },
  dark: { bg: "#1a1917", bar: "#3a3833", accent: "#9db07f" },
};

function ThemeSetting({
  label,
  description,
  value,
  onChange,
}: {
  label: string;
  description: string;
  value: ThemeMode;
  onChange: (value: ThemeMode) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-[13px] text-ink">{label}</p>
        <p className="text-[12px] text-clay">{description}</p>
      </div>
      <div className="flex gap-2" role="radiogroup" aria-label={`${label} theme`}>
        {THEME_OPTIONS.map((opt) => {
          const active = value === opt.value;
          const p = PREVIEW[opt.value];
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(opt.value)}
              className={`flex items-center gap-2 rounded-xl border px-2.5 py-2 text-[12px] font-medium transition-colors ${
                active ? "border-sage bg-sage/10 text-ink" : "border-line text-clay hover:border-clay/40 hover:text-ink"
              }`}
            >
              <span
                aria-hidden
                className="flex h-7 w-10 flex-col justify-end gap-0.5 rounded-md border border-line p-1"
                style={{ background: p.bg }}
              >
                <span className="h-1 w-6 rounded-full" style={{ background: p.bar }} />
                <span className="h-1.5 w-full rounded-full" style={{ background: p.accent }} />
              </span>
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function SettingsPage() {
  const businesses = useRepositoryAll(businessRepo);
  const customers = useRepositoryAll(customerRepo);
  const business = businesses[0];
  const { can } = useSession();
  const canManage = can("manageSettings");
  const [name, setName] = useState<string | null>(null);
  const appearance = useAppearance();

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
        <p className="text-[13px] font-medium text-ink">Appearance</p>
        <p className="mt-1 text-[12px] text-clay">Applies on every device for this business.</p>
        <div className="mt-4 space-y-4">
          <ThemeSetting
            label="Kiosk"
            description="What customers see"
            value={appearance.kioskTheme}
            onChange={(kioskTheme) => businessRepo.update(business.id, { appearance: { ...appearance, kioskTheme } })}
          />
          <ThemeSetting
            label="Admin"
            description="This dashboard"
            value={appearance.adminTheme}
            onChange={(adminTheme) => businessRepo.update(business.id, { appearance: { ...appearance, adminTheme } })}
          />
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
