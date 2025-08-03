import { useCallback, useMemo } from 'react'
import { getDaysBetween, getWeekNumber } from '@/utils/dates'

export const useStatistics = (findings?: string[] | number[]) => {
  // Convert string timestamps to numbers for processing
  const convertFindingsToNumbers = useCallback((findings: string[] | number[] | undefined): number[] => {
    if (!findings) return []
    return findings.map(finding => {
      if (typeof finding === 'string') {
        return new Date(finding).getTime()
      }
      return finding
    })
  }, [])

  const numericFindings = useMemo(() => convertFindingsToNumbers(findings), [findings, convertFindingsToNumbers])

  const getFindingsByWeek = useCallback((findings: number[]): Map<number, number> => {
    const findingsByWeek = new Map<number, number>()

    if (findings.length === 0) {
      return findingsByWeek
    }

    const sortedFindings = findings.sort((a, b) => a - b)
    const earliestDate = new Date(sortedFindings[0])
    const latestDate = new Date(sortedFindings[sortedFindings.length - 1])
    const earliestWeek = getWeekNumber(earliestDate)
    const latestWeek = getWeekNumber(latestDate)

    for (let week = earliestWeek; week <= latestWeek; week++) {
      findingsByWeek.set(week, 0)
    }

    sortedFindings.forEach(finding => {
      const date = new Date(finding)
      const weekKey = getWeekNumber(date)
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

  const calculateFindsPerDay = useCallback((findings: number[]): { days: number; perday: number } => {
    if (!findings || findings.length < 2) {
      return { days: 0, perday: 0 }
    }

    const days = getDaysBetween(new Date(findings[0]))
    const perday = Math.round((findings.length / days) * 10) / 10

    return { days, perday }
  }, [])

  const findsPerDay = useMemo(() => {
    if (!numericFindings || numericFindings.length < 2) {
      return { days: 0, perday: 0 }
    }
    return calculateFindsPerDay(numericFindings)
  }, [numericFindings, calculateFindsPerDay])

  const latestFinding = useMemo(() => {
    if (!numericFindings || numericFindings.length === 0) {
      return null
    }
    return numericFindings[numericFindings.length - 1]
  }, [numericFindings])

  const findingsByWeek = useMemo(() => {
    return getFindingsByWeek(numericFindings)
  }, [numericFindings, getFindingsByWeek])

  const maxStreak = useMemo(() => {
    return calculateMaxStreak(numericFindings)
  }, [numericFindings, calculateMaxStreak])

  const maxWeek = useMemo(() => {
    if (!findingsByWeek || findingsByWeek.size === 0) return 0
    return Math.max(...Array.from(findingsByWeek.values()))
  }, [findingsByWeek])

  return { latestFinding, findingsByWeek, findsPerDay, maxStreak, maxWeek, calculateMaxStreak, calculateFindsPerDay }
}
