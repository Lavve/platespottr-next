export type Locale = (typeof locales)[number]
export const locales = ['sv', 'en', 'fi'] as const

export const defaultLocale: Locale =
  typeof window !== 'undefined' ? (window.navigator.language.split('-')[0] as Locale) : 'sv'
