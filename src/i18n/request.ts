import { IntlErrorCode } from 'next-intl'
import { getRequestConfig } from 'next-intl/server'
import { getUserLocale } from '@/utils/locale'

export default getRequestConfig(async () => {
  const locale = await getUserLocale()

  return {
    locale,
    timeZone: 'Europe/Stockholm',
    messages: (await import(`./translations/${locale}.json`)).default,
    now: new Date(),
    onError(error) {
      if (error.code === IntlErrorCode.MISSING_MESSAGE) {
        console.error(error)
      }
    },
    getMessageFallback({ namespace, key, error }) {
      const path = [namespace, key].filter(part => part != null).join('.')

      if (error.code === IntlErrorCode.MISSING_MESSAGE) {
        return `${path} is not yet translated`
      }

      return `Dear developer, please fix this message: ${path}`
    },
  }
})
