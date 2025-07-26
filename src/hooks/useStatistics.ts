import { useCallback, useMemo } from 'react'
import { formatDateToYYYYMMDD, getWeekNumber } from '@/utils/dates'

export const useStatistics = (findings?: number[]) => {
  const getFindingsByWeek = useCallback((findings: number[]): Map<number, number> => {
    const findingsByWeek = new Map<number, number>()
    findings
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
      .forEach(finding => {
        const date = new Date(finding)
        const weekKey = getWeekNumber(date)

        if (!findingsByWeek.has(weekKey)) {
          findingsByWeek.set(weekKey, 0)
        }
        findingsByWeek.set(weekKey, (findingsByWeek.get(weekKey) ?? 0) + 1)
      })
    return findingsByWeek
  }, [])

  const calculateMaxStreak = useCallback((findings: number[]): number => {
    const findingsByDay = new Map<number, number[]>()

    findings.forEach(finding => {
      if (!findingsByDay.has(finding)) {
        findingsByDay.set(finding, [])
      }
      findingsByDay.get(finding)?.push(finding)
    })

    const sortedDays = Array.from(findingsByDay.keys()).sort()
    let currentStreak = 0
    let maxStreak = 0
    let previousDate: Date | null = null

    for (const finding of sortedDays) {
      const currentDate = new Date(finding)

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

    return maxStreak
  }, [])

  const latestFinding = useMemo(() => {
    if (!findings || findings.length === 0) {
      return null
    }
    return findings[findings.length - 1]
  }, [findings])

  const findingsByWeek = getFindingsByWeek(findings || [])
  const maxStreak = calculateMaxStreak(findings || [])

  return { latestFinding, findingsByWeek, maxStreak, calculateMaxStreak }
}
