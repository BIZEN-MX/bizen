"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"

export default function PageLogo() {
  const router = useRouter()

  return (
    <div 
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        cursor: "pointer",
        width: "fit-content",
        padding: "16px 0",
        marginBottom: 24
      }}
      onClick={() => router.push("/courses")}
    >
      <Image 
        src="/bizen-logo.png" 
        alt="BIZEN Logo" 
        width={48} 
        height={48}
        priority
        style={{
          objectFit: "contain"
        }}
      />
      <span style={{
        fontSize: 28,
        fontWeight: 500,
        color: "#0F62FE",
                letterSpacing: "0.5px"
      }}>
        BIZEN
      </span>
    </div>
  )
}

