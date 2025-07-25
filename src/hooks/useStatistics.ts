import { useMemo } from 'react'
import type { IFindings } from '@/types/game'
import { formatDateToYYYYMMDD, getWeekNumber } from '@/utils/dates'

export const useStatistics = (findings: IFindings[] | undefined) => {
  return useMemo(() => {
    if (!findings || findings.length === 0) {
      return { maxFindings: 0, date: null, streak: 0 }
    }

    const latestFinding = formatDateToYYYYMMDD(new Date(findings[findings.length - 1].foundAt)) ?? null

    // Group findings by day
    const findingsByDay = new Map<string, IFindings[]>()

    findings.forEach(finding => {
      const date = new Date(finding.foundAt)
      const dayKey = formatDateToYYYYMMDD(date)

      if (!findingsByDay.has(dayKey)) {
        findingsByDay.set(dayKey, [])
      }
      findingsByDay.get(dayKey)?.push(finding)
    })

    // Group number of findings per week
    const findingsByWeek = new Map<number, number>()
    findings
      .sort((a, b) => new Date(a.foundAt).getTime() - new Date(b.foundAt).getTime())
      .forEach(finding => {
        const date = new Date(finding.foundAt)
        const weekKey = getWeekNumber(date)

        if (!findingsByWeek.has(weekKey)) {
          findingsByWeek.set(weekKey, 0)
        }
        findingsByWeek.set(weekKey, (findingsByWeek.get(weekKey) ?? 0) + 1)
      })

    // Find the day with the most findings
    let maxFindings = 0
    let maxDate: string | null = null

    findingsByDay.forEach((dayFindings, dayKey) => {
      if (dayFindings.length > maxFindings) {
        maxFindings = dayFindings.length
        maxDate = dayKey
      }
    })

    // Calculate streak (consecutive days with findings)
    const sortedDays = Array.from(findingsByDay.keys()).sort()
    let currentStreak = 0
    let maxStreak = 0
    let previousDate: Date | null = null

    for (const dayKey of sortedDays) {
      const currentDate = new Date(dayKey)

      if (previousDate === null) {
        currentStreak = 1
      } else {
        const diffTime = currentDate.getTime() - previousDate.getTime()
        const diffDays = diffTime / (1000 * 60 * 60 * 24)

        if (diffDays === 1) {
          currentStreak++
        } else {
          currentStreak = 1
        }
      }

      maxStreak = Math.max(maxStreak, currentStreak)
      previousDate = currentDate
    }

    return { maxFindings, date: maxDate, streak: maxStreak, latestFinding, findingsByWeek }
  }, [findings])
}
