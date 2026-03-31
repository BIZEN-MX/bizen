// Reusable Avatar Display Component
import { UserIcon } from "./CustomIcons"
import { dicebearUrl } from "@/lib/avatarOptions"

export const AvatarDisplay = ({ avatar, size = 64, frame }: { avatar: any; size?: number; frame?: "ambassador" | "vip" | null | string }) => {
  const renderContent = () => {
    if (!avatar) {
      return <UserIcon size={size * 0.6} />
    }

    // ── DiceBear illustrated avatars (new system)
    if (avatar.type === "dicebear") {
      const url = dicebearUrl(avatar, Math.max(128, size * 2)) // 2× for retina
      return (
        <div style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          overflow: "hidden",
          background: avatar.backgroundColor ? `#${avatar.backgroundColor}` : "#DBEAFE",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt={avatar.label || "Avatar"}
            width={size}
            height={size}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            loading="lazy"
          />
        </div>
      )
    }

    // Mascot image avatars (local PNGs in /public/avatars/)
    if (avatar.type === "mascot") {
      return (
        <div style={{
          width: "100%",
          height: "100%",
          background: "transparent",
          borderRadius: "50%",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/avatars/${avatar.id}.png`}
            alt={avatar.label || avatar.id}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              mixBlendMode: "normal"
            }}
          />
        </div>
      )
    }

    if (avatar.type === "emoji") {
      return <span style={{ fontSize: size * 0.6 }}>{avatar.value}</span>
    }

    // Gradient avatars
    if (avatar.gradient) {
      return (
        <div style={{
          width: "100%",
          height: "100%",
          background: avatar.gradient,
          borderRadius: "50%"
        }} />
      )
    }

    // Pattern avatars
    if (avatar.pattern) {
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100">
          <defs>
            {avatar.pattern === "dots" && (
              <pattern id={`dots-${avatar.id}-${size}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="3" fill={avatar.color} opacity="0.8" />
              </pattern>
            )}
            {avatar.pattern === "waves" && (
              <pattern id={`waves-${avatar.id}-${size}`} x="0" y="0" width="30" height="15" patternUnits="userSpaceOnUse">
                <path d="M0,7.5 Q7.5,0 15,7.5 T30,7.5" stroke={avatar.color} strokeWidth="2" fill="none" opacity="0.8" />
              </pattern>
            )}
            {avatar.pattern === "grid" && (
              <pattern id={`grid-${avatar.id}-${size}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke={avatar.color} strokeWidth="1" opacity="0.6" />
              </pattern>
            )}
            {avatar.pattern === "diagonal" && (
              <pattern id={`diagonal-${avatar.id}-${size}`} x="0" y="0" width="15" height="15" patternUnits="userSpaceOnUse">
                <path d="M0,15 L15,0" stroke={avatar.color} strokeWidth="2" opacity="0.7" />
              </pattern>
            )}
          </defs>
          <circle cx="50" cy="50" r="48" fill={`url(#${avatar.pattern}-${avatar.id}-${size})`} />
        </svg>
      )
    }

    // Geometric shapes
    if (avatar.shape) {
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="48" fill="rgba(255,255,255,0.1)" />
          {avatar.shape === "triangle" && (
            <polygon points="50,25 75,70 25,70" fill={avatar.color} opacity="0.9" />
          )}
          {avatar.shape === "diamond" && (
            <polygon points="50,20 80,50 50,80 20,50" fill={avatar.color} opacity="0.9" />
          )}
          {avatar.shape === "hexagon" && (
            <polygon points="50,20 75,35 75,65 50,80 25,65 25,35" fill={avatar.color} opacity="0.9" />
          )}
          {avatar.shape === "star" && (
            <polygon
              points="50,15 58,40 85,40 63,55 70,80 50,65 30,80 37,55 15,40 42,40"
              fill={avatar.color}
              opacity="0.9"
            />
          )}
        </svg>
      )
    }

    // Abstract patterns
    if (avatar.abstract) {
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="48" fill="rgba(255,255,255,0.05)" />
          {avatar.abstract === "circles" && (
            <>
              <circle cx="30" cy="35" r="15" fill={avatar.colors[0]} opacity="0.8" />
              <circle cx="65" cy="45" r="18" fill={avatar.colors[1]} opacity="0.7" />
              <circle cx="45" cy="65" r="12" fill={avatar.colors[2]} opacity="0.9" />
            </>
          )}
          {avatar.abstract === "squares" && (
            <>
              <rect x="20" y="25" width="20" height="20" fill={avatar.colors[0]} opacity="0.8" transform="rotate(15 30 35)" />
              <rect x="50" y="35" width="25" height="25" fill={avatar.colors[1]} opacity="0.7" transform="rotate(-10 62 47)" />
              <rect x="30" y="55" width="18" height="18" fill={avatar.colors[2]} opacity="0.9" transform="rotate(25 39 64)" />
            </>
          )}
        </svg>
      )
    }

    // Cartoon characters
    if (avatar.character) {
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="48" fill={avatar.bgColor || "#E0F2FE"} />
          {avatar.character === "robot" && (
            <>
              <rect x="35" y="35" width="30" height="30" fill="#60A5FA" rx="3" />
              <circle cx="42" cy="45" r="3" fill="#1E3A8A" />
              <circle cx="58" cy="45" r="3" fill="#1E3A8A" />
              <rect x="43" y="55" width="14" height="3" fill="#1E3A8A" rx="1" />
              <rect x="30" y="42" width="5" height="2" fill="#60A5FA" />
              <rect x="65" y="42" width="5" height="2" fill="#60A5FA" />
              <circle cx="40" cy="28" r="2" fill="#FBBF24" />
              <circle cx="60" cy="28" r="2" fill="#FBBF24" />
            </>
          )}
          {avatar.character === "astronaut" && (
            <>
              <circle cx="50" cy="45" r="18" fill="#F3F4F6" />
              <ellipse cx="50" cy="45" rx="12" ry="10" fill="#1E3A8A" opacity="0.3" />
              <circle cx="45" cy="42" r="2" fill="#1E3A8A" />
              <circle cx="55" cy="42" r="2" fill="#1E3A8A" />
              <path d="M 45 50 Q 50 53 55 50" stroke="#1E3A8A" strokeWidth="1.5" fill="none" />
              <rect x="35" y="60" width="30" height="15" fill="#EF4444" rx="3" />
              <circle cx="50" cy="30" r="3" fill="#FBBF24" />
            </>
          )}
          {avatar.character === "wizard" && (
            <>
              <circle cx="50" cy="50" r="15" fill="#F59E0B" />
              <circle cx="45" cy="48" r="2" fill="#1F2937" />
              <circle cx="55" cy="48" r="2" fill="#1F2937" />
              <path d="M 45 55 Q 50 57 55 55" stroke="#1F2937" strokeWidth="1.5" fill="none" />
              <polygon points="50,25 45,40 55,40" fill="#8B5CF6" />
              <circle cx="50" cy="27" r="2" fill="#FBBF24" />
            </>
          )}
          {avatar.character === "cat" && (
            <>
              <circle cx="50" cy="52" r="18" fill="#F97316" />
              <polygon points="35,40 38,30 42,38" fill="#F97316" />
              <polygon points="65,40 62,30 58,38" fill="#F97316" />
              <circle cx="43" cy="50" r="3" fill="#1F2937" />
              <circle cx="57" cy="50" r="3" fill="#1F2937" />
              <circle cx="43" cy="50" r="1.5" fill="#FFF" />
              <circle cx="57" cy="50" r="1.5" fill="#FFF" />
            </>
          )}
          {avatar.character === "dog" && (
            <>
              <circle cx="50" cy="52" r="18" fill="#92400E" />
              <ellipse cx="35" cy="48" rx="8" ry="12" fill="#92400E" />
              <ellipse cx="65" cy="48" rx="8" ry="12" fill="#92400E" />
              <circle cx="43" cy="50" r="3" fill="#1F2937" />
              <circle cx="57" cy="50" r="3" fill="#1F2937" />
            </>
          )}
        </svg>
      )
    }

    return <UserIcon size={size * 0.6} />
  }

  const frameColor = frame === "vip" ? "#d97706" : frame === "ambassador" ? "#0F62FE" : null

  return (
    <div style={{
      width: size,
      height: size,
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      {/* Frame Wrapper */}
      {frameColor && (
        <div style={{
          position: "absolute",
          inset: -4,
          borderRadius: "50%",
          border: `3px solid ${frameColor}`,
          boxShadow: `0 0 15px ${frameColor}50, inset 0 0 10px ${frameColor}30`,
          zIndex: 1,
          pointerEvents: "none"
        }} />
      )}

      {/* Inner Avatar */}
      <div style={{
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        zIndex: 0
      }}>
        {renderContent()}
      </div>
    </div>
  )
}
