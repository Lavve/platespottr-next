export const formatDateToYYYYMMDD = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const getWeekNumber = (date: Date): number => {
  date.setHours(0, 0, 0, 0)
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7))
  const week1 = new Date(date.getFullYear(), 0, 4)
  const weekNumber =
    1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7)

  return weekNumber
}

export const getDaysBetweenDates = (date: Date): number => {
  const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const currentDate = new Date(Date.now())
  const diffTime = currentDate.getTime() - normalizedDate.getTime()
  return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1
}

export const relativeDays = (date: Date, t: (key: string) => string): string => {
  const today = new Date()

  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const inputDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())

  const diffTime = todayDate.getTime() - inputDate.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return t('common.today')
  }
  if (diffDays === 1) {
    return t('common.yesterday')
  }

  return formatDateToYYYYMMDD(date)
}
