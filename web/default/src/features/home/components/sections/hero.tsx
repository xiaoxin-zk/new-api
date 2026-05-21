/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import { useCallback, useEffect, useRef } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { HeroTerminalDemo } from '../hero-terminal-demo'

interface HeroProps {
  className?: string
  isAuthenticated?: boolean
}

interface Star {
  x: number
  y: number
  radius: number
  baseOpacity: number
  phase: number
  twinkleSpeed: number
  driftX: number
  driftY: number
}

interface NetworkParticle {
  x: number
  y: number
  radius: number
  opacity: number
  vx: number
  vy: number
  phase: number
}

const STAR_COUNT = 180
const NETWORK_PARTICLE_COUNT = 7
const MAX_NETWORK_DISTANCE = 190

function createStars(width: number, height: number): Star[] {
  return Array.from({ length: STAR_COUNT }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: 0.5 + Math.random() * 1.5,
    baseOpacity: 0.35 + Math.random() * 0.65,
    phase: Math.random() * Math.PI * 2,
    twinkleSpeed: 0.0012 + Math.random() * 0.0024,
    driftX: (Math.random() - 0.5) * 0.018,
    driftY: (Math.random() - 0.5) * 0.012,
  }))
}

function createNetworkParticles(
  width: number,
  height: number,
): NetworkParticle[] {
  return Array.from({ length: NETWORK_PARTICLE_COUNT }, () => ({
    x: width * (0.12 + Math.random() * 0.76),
    y: height * (0.12 + Math.random() * 0.72),
    radius: 2.2 + Math.random() * 2.2,
    opacity: 0.55 + Math.random() * 0.35,
    vx: (Math.random() - 0.5) * 0.12,
    vy: (Math.random() - 0.5) * 0.1,
    phase: Math.random() * Math.PI * 2,
  }))
}

export function Hero({ className, isAuthenticated = false }: HeroProps) {
  const { t } = useTranslation()
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const drawScene = useCallback(
    (
      context: CanvasRenderingContext2D,
      stars: Star[],
      particles: NetworkParticle[],
      width: number,
      height: number,
      time: number,
      delta: number,
    ) => {
      context.clearRect(0, 0, width, height)

      // Draw stars
      for (const star of stars) {
        star.x += star.driftX * delta
        star.y += star.driftY * delta
        if (star.x < -4) star.x = width + 4
        if (star.x > width + 4) star.x = -4
        if (star.y < -4) star.y = height + 4
        if (star.y > height + 4) star.y = -4

        const twinkle =
          0.55 + Math.sin(time * star.twinkleSpeed + star.phase) * 0.45
        const opacity = Math.max(0.08, star.baseOpacity * twinkle)

        context.beginPath()
        context.fillStyle = `rgba(210, 230, 255, ${opacity})`
        context.shadowColor = 'rgba(96, 165, 250, 0.8)'
        context.shadowBlur = star.radius > 1.4 ? 8 : 3
        context.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        context.fill()
      }
      context.shadowBlur = 0

      // Move particles
      for (const p of particles) {
        p.x += p.vx * delta
        p.y += p.vy * delta
        if (p.x < 24 || p.x > width - 24) p.vx *= -1
        if (p.y < 24 || p.y > height - 24) p.vy *= -1
        p.x = Math.min(Math.max(p.x, 24), width - 24)
        p.y = Math.min(Math.max(p.y, 24), height - 24)
      }

      // Draw network lines between nearby particles
      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const a = particles[i]
          const b = particles[j]
          const dist = Math.hypot(a.x - b.x, a.y - b.y)
          if (dist < MAX_NETWORK_DISTANCE) {
            const lineOpacity = (1 - dist / MAX_NETWORK_DISTANCE) * 0.22
            const grad = context.createLinearGradient(a.x, a.y, b.x, b.y)
            grad.addColorStop(0, `rgba(56, 189, 248, ${lineOpacity})`)
            grad.addColorStop(0.5, `rgba(139, 92, 246, ${lineOpacity * 1.25})`)
            grad.addColorStop(1, `rgba(217, 70, 239, ${lineOpacity})`)
            context.beginPath()
            context.strokeStyle = grad
            context.lineWidth = 1
            context.moveTo(a.x, a.y)
            context.lineTo(b.x, b.y)
            context.stroke()
          }
        }
      }

      // Draw particle glows + cores
      for (const p of particles) {
        const pulse = 0.72 + Math.sin(time * 0.002 + p.phase) * 0.28
        const pOpacity = p.opacity * pulse

        const glow = context.createRadialGradient(
          p.x,
          p.y,
          0,
          p.x,
          p.y,
          p.radius * 8,
        )
        glow.addColorStop(0, `rgba(125, 211, 252, ${pOpacity * 0.42})`)
        glow.addColorStop(0.42, `rgba(139, 92, 246, ${pOpacity * 0.18})`)
        glow.addColorStop(1, 'rgba(139, 92, 246, 0)')
        context.beginPath()
        context.fillStyle = glow
        context.arc(p.x, p.y, p.radius * 8, 0, Math.PI * 2)
        context.fill()

        context.beginPath()
        context.fillStyle = `rgba(224, 242, 254, ${pOpacity})`
        context.shadowColor = 'rgba(96, 165, 250, 0.95)'
        context.shadowBlur = 14
        context.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        context.fill()
      }
      context.shadowBlur = 0

      // Subtle central nebula glow
      const nebula = context.createRadialGradient(
        width * 0.5,
        height * 0.38,
        0,
        width * 0.5,
        height * 0.38,
        Math.max(width, height) * 0.62,
      )
      nebula.addColorStop(0, 'rgba(59, 130, 246, 0.055)')
      nebula.addColorStop(0.42, 'rgba(124, 58, 237, 0.035)')
      nebula.addColorStop(1, 'rgba(0, 0, 0, 0)')
      context.globalCompositeOperation = 'lighter'
      context.fillStyle = nebula
      context.fillRect(0, 0, width, height)
      context.globalCompositeOperation = 'source-over'
    },
    [],
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let rafId = 0
    let width = 0
    let height = 0
    let stars: Star[] = []
    let particles: NetworkParticle[] = []
    let lastTime = performance.now()

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = Math.max(1, rect.width)
      height = Math.max(1, rect.height)
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      stars = createStars(width, height)
      particles = createNetworkParticles(width, height)
    }

    const animate = (time: number) => {
      const delta = Math.min(48, time - lastTime)
      lastTime = time
      drawScene(ctx, stars, particles, width, height, time, delta)
      rafId = window.requestAnimationFrame(animate)
    }

    resize()
    rafId = window.requestAnimationFrame(animate)

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    return () => {
      window.cancelAnimationFrame(rafId)
      ro.disconnect()
    }
  }, [drawScene])

  return (
    <section
      className={[
        'relative isolate overflow-hidden px-4 py-24 sm:px-6 sm:py-28 lg:px-8 lg:py-32',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ backgroundColor: 'oklch(0.06 0.02 250)' }}
    >
      {/* Animated starfield canvas */}
      <canvas
        ref={canvasRef}
        aria-hidden='true'
        className='pointer-events-none absolute inset-0 z-0 h-full w-full'
      />

      {/* Nebula gradient overlays */}
      <div
        aria-hidden='true'
        className='pointer-events-none absolute inset-0 z-[1] opacity-90'
        style={{
          background:
            'radial-gradient(circle at 18% 22%, rgba(37,99,235,0.24), transparent 34%), radial-gradient(circle at 78% 18%, rgba(168,85,247,0.2), transparent 32%), radial-gradient(circle at 50% 78%, rgba(14,165,233,0.14), transparent 42%), linear-gradient(180deg,rgba(2,6,23,0.1),rgba(2,6,23,0.78))',
        }}
      />
      <div
        aria-hidden='true'
        className='pointer-events-none absolute -left-24 top-1/4 z-[1] h-72 w-72 rounded-full bg-blue-500/20 blur-3xl'
      />
      <div
        aria-hidden='true'
        className='pointer-events-none absolute -right-24 top-10 z-[1] h-96 w-96 rounded-full bg-violet-600/20 blur-3xl'
      />
      <div
        aria-hidden='true'
        className='pointer-events-none absolute bottom-0 left-1/2 z-[1] h-80 w-[52rem] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl'
      />

      {/* Aurora sweep */}
      <div
        aria-hidden='true'
        className='hero-aurora pointer-events-none absolute inset-x-[-20%] top-0 z-[2] h-40 -rotate-[8deg] bg-gradient-to-r from-transparent via-cyan-300/10 to-transparent blur-xl'
      />
      {/* Scan-line */}
      <div
        aria-hidden='true'
        className='hero-scanline pointer-events-none absolute inset-0 z-[3] opacity-40'
        style={{
          background:
            'linear-gradient(180deg,transparent 0%,rgba(125,211,252,0.08) 50%,transparent 100%)',
        }}
      />

      {/* Content */}
      <div className='relative z-10 mx-auto flex max-w-7xl flex-col items-center'>
        <div className='mx-auto flex max-w-4xl flex-col items-center text-center'>
          {/* Badge */}
          <div className='mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-1.5 text-sm font-medium text-cyan-100 shadow-[0_0_32px_rgba(56,189,248,0.28)] backdrop-blur-md'>
            <span className='h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(125,211,252,1)]' />
            {t('Next Generation AI Gateway')}
          </div>

          {/* Title */}
          <h1
            className='hero-title-glow bg-gradient-to-br from-white via-blue-200 to-violet-300 bg-clip-text text-[clamp(2.2rem,6vw,4rem)] font-bold leading-[1.1] tracking-tight text-transparent'
          >
            {t('CK Aggregated AI Platform')}
          </h1>

          {/* Subtitle */}
          <p className='mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg'>
            {t(
              'One-stop access to mainstream AI models — unified auth, billing, monitoring, and high-availability scheduling for developers and enterprises.',
            )}
          </p>

          {/* CTA buttons */}
          <div className='mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row'>
            {isAuthenticated ? (
              <Button
                className='group h-12 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 px-7 text-base font-semibold text-white shadow-[0_0_36px_rgba(59,130,246,0.36)] transition hover:scale-[1.02] hover:shadow-[0_0_46px_rgba(139,92,246,0.46)]'
                render={<Link to='/dashboard' />}
              >
                {t('Go to Dashboard')}
                <ArrowRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5' />
              </Button>
            ) : (
              <>
                <Button
                  className='group h-12 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 px-7 text-base font-semibold text-white shadow-[0_0_36px_rgba(59,130,246,0.36)] transition hover:scale-[1.02] hover:shadow-[0_0_46px_rgba(139,92,246,0.46)]'
                  render={<Link to='/sign-up' />}
                >
                  {t('Get Started')}
                  <ArrowRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5' />
                </Button>
                <Button
                  variant='outline'
                  className='h-12 rounded-full border-white/15 bg-white/[0.03] px-7 text-base font-semibold text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md transition hover:border-cyan-300/40 hover:bg-cyan-300/10 hover:text-white'
                  render={<Link to='/pricing' />}
                >
                  {t('View Pricing')}
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Terminal demo card */}
        <div className='mt-16 w-full max-w-6xl'>
          <div className='relative rounded-3xl border border-white/10 bg-white/[0.03] p-2 shadow-[0_0_70px_rgba(59,130,246,0.18)] backdrop-blur-xl'>
            <div
              aria-hidden='true'
              className='pointer-events-none absolute inset-0 rounded-3xl'
              style={{
                background:
                  'linear-gradient(135deg,rgba(56,189,248,0.18),transparent 28%,rgba(168,85,247,0.16) 72%,transparent)',
              }}
            />
            <div className='relative overflow-hidden rounded-2xl'>
              <HeroTerminalDemo />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes heroTitleGlowPulse {
          0%, 100% {
            filter: drop-shadow(0 0 16px rgba(59,130,246,0.42)) drop-shadow(0 0 30px rgba(139,92,246,0.24));
          }
          50% {
            filter: drop-shadow(0 0 28px rgba(96,165,250,0.72)) drop-shadow(0 0 52px rgba(168,85,247,0.42));
          }
        }
        @keyframes heroAuroraDrift {
          0%   { transform: translateX(-18%) translateY(0) rotate(-8deg);  opacity: 0.28; }
          50%  { transform: translateX(18%) translateY(38px) rotate(-8deg); opacity: 0.62; }
          100% { transform: translateX(-18%) translateY(0) rotate(-8deg);  opacity: 0.28; }
        }
        @keyframes heroScanlineSweep {
          0%   { transform: translateY(-120%); }
          100% { transform: translateY(120%); }
        }
        .hero-title-glow {
          animation: heroTitleGlowPulse 4.8s ease-in-out infinite;
        }
        .hero-aurora {
          animation: heroAuroraDrift 13s ease-in-out infinite;
        }
        .hero-scanline {
          animation: heroScanlineSweep 7s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-title-glow, .hero-aurora, .hero-scanline { animation: none; }
        }
      `}</style>
    </section>
  )
}
