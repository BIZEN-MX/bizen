export function ThreadCardSkeleton() {
  return (
    <div style={{
      padding: 24,
      background: "rgba(255, 255, 255, 0.4)",
      backdropFilter: "blur(20px)",
      borderRadius: 16,
      border: "2px solid rgba(255, 255, 255, 0.6)",
      animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
    }}>
      <div style={{ display: "flex", gap: 20 }}>
        {/* Vote skeleton */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          minWidth: 60
        }}>
          <div style={{
            width: 40,
            height: 28,
            background: "rgba(156, 163, 175, 0.3)",
            borderRadius: 6
          }} />
          <div style={{
            width: 30,
            height: 12,
            background: "rgba(156, 163, 175, 0.3)",
            borderRadius: 4
          }} />
        </div>

        {/* Content skeleton */}
        <div style={{ flex: 1 }}>
          {/* Title */}
          <div style={{
            height: 24,
            background: "rgba(156, 163, 175, 0.3)",
            borderRadius: 6,
            marginBottom: 12,
            width: "80%"
          }} />
          
          {/* Description lines */}
          <div style={{
            height: 16,
            background: "rgba(156, 163, 175, 0.2)",
            borderRadius: 4,
            marginBottom: 8,
            width: "95%"
          }} />
          <div style={{
            height: 16,
            background: "rgba(156, 163, 175, 0.2)",
            borderRadius: 4,
            marginBottom: 16,
            width: "85%"
          }} />
          
          {/* Meta */}
          <div style={{ display: "flex", gap: 16 }}>
            <div style={{
              width: 80,
              height: 14,
              background: "rgba(156, 163, 175, 0.2)",
              borderRadius: 4
            }} />
            <div style={{
              width: 100,
              height: 14,
              background: "rgba(156, 163, 175, 0.2)",
              borderRadius: 4
            }} />
            <div style={{
              width: 90,
              height: 14,
              background: "rgba(156, 163, 175, 0.2)",
              borderRadius: 4
            }} />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  )
}

export function CommentSkeleton() {
  return (
    <div style={{
      padding: 20,
      background: "rgba(255, 255, 255, 0.6)",
      backdropFilter: "blur(20px)",
      borderRadius: 12,
      border: "2px solid rgba(255, 255, 255, 0.6)",
      marginBottom: 16,
      animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
    }}>
      <div style={{ display: "flex", gap: 16 }}>
        {/* Vote buttons */}
        <div style={{
          width: 40,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8
        }}>
          <div style={{
            width: 32,
            height: 24,
            background: "rgba(156, 163, 175, 0.3)",
            borderRadius: 6
          }} />
          <div style={{
            width: 32,
            height: 20,
            background: "rgba(156, 163, 175, 0.3)",
            borderRadius: 4
          }} />
          <div style={{
            width: 32,
            height: 24,
            background: "rgba(156, 163, 175, 0.3)",
            borderRadius: 6
          }} />
        </div>

        {/* Content */}
        <div style={{ flex: 1 }}>
          <div style={{
            height: 14,
            background: "rgba(156, 163, 175, 0.2)",
            borderRadius: 4,
            marginBottom: 8,
            width: "100%"
          }} />
          <div style={{
            height: 14,
            background: "rgba(156, 163, 175, 0.2)",
            borderRadius: 4,
            marginBottom: 8,
            width: "95%"
          }} />
          <div style={{
            height: 14,
            background: "rgba(156, 163, 175, 0.2)",
            borderRadius: 4,
            marginBottom: 12,
            width: "70%"
          }} />
          
          {/* Meta */}
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{
              width: 70,
              height: 12,
              background: "rgba(156, 163, 175, 0.2)",
              borderRadius: 4
            }} />
            <div style={{
              width: 80,
              height: 12,
              background: "rgba(156, 163, 175, 0.2)",
              borderRadius: 4
            }} />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  )
}

