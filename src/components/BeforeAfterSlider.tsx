import { useRef, useState, type ReactNode } from "react";
import { Chip } from "./Chip";

interface BeforeAfterSliderProps {
  before: ReactNode;
  after: ReactNode;
  className?: string;
}

/** A draggable before/after comparison — divider position is % from the left. */
export function BeforeAfterSlider({ before, after, className = "" }: BeforeAfterSliderProps) {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  function updateFromClientX(clientX: number) {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setSliderPos(Math.min(100, Math.max(0, pct)));
  }

  function handlePointerDown(e: React.PointerEvent) {
    dragging.current = true;
    updateFromClientX(e.clientX);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  }

  function handlePointerMove(e: PointerEvent) {
    if (!dragging.current) return;
    updateFromClientX(e.clientX);
  }

  function handlePointerUp() {
    dragging.current = false;
    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointerup", handlePointerUp);
  }

  return (
    <div
      ref={containerRef}
      className={`relative touch-none select-none overflow-hidden rounded-2xl bg-[#2E2E2E] ${className}`}
    >
      <div className="absolute inset-0 flex items-center justify-center">{after}</div>

      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
      >
        {before}
      </div>

      <Chip tone="dark" className="absolute left-3 top-3">
        Before
      </Chip>
      <Chip tone="dark" accent className="absolute right-3 top-3">
        After
      </Chip>

      <div className="absolute inset-y-0 w-px bg-sage-light/80" style={{ left: `${sliderPos}%` }} />
      <div
        onPointerDown={handlePointerDown}
        className="absolute top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full bg-sage-light shadow-lg"
        style={{ left: `${sliderPos}%` }}
      >
        <span className="text-[10px] text-ink">↔</span>
      </div>
    </div>
  );
}
