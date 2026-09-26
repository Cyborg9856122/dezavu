import { useRepositoryAll } from "../data/useRepository";
import { serviceRepo, styleRepo } from "../data/repositories";
import { FaceAvatar } from "../components/FaceAvatar";
import { styleToAvatarProps } from "../ai/generatePreview";
import { useSession } from "../session/SessionContext";

export function StylesPage() {
  const styles = useRepositoryAll(styleRepo);
  const services = useRepositoryAll(serviceRepo);
  const { can } = useSession();
  const canManage = can("manageServices");

  return (
    <div className="max-w-5xl">
      <h1 className="text-[22px] font-medium text-ink">Style Library</h1>
      <p className="text-[13px] text-clay">{styles.length} styles the recommendation engine can suggest.</p>

      <div className="mt-5 grid grid-cols-3 gap-4">
        {styles.map((style) => {
          const avatar = styleToAvatarProps(style);
          const requiredServices = services.filter((s) => style.requiredServiceIds.includes(s.id));
          return (
            <div key={style.id} className="overflow-hidden rounded-2xl border border-line bg-white">
              <div className="flex h-32 items-center justify-center bg-[#2E2E2E]">
                <FaceAvatar {...avatar} className="h-20 w-auto" />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <p className="text-[14px] font-medium text-ink">{style.name}</p>
                  {canManage ? (
                    <button
                      onClick={() => styleRepo.update(style.id, { aiEligible: !style.aiEligible })}
                      className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                        style.aiEligible ? "bg-sage/20 text-sage" : "bg-line text-clay"
                      }`}
                    >
                      {style.aiEligible ? "AI on" : "AI off"}
                    </button>
                  ) : (
                    <span className="text-[11px] text-clay">{style.aiEligible ? "AI on" : "AI off"}</span>
                  )}
                </div>
                <p className="mt-1 text-[12px] text-clay">{style.category} · {style.maintenance} maintenance</p>
                <p className="mt-2 text-[12px] text-clay">{style.description}</p>
                {requiredServices.length > 0 && (
                  <p className="mt-2 text-[11px] text-clay">
                    Requires: {requiredServices.map((s) => s.name).join(", ")}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
