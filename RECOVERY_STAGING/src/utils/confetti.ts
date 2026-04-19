/**
 * Lightweight confetti utility for celebratory animations
 * Uses canvas to create particle effects without external dependencies
 */

const PARTICLE_COUNT = 150
const PARTICLE_SPEED = 5
const GRAVITY = 0.3

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  color: string
  size: number
  opacity: number
}

/**
 * Triggers confetti effect on a canvas element
 */
export function triggerConfetti(canvas: HTMLCanvasElement | null, colors: string[]) {
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const particles: Particle[] = []
  const width = canvas.width
  const height = canvas.height

  // Create particles
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: width / 2,
      y: height / 2,
      vx: (Math.random() - 0.5) * PARTICLE_SPEED * 2,
      vy: (Math.random() - 0.5) * PARTICLE_SPEED * 2 - 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 4 + 2,
      opacity: Math.random() * 0.5 + 0.5,
    })
  }

  let animationFrame: number

  const animate = () => {
    ctx.clearRect(0, 0, width, height)

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i]

      // Update position
      p.x += p.vx
      p.y += p.vy
      p.vy += GRAVITY

      // Update opacity
      p.opacity -= 0.01

      // Remove if off screen or invisible
      if (p.y > height || p.x < 0 || p.x > width || p.opacity <= 0) {
        particles.splice(i, 1)
        continue
      }

      // Draw particle
      ctx.globalAlpha = p.opacity
      ctx.fillStyle = p.color
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fill()

      // Add some sparkles
      if (Math.random() > 0.9) {
        ctx.strokeStyle = p.color
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(p.x, p.y)
        ctx.lineTo(p.x + Math.random() * 4 - 2, p.y + Math.random() * 4 - 2)
        ctx.stroke()
      }
    }

    ctx.globalAlpha = 1

    if (particles.length > 0) {
      animationFrame = requestAnimationFrame(animate)
    }
  }

  animate()

  return () => {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame)
    }
  }
}

