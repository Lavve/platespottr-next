'use client'

import { type IntlError, NextIntlClientProvider, useTimeZone } from 'next-intl'
import type { IntlClientProviderProps } from '@/types/providers'
import { getTimeZoneForLocale } from '@/utils/getTimeZoneForLocale'

export const I18nClientProvider = ({ messages, locale, children }: IntlClientProviderProps) => {
  const timeZone = useTimeZone()

  const onError = (error: IntlError) => {
    if (error.code === 'MISSING_MESSAGE') {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[i18n] Missing message: ${error.message}`)
      }
      return
    }

    console.error(error)
  }

  const getMessageFallback = ({ namespace, key, error }: { namespace: string; key: string; error: IntlError }) => {
    const path = [namespace, key].filter(part => part != null).join('.')

    if (error.code === 'MISSING_MESSAGE') {
      if (process.env.NODE_ENV === 'production') {
        return key
      }
      return `${path}`
    }

    return `Dear developer, please fix this message: ${path}`
  }

  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      onError={onError}
      getMessageFallback={getMessageFallback}
      timeZone={timeZone || getTimeZoneForLocale(locale)}
      now={new Date()}
    >
      {children}
    </NextIntlClientProvider>
  )
}

export default I18nClientProvider
