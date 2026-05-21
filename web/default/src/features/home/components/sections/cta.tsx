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
    <section className='relative z-10 overflow-hidden px-6 py-24 md:py-32'>
      <AnimateInView
        className='mx-auto max-w-3xl text-center'
        animation='scale-in'
      >
        <div className='relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] px-8 py-14 shadow-[0_0_80px_rgba(59,130,246,0.12)] backdrop-blur-sm md:px-12'>
          {/* Inner glow */}
          <div
            aria-hidden='true'
            className='pointer-events-none absolute inset-0'
            style={{
              background:
                'radial-gradient(circle at 50% 0%, rgba(59,130,246,0.18), transparent 42%), radial-gradient(circle at 80% 80%, rgba(139,92,246,0.14), transparent 38%)',
            }}
          />
          <div className='relative z-10'>
            <h2 className='text-2xl font-bold leading-tight tracking-tight text-white md:text-4xl'>
              {t('Ready to simplify')}
              <br />
              <span className='bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent'>
                {t('your AI integration?')}
              </span>
            </h2>
            <p className='mx-auto mt-5 max-w-md text-sm leading-relaxed text-slate-400 md:text-base'>
              {t(
                'Deploy your own gateway and start routing requests through your configured upstream services.',
              )}
            </p>
            <div className='mt-8 flex items-center justify-center gap-3'>
              <Button
                className='group h-11 rounded-full bg-gradient-to-r from-blue-500 to-violet-600 px-8 text-white shadow-[0_0_32px_rgba(59,130,246,0.4)] transition hover:shadow-[0_0_44px_rgba(139,92,246,0.5)]'
                render={<Link to='/sign-up' />}
              >
                {t('Get Started')}
                <ArrowRight className='ml-1 size-3.5 transition-transform duration-200 group-hover:translate-x-0.5' />
              </Button>
              <Button
                variant='outline'
                className='h-11 rounded-full border-white/20 bg-transparent px-8 text-slate-200 hover:border-cyan-300/50 hover:bg-white/5 hover:text-white'
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
