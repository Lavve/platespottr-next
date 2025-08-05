import { IntlErrorCode } from 'next-intl'
import { getRequestConfig } from 'next-intl/server'
import { getTimeZoneForLocale } from '@/utils/getTimeZoneForLocale'
import { getUserLocale } from '@/utils/locale'

export default getRequestConfig(async () => {
  const locale = await getUserLocale()

  return {
    locale,
    timeZone: getTimeZoneForLocale(locale),
    messages: (await import(`./translations/${locale}.json`)).default,
    now: new Date(),
    onError(error) {
      if (error.code === IntlErrorCode.MISSING_MESSAGE) {
        console.error(error)
      }
    },
    getMessageFallback({ namespace, key }) {
      const path = [namespace, key].filter(part => part != null).join('.')
      return path
    },
  }
})
