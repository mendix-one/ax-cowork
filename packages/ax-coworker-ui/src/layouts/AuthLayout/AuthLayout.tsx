import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { Button, Space, theme } from 'antd'
import { useTranslation } from 'react-i18next'
import iconLight from '@/assets/icon.png'
import { PageFallback } from '@/acore/router/PageFallback.tsx'

export const AuthLayout = () => {
  const { token } = theme.useToken()
  const { t, i18n } = useTranslation()

  const setLang = (lng: 'en' | 'ko') => {
    void i18n.changeLanguage(lng)
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center" style={{ background: token.colorBgLayout }}>
      <div className="w-full max-w-sm rounded-md shadow-md p-8" style={{ background: token.colorBgContainer }}>
        <header className="flex flex-col items-center mb-6 gap-2">
          <img src={iconLight} alt={t('brand.name')} width={48} height={48} />
          <h1 className="text-lg font-semibold" style={{ color: token.colorText }}>
            {t('brand.name')}
          </h1>
        </header>
        <Suspense fallback={<PageFallback />}>
          <Outlet />
        </Suspense>
        <footer className="mt-6 flex justify-center">
          <Space size={4} split={<span style={{ color: token.colorTextTertiary }}>·</span>}>
            <Button type={i18n.resolvedLanguage === 'en' ? 'primary' : 'link'} size="small" onClick={() => setLang('en')}>
              {t('lang.en')}
            </Button>
            <Button type={i18n.resolvedLanguage === 'ko' ? 'primary' : 'link'} size="small" onClick={() => setLang('ko')}>
              {t('lang.ko')}
            </Button>
          </Space>
        </footer>
      </div>
    </div>
  )
}
