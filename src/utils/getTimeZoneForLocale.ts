export const getTimeZoneForLocale = (locale: string): string => {
  switch (locale) {
    case 'fi':
      return 'Europe/Helsinki'
    default:
      return 'Europe/Stockholm'
  }
}
