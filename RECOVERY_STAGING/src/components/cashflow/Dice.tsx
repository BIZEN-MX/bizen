import { motion, useAnimationControls } from "framer-motion"
import { useEffect } from "react"

type DiceProps = {
  isRolling: boolean
  result: number | null
  size?: number
}

const FACE_ROTATIONS: Record<number, { rotateX: number; rotateY: number; rotateZ: number }> = {
  1: { rotateX: 0, rotateY: 0, rotateZ: 0 },
  2: { rotateX: -90, rotateY: 0, rotateZ: 0 },
  3: { rotateX: 0, rotateY: -90, rotateZ: 0 },
  4: { rotateX: 0, rotateY: 90, rotateZ: 0 },
  5: { rotateX: 90, rotateY: 0, rotateZ: 0 },
  6: { rotateX: 180, rotateY: 0, rotateZ: 0 }
}

const DOT_POSITIONS: Record<number, Array<{ top: string; left: string }>> = {
  1: [{ top: "50%", left: "50%" }],
  2: [
    { top: "25%", left: "25%" },
    { top: "75%", left: "75%" }
  ],
  3: [
    { top: "20%", left: "20%" },
    { top: "50%", left: "50%" },
    { top: "80%", left: "80%" }
  ],
  4: [
    { top: "25%", left: "25%" },
    { top: "25%", left: "75%" },
    { top: "75%", left: "25%" },
    { top: "75%", left: "75%" }
  ],
  5: [
    { top: "20%", left: "20%" },
    { top: "20%", left: "80%" },
    { top: "50%", left: "50%" },
    { top: "80%", left: "20%" },
    { top: "80%", left: "80%" }
  ],
  6: [
    { top: "20%", left: "25%" },
    { top: "50%", left: "25%" },
    { top: "80%", left: "25%" },
    { top: "20%", left: "75%" },
    { top: "50%", left: "75%" },
    { top: "80%", left: "75%" }
  ]
}

export default function Dice({ isRolling, result, size = 70 }: DiceProps) {
  const controls = useAnimationControls()
  const finalResult = result ?? 1

  useEffect(() => {
    const runAnimation = async () => {
      if (isRolling) {
        await controls.start({
          rotateX: 540 + Math.random() * 360,
          rotateY: 720 + Math.random() * 360,
          rotateZ: 90 + Math.random() * 180,
          transition: {
            duration: 1.1,
            ease: [0.42, 0.0, 0.58, 1.0]
          }
        })
        await controls.start({
          ...FACE_ROTATIONS[finalResult],
          transition: {
            duration: 0.5,
            ease: [0.25, 0.8, 0.25, 1]
          }
        })
      } else {
        controls.set(FACE_ROTATIONS[finalResult])
      }
    }

    runAnimation()
  }, [isRolling, finalResult, controls])

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <div style={{
        width: size,
        height: size,
        perspective: 900
      }}>
        <motion.div
          animate={controls}
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            transformStyle: "preserve-3d"
          }}
        >
          {[1, 2, 3, 4, 5, 6].map((face) => (
            <div
              key={face}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                background: "linear-gradient(145deg, #fff, #f3f4f6)",
                borderRadius: 18,
                border: "4px solid #e5e7eb",
                boxShadow: "inset 0 2px 6px rgba(0,0,0,0.08), 0 10px 25px rgba(15,23,42,0.2)",
                transform: getFaceTransform(face, size / 2),
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <div style={{ position: "relative", width: "70%", height: "70%" }}>
                {DOT_POSITIONS[face].map((dot, index) => (
                  <div
                    key={index}
                    style={{
                      position: "absolute",
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "#0f172a",
                      top: dot.top,
                      left: dot.left,
                      transform: "translate(-50%, -50%)",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
      <div style={{ fontSize: 12, fontWeight: 500, color: "#1f2937" }}>
        {isRolling ? "Tirando..." : `Resultado: ${finalResult}`}
      </div>
    </div>
  )
}

function getFaceTransform(face: number, translate: number) {
  switch (face) {
    case 1:
      return `rotateY(0deg) translateZ(${translate}px)`
    case 2:
      return `rotateX(90deg) translateZ(${translate}px)`
    case 3:
      return `rotateY(90deg) translateZ(${translate}px)`
    case 4:
      return `rotateY(-90deg) translateZ(${translate}px)`
    case 5:
      return `rotateX(-90deg) translateZ(${translate}px)`
    case 6:
      return `rotateX(180deg) translateZ(${translate}px)`
    default:
      return `rotateY(0deg) translateZ(${translate}px)`
  }
}

