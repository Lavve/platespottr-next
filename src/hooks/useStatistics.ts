import { useCallback, useMemo } from 'react'
import type { IUserNumber } from '@/types/user'
import { getDaysBetweenDates, getWeekNumber } from '@/utils/dates'

export const useStatistics = (findings?: IUserNumber[]) => {
  const getFindingsByWeek = useCallback((findings: IUserNumber[] | undefined): Map<number, number> => {
    if (!findings || findings.length === 0) return new Map<number, number>()

    const findingsByWeek = new Map<number, number>()

    const sortedFindings = findings.sort((a, b) => new Date(a.found_at).getTime() - new Date(b.found_at).getTime())

    const earliestDate = new Date(sortedFindings[0].found_at)
    const latestDate = new Date(sortedFindings[sortedFindings.length - 1].found_at)
    const earliestWeek = getWeekNumber(earliestDate)
    const latestWeek = getWeekNumber(latestDate)

    for (let week = earliestWeek; week <= latestWeek; week++) {
      findingsByWeek.set(week, 0)
    }

    sortedFindings.forEach(finding => {
      const date = new Date(finding.found_at)
      const weekKey = getWeekNumber(date)
      findingsByWeek.set(weekKey, (findingsByWeek.get(weekKey) ?? 0) + 1)
    })

    return findingsByWeek
  }, [])

  const calculateMaxStreak = useCallback((findings: IUserNumber[] | undefined): number => {
    if (!findings || findings.length === 0) return 0

    const findingsByDay = new Map<string, IUserNumber[]>()

    findings.forEach(finding => {
      const date = new Date(finding.found_at)
      const dayKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

      if (!findingsByDay.has(dayKey)) {
        findingsByDay.set(dayKey, [])
      }
      findingsByDay.get(dayKey)?.push(finding)
    })

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
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays === 1) {
          currentStreak++
        } else {
          currentStreak = 1
        }
      }

      maxStreak = Math.max(maxStreak, currentStreak)
      previousDate = currentDate
    }

    return maxStreak
  }, [])

  const calculateFindsPerDay = useCallback((findings: IUserNumber[] | undefined): { days: number; perday: number } => {
    if (!findings || findings.length === 0) return { days: 0, perday: 0 }
    if (findings.length < 2) {
      return { days: 0, perday: 0 }
    }

    const sortedFindings = findings.sort((a, b) => new Date(a.found_at).getTime() - new Date(b.found_at).getTime())

    const firstDate = new Date(sortedFindings[0].found_at)
    const days = getDaysBetweenDates(firstDate)
    const perday = Math.round((findings.length / days) * 10) / 10

    return { days, perday }
  }, [])

  const findsPerDay = useMemo(() => {
    if (!findings || findings.length < 2) {
      return { days: 0, perday: 0 }
    }
    return calculateFindsPerDay(findings)
  }, [findings, calculateFindsPerDay])

  const latestFinding = useMemo(() => {
    if (!findings || findings.length === 0) {
      return null
    }

    const sortedFindings = findings.sort((a, b) => new Date(a.found_at).getTime() - new Date(b.found_at).getTime())
    return sortedFindings[sortedFindings.length - 1]
  }, [findings])

  const findingsByWeek = useMemo(() => {
    return getFindingsByWeek(findings)
  }, [findings, getFindingsByWeek])

  const maxStreak = useMemo(() => {
    return calculateMaxStreak(findings)
  }, [findings, calculateMaxStreak])

  const maxWeek = useMemo(() => {
    if (!findingsByWeek || findingsByWeek.size === 0) return 0
    return Math.max(...Array.from(findingsByWeek.values()))
  }, [findingsByWeek])

  return { latestFinding, findingsByWeek, findsPerDay, maxStreak, maxWeek, calculateMaxStreak, calculateFindsPerDay }
}
