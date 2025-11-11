import * as React from "react"

export default function Card(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      style={{
        borderRadius: 16,
        border: "1px solid rgba(0,0,0,0.08)",
        boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
        background: "#fff",
        padding: 24,
        minWidth: 0,
        overflow: "hidden" as const,
        ...(props.style || {}),
      }}
    />
  )
}


