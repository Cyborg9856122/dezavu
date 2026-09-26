import { useEffect, useRef, useState } from "react";
import { BackLink } from "../../components/BackLink";
import { Button } from "../../components/Button";
import { FaceAvatar } from "../../components/FaceAvatar";
import { useI18n } from "../../i18n/I18nContext";

interface FaceScanStepProps {
  onBack: () => void;
  onCaptured: (imageDataUrl: string | null, capturedWithCamera: boolean) => void;
}

const TIPS_KEYS = ["scan.tip.direct", "scan.tip.remove", "scan.tip.lighting", "scan.tip.neutral", "scan.tip.guide"];

export function FaceScanStep({ onBack, onCaptured }: FaceScanStepProps) {
  const { t } = useI18n();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [captured, setCaptured] = useState<string | null>(null);
  const [capturing, setCapturing] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setCameraReady(false);
    setCameraError(false);
    async function start() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError(true);
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setCameraReady(true);
      } catch {
        setCameraError(true);
      }
    }
    start();
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [attempt]);

  function stopCamera() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
  }

  function handleStartScan() {
    if (!cameraReady || !videoRef.current) return;
    setCapturing(true);
    window.setTimeout(() => {
      const video = videoRef.current!;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(video, 0, 0);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
      stopCamera();
      setCaptured(dataUrl);
      setCapturing(false);
    }, 600);
  }

  function handleRetake() {
    setCaptured(null);
    setAttempt((n) => n + 1);
  }

  if (captured) {
    return (
      <div className="flex min-h-0 flex-1 flex-col px-6 pb-6 pt-5">
        <BackLink onClick={onBack} />
        <div className="mt-4 flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-2xl bg-[#2E2E2E]">
          <img src={captured} alt="Captured scan" className="h-full w-full object-cover" />
        </div>
        <div className="mt-4 flex gap-3">
          <Button tone="dark" variant="secondary" onClick={handleRetake}>
            {t("common.retake")}
          </Button>
          <Button tone="dark" variant="primary" onClick={() => onCaptured(captured, true)}>
            {t("common.continue")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col px-6 pb-6 pt-5">
      <BackLink onClick={onBack} />
      <h1 className="mt-4 text-[22px] font-normal text-cream">{t("scan.title")}</h1>

      <ul className="mt-3 space-y-1">
        {TIPS_KEYS.map((k) => (
          <li key={k} className="flex items-center gap-2 text-[13px] text-cream/50">
            <span className="h-1 w-1 rounded-full bg-cream/40" />
            {t(k)}
          </li>
        ))}
      </ul>

      <div className="relative mt-4 flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-2xl bg-[#2E2E2E]">
        {cameraError ? (
          <div className="flex flex-col items-center gap-4 px-8 text-center">
            <FaceAvatar hairColor="#5B4A3A" style="natural" className="h-40 w-auto opacity-60" />
            <p className="text-[13px] text-cream/60">{t("scan.cameraUnavailable")}</p>
          </div>
        ) : (
          <>
            <video ref={videoRef} muted playsInline className="h-full w-full object-cover" />
            <svg viewBox="0 0 200 240" className="pointer-events-none absolute h-[80%]" fill="none">
              <path
                d="M55 150 L55 95 C55 51 76 20 100 20 C124 20 145 51 145 95 L145 150 C145 175 124 195 100 195 C76 195 55 175 55 150 Z"
                stroke="#9DB07F"
                strokeWidth="2"
                strokeDasharray="6 6"
                opacity={0.8}
              />
            </svg>
            {capturing && <div className="absolute inset-0 bg-cream/90" />}
          </>
        )}
      </div>

      <div className="mt-4">
        {cameraError ? (
          <Button tone="dark" onClick={() => onCaptured(null, false)}>
            {t("scan.usePlaceholder")}
          </Button>
        ) : (
          <Button tone="dark" onClick={handleStartScan} disabled={!cameraReady || capturing}>
            {t("scan.start")}
          </Button>
        )}
      </div>
    </div>
  );
}
