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
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/stores/auth-store'
import { Markdown } from '@/components/ui/markdown'
import { PublicLayout } from '@/components/layout'
import { Footer } from '@/components/layout/components/footer'
import { CTA, Features, Hero, HowItWorks, Stats } from './components'
import { useHomePageContent } from './hooks'

export function Home() {
  const { t } = useTranslation()
  const { auth } = useAuthStore()
  const isAuthenticated = !!auth.user
  const { content, isLoaded, isUrl } = useHomePageContent()

  if (!isLoaded) {
    return (
      <PublicLayout showMainContainer={false}>
        <main className='flex min-h-screen items-center justify-center'>
          <div className='text-muted-foreground'>{t('Loading...')}</div>
        </main>
      </PublicLayout>
    )
  }

  if (content) {
    return (
      <PublicLayout showMainContainer={false}>
        <main className='overflow-x-hidden'>
          {isUrl ? (
            <iframe
              src={content}
              className='h-screen w-full border-none'
              title={t('Custom Home Page')}
            />
          ) : (
            <div className='container mx-auto py-8'>
              <Markdown className='custom-home-content'>{content}</Markdown>
            </div>
          )}
        </main>
      </PublicLayout>
    )
  }

  return (
    <PublicLayout showMainContainer={false}>
      {/* Dark space wrapper — forces dark-mode variants on all child sections */}
      <div
        className='dark overflow-hidden'
        style={{
          backgroundColor: 'oklch(0.06 0.02 250)',
          position: 'relative',
          backgroundImage: [
            'radial-gradient(circle at 12px 18px, rgba(255,255,255,0.30) 0 1px, transparent 1.4px)',
            'radial-gradient(circle at 44px 62px, rgba(125,211,252,0.20) 0 1px, transparent 1.3px)',
            'radial-gradient(circle at 86px 28px, rgba(196,181,253,0.16) 0 1px, transparent 1.2px)',
          ].join(', '),
          backgroundSize: '120px 120px, 160px 160px, 220px 220px',
          backgroundPosition: '0 0, 24px 36px, 48px 12px',
        }}
      >
        {/* Full-height aurora overlay */}
        <div
          aria-hidden='true'
          className='pointer-events-none absolute inset-0 z-0'
          style={{
            background:
              'linear-gradient(180deg, rgba(37,99,235,0.14) 0%, rgba(79,70,229,0.10) 24%, rgba(124,58,237,0.08) 48%, rgba(14,165,233,0.04) 68%, transparent 100%)',
          }}
        />
        <div className='relative z-10'>
          <Hero isAuthenticated={isAuthenticated} />
          <Stats />
          <Features />
          <HowItWorks />
          <CTA isAuthenticated={isAuthenticated} />
        </div>
      </div>
      <Footer />
    </PublicLayout>
  )
}
