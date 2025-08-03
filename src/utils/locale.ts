'use server'

import { cookies } from 'next/headers'
import type { Locale } from '@/i18n/config'
import { defaultLocale } from '@/i18n/config'

// In this example the locale is read from a cookie. You could alternatively
// also read it from a database, backend service, or any other source.
const COOKIE_NAME = 'PS_locale'

const getUserLocale = async () => {
  const cookieStore = await cookies()
  return cookieStore.get(COOKIE_NAME)?.value || defaultLocale
}

const setUserLocale = async (locale: Locale) => {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, locale)
}

export { getUserLocale, setUserLocale }
