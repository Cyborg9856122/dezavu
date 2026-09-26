import type { MatchLevel } from "../types/domain";
import { MATCH_LEVEL_LABEL } from "../ai/recommendationEngine";

const STYLES: Record<MatchLevel, string> = {
  strong: "bg-sage text-cream",
  good: "bg-sage-light/40 text-ink",
  consider: "bg-line text-clay",
};

export function MatchBadge({ level }: { level: MatchLevel }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.1em] ${STYLES[level]}`}
    >
      {MATCH_LEVEL_LABEL[level]}
    </span>
  );
}
