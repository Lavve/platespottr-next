'use client'

import { type AbstractIntlMessages, type IntlError, NextIntlClientProvider } from 'next-intl'
import type { ReactNode } from 'react'

type IntlClientProviderProps = {
  messages: AbstractIntlMessages
  locale: string
  children: ReactNode
}

export const I18nClientProvider = ({ messages, locale, children }: IntlClientProviderProps) => {
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
      timeZone='Europe/Stockholm'
      now={new Date()}
    >
      {children}
    </NextIntlClientProvider>
  )
}

export default I18nClientProvider
