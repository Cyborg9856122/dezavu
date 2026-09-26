export type HairStyle =
  | "natural"
  | "buzz"
  | "crop"
  | "fade"
  | "wave"
  | "long"
  | "curly"
  | "shavedSides";

interface FaceAvatarProps {
  hairColor: string;
  style: HairStyle;
  skinTone?: string;
  className?: string;
}

/**
 * A deliberately abstract stand-in for a customer photo — the same dome
 * silhouette the Brand Guidelines use to demonstrate the neutral surround
 * (2.6), with a simple hair silhouette layered on top to stand in for a
 * "look". This is placeholder art, not a simulated AI render.
 */
export function FaceAvatar({ hairColor, style, skinTone = "#C9A480", className = "" }: FaceAvatarProps) {
  return (
    <svg viewBox="0 0 200 240" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* shoulders */}
      <path d="M10 240 C10 190 55 178 100 178 C145 178 190 190 190 240 Z" fill={skinTone} opacity={0.85} />
      {/* head — dome, matches the guide's neutral-surround illustration */}
      <path d="M55 150 L55 95 C55 51 76 20 100 20 C124 20 145 51 145 95 L145 150 C145 165 124 175 100 175 C76 175 55 165 55 150 Z" fill={skinTone} />

      {style === "natural" && (
        <path d="M55 96 C55 50 76 18 100 18 C124 18 145 50 145 96 L145 112 C138 100 128 92 115 92 C110 92 108 96 100 96 C92 96 90 92 85 92 C72 92 62 100 55 112 Z" fill={hairColor} />
      )}

      {style === "buzz" && (
        <path d="M56 98 C57 55 77 22 100 22 C123 22 143 55 144 98 C132 88 116 84 100 84 C84 84 68 88 56 98 Z" fill={hairColor} opacity={0.92} />
      )}

      {style === "crop" && (
        <path d="M53 104 C51 55 74 16 100 16 C126 16 149 55 147 104 C138 86 120 78 100 78 C80 78 62 86 53 104 Z" fill={hairColor} />
      )}

      {style === "fade" && (
        <>
          <defs>
            <linearGradient id="fadeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={hairColor} />
              <stop offset="75%" stopColor={hairColor} stopOpacity={0.35} />
              <stop offset="100%" stopColor={hairColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <path d="M54 120 C53 58 75 18 100 18 C125 18 147 58 146 120 C140 92 122 80 100 80 C78 80 60 92 54 120 Z" fill="url(#fadeGrad)" />
        </>
      )}

      {style === "wave" && (
        <path
          d="M54 100 C56 54 77 20 100 20 C123 20 144 54 146 100 C141 92 136 98 129 90 C123 83 119 92 112 85 C106 79 103 90 96 84 C89 78 85 90 78 84 C72 79 68 90 61 92 C57 96 55 98 54 100 Z"
          fill={hairColor}
        />
      )}

      {style === "long" && (
        <>
          <path d="M53 105 C51 54 74 16 100 16 C126 16 149 54 147 105 C138 86 120 78 100 78 C80 78 62 86 53 105 Z" fill={hairColor} />
          <path d="M52 108 C46 130 44 165 48 195 L62 195 C58 165 60 132 66 112 Z" fill={hairColor} />
          <path d="M148 108 C154 130 156 165 152 195 L138 195 C142 165 140 132 134 112 Z" fill={hairColor} />
        </>
      )}

      {style === "curly" && (
        <g fill={hairColor}>
          <circle cx="72" cy="50" r="16" />
          <circle cx="96" cy="38" r="18" />
          <circle cx="122" cy="48" r="17" />
          <circle cx="140" cy="70" r="14" />
          <circle cx="60" cy="72" r="14" />
          <circle cx="108" cy="34" r="15" />
        </g>
      )}

      {style === "shavedSides" && (
        <path d="M78 100 C78 56 87 20 100 20 C113 20 122 56 122 100 C122 84 113 76 100 76 C87 76 78 84 78 100 Z" fill={hairColor} />
      )}
    </svg>
  );
}
