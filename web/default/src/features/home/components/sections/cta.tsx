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
import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { AnimateInView } from '@/components/animate-in-view'

interface CTAProps {
  className?: string
  isAuthenticated?: boolean
}

export function CTA(props: CTAProps) {
  const { t } = useTranslation()

  if (props.isAuthenticated) {
    return null
  }

  return (
    <section className='relative z-10 overflow-hidden bg-white px-6 py-24 md:py-32 dark:bg-[oklch(0.06_0.02_250)]'>
      <AnimateInView
        className='mx-auto max-w-3xl text-center'
        animation='scale-in'
      >
        <div className='relative overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50/80 to-violet-50/60 px-8 py-14 shadow-[0_8px_40px_rgba(59,130,246,0.14)] backdrop-blur-sm md:px-12 dark:border-white/10 dark:bg-white/[0.03] dark:from-transparent dark:to-transparent dark:shadow-[0_0_80px_rgba(59,130,246,0.12)]'>
          {/* Inner glow — dark mode only */}
          <div
            aria-hidden='true'
            className='pointer-events-none absolute inset-0 hidden dark:block'
            style={{
              background:
                'radial-gradient(circle at 50% 0%, rgba(59,130,246,0.18), transparent 42%), radial-gradient(circle at 80% 80%, rgba(139,92,246,0.14), transparent 38%)',
            }}
          />
          <div className='relative z-10'>
            <h2 className='text-2xl font-bold leading-tight tracking-tight text-slate-900 md:text-4xl dark:text-white'>
              {t('Ready to simplify')}
              <br />
              <span className='bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-600 bg-clip-text text-transparent dark:from-cyan-300 dark:via-blue-400 dark:to-violet-400'>
                {t('your AI integration?')}
              </span>
            </h2>
            <p className='mx-auto mt-5 max-w-md text-sm leading-relaxed text-slate-500 md:text-base dark:text-slate-400'>
              {t(
                'Deploy your own gateway and start routing requests through your configured upstream services.',
              )}
            </p>
            <div className='mt-8 flex items-center justify-center gap-3'>
              <Button
                className='group h-11 rounded-full bg-gradient-to-r from-blue-500 to-violet-600 px-8 text-white shadow-[0_4px_20px_rgba(59,130,246,0.30)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(59,130,246,0.40)] dark:shadow-[0_0_32px_rgba(59,130,246,0.4)] dark:hover:shadow-[0_0_44px_rgba(139,92,246,0.5)]'
                render={<Link to='/sign-up' />}
              >
                {t('Get Started')}
                <ArrowRight className='ml-1 size-3.5 transition-transform duration-200 group-hover:translate-x-0.5' />
              </Button>
              <Button
                variant='outline'
                className='h-11 rounded-full border-blue-300/60 bg-white px-8 text-slate-700 transition hover:-translate-y-0.5 hover:bg-blue-50 dark:border-white/20 dark:bg-transparent dark:text-slate-200 dark:hover:border-cyan-300/50 dark:hover:bg-white/5 dark:hover:text-white'
                render={<Link to='/pricing' />}
              >
                {t('View Pricing')}
              </Button>
            </div>
          </div>
        </div>
      </AnimateInView>
    </section>
  )
}
