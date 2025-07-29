import { adjectives, nouns, SLUG_SEPARATOR, verbs } from '@/constants/slugs'

export const generateSlug = () => {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)].toUpperCase()
  const noun = nouns[Math.floor(Math.random() * nouns.length)].toUpperCase()
  const verb = verbs[Math.floor(Math.random() * verbs.length)].toUpperCase()
  return `${adjective}${SLUG_SEPARATOR}${noun}${SLUG_SEPARATOR}${verb}`
}

export const isValidSlug = (slug: string): boolean => {
  const slugPattern = /^[A-Z]+-[A-Z]+-[A-Z]+$/
  return slugPattern.test(slug)
}
