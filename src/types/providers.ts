import type { AbstractIntlMessages } from 'next-intl'
import type { ReactNode } from 'react'

// Provider related types
export interface ProvidersProps {
  children: React.ReactNode
  messages: Record<string, unknown>
  locale: string
}

export interface IntlClientProviderProps {
  messages: AbstractIntlMessages
  locale: string
  children: ReactNode
}
