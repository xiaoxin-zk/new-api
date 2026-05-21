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
import { useEffect, useRef } from 'react'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useSystemConfig } from '@/hooks/use-system-config'
import { Skeleton } from '@/components/ui/skeleton'
import { Logo } from '@/assets/logo'

type AuthLayoutProps = {
  children: React.ReactNode
}

interface Star {
  x: number
  y: number
  radius: number
  baseOpacity: number
  twinkleAmplitude: number
  twinkleSpeed: number
  phase: number
  vx: number
  vy: number
}

const STAR_COUNT = 120

function createStars(width: number, height: number): Star[] {
  return Array.from({ length: STAR_COUNT }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: 0.5 + Math.random() * 1.5,
    baseOpacity: 0.28 + Math.random() * 0.42,
    twinkleAmplitude: 0.14 + Math.random() * 0.28,
    twinkleSpeed: 0.65 + Math.random() * 1.55,
    phase: Math.random() * Math.PI * 2,
    vx: (Math.random() - 0.5) * 0.015,
    vy: (Math.random() - 0.5) * 0.01,
  }))
}

function StarfieldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const starsRef = useRef<Star[]>([])
  const rafRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 0
    let height = 0

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = Math.max(1, rect.width)
      height = Math.max(1, rect.height)
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      starsRef.current = createStars(width, height)
    }

    const draw = (time: number) => {
      const elapsed = time * 0.001
      const delta = Math.min(48, time - (lastTimeRef.current || time))
      lastTimeRef.current = time

      ctx.clearRect(0, 0, width, height)

      for (const star of starsRef.current) {
        star.x += star.vx * delta
        star.y += star.vy * delta
        if (star.x > width + 4) star.x = -4
        if (star.x < -4) star.x = width + 4
        if (star.y > height + 4) star.y = -4
        if (star.y < -4) star.y = height + 4

        const opacity = Math.min(
          0.95,
          Math.max(
            0.06,
            star.baseOpacity +
              Math.sin(elapsed * star.twinkleSpeed + star.phase) *
                star.twinkleAmplitude,
          ),
        )

        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.shadowBlur = star.radius > 1.2 ? 10 : 4
        ctx.shadowColor = `rgba(56, 189, 248, ${opacity * 0.8})`
        ctx.fillStyle = `rgba(191, 241, 255, ${opacity})`
        ctx.fill()
      }
      ctx.shadowBlur = 0

      rafRef.current = window.requestAnimationFrame(draw)
    }

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()
    rafRef.current = window.requestAnimationFrame(draw)

    return () => {
      ro.disconnect()
      if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden='true'
      className='absolute inset-0 h-full w-full'
    />
  )
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const { t } = useTranslation()
  const { systemName, loading } = useSystemConfig()
  const displayName = systemName || 'CK聚合AI平台'

  return (
    <div className='grid min-h-svh overflow-hidden bg-white lg:grid-cols-[45%_55%] dark:bg-[oklch(0.09_0.015_250)]'>
      {/* ── Left branding panel (lg+) ── */}
      <aside className='relative hidden min-h-svh overflow-hidden bg-[oklch(0.06_0.02_250)] lg:block'>
        <StarfieldCanvas />

        {/* Nebula glows */}
        <div className='pointer-events-none absolute -top-32 -left-28 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl' />
        <div className='pointer-events-none absolute -top-24 -right-24 h-[28rem] w-[28rem] rounded-full bg-violet-500/20 blur-3xl' />
        <div className='pointer-events-none absolute top-1/3 left-1/4 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl' />

        {/* Aurora sweep */}
        <div
          aria-hidden='true'
          className='auth-aurora pointer-events-none absolute inset-x-[-30%] top-1/3 h-56 -rotate-[10deg] bg-gradient-to-r from-transparent via-cyan-300/14 to-transparent blur-2xl'
        />

        {/* Bottom fade */}
        <div className='pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/70 to-transparent' />

        {/* Content */}
        <div className='relative z-10 flex min-h-svh flex-col justify-between px-12 py-10 xl:px-16'>
          {/* Logo */}
          <Link
            to='/'
            className='inline-flex items-center gap-3 transition-opacity hover:opacity-85'
          >
            <span className='flex size-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20 backdrop-blur-md'>
              <Logo className='size-6 text-white' />
            </span>
            {loading ? (
              <Skeleton className='h-6 w-36 bg-white/15' />
            ) : (
              <span className='text-xl font-semibold text-white'>
                {displayName}
              </span>
            )}
          </Link>

          {/* Hero copy */}
          <div className='mx-auto w-full max-w-md'>
            <p className='mb-4 text-xs font-semibold tracking-[0.35em] text-cyan-300/60 uppercase'>
              CK AGGREGATED AI
            </p>
            <h2 className='bg-gradient-to-br from-white via-blue-200 to-violet-300 bg-clip-text text-5xl font-bold leading-tight tracking-tight text-transparent xl:text-6xl'>
              智能 AI 聚合
              <br />
              一站直达
            </h2>
            <div className='mt-8 space-y-4'>
              {[
                t('50+ mainstream AI models'),
                t('Unified auth · billing · monitoring'),
                t('Millisecond low-latency routing'),
              ].map((feat) => (
                <div
                  key={feat}
                  className='flex items-center gap-4 text-sm text-slate-200/80'
                >
                  <span className='relative flex size-2.5 shrink-0'>
                    <span className='absolute inline-flex size-full animate-ping rounded-full bg-cyan-300 opacity-40' />
                    <span className='relative inline-flex size-2.5 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(103,232,249,0.9)]' />
                  </span>
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <p className='text-xs text-white/30'>
            © {new Date().getFullYear()} {displayName}
          </p>
        </div>
      </aside>

      {/* ── Right form panel ── */}
      <main className='flex min-h-svh w-full items-center justify-center overflow-y-auto bg-white px-5 py-10 sm:px-8 dark:bg-[oklch(0.09_0.015_250)]'>
        <div className='w-full max-w-[420px]'>
          {/* Mobile-only logo */}
          <div className='mb-10 lg:hidden'>
            <Link
              to='/'
              className='inline-flex items-center gap-2.5 transition-opacity hover:opacity-85'
            >
              <span className='flex size-8 items-center justify-center rounded-lg bg-primary/10'>
                <Logo className='size-5 text-primary' />
              </span>
              {loading ? (
                <Skeleton className='h-5 w-28' />
              ) : (
                <span className='text-base font-semibold'>{displayName}</span>
              )}
            </Link>
          </div>

          {children}
        </div>
      </main>

      <style>{`
        @keyframes authAuroraMove {
          0%, 100% { transform: translateX(-18%) translateY(0) rotate(-10deg); opacity: 0.3; }
          50% { transform: translateX(18%) translateY(24px) rotate(8deg); opacity: 0.6; }
        }
        .auth-aurora { animation: authAuroraMove 14s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .auth-aurora { animation: none; } }
      `}</style>
    </div>
  )
}
