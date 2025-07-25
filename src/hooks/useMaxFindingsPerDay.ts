import { useMemo } from 'react'
import type { IFindings } from '@/types/game'

const formatDateToYYYYMMDD = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const useMaxFindingsPerDay = (findings: IFindings[] | undefined) => {
  return useMemo(() => {
    if (!findings || findings.length === 0) {
      return { maxFindings: 0, date: null }
    }

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

    // Find the day with the most findings
    let maxFindings = 0
    let maxDate: string | null = null

    findingsByDay.forEach((dayFindings, dayKey) => {
      if (dayFindings.length > maxFindings) {
        maxFindings = dayFindings.length
        maxDate = dayKey
      }
    })

    return { maxFindings, date: maxDate }
  }, [findings])
}
