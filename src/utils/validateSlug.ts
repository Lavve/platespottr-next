export const isValidSlug = (slug: string): boolean => {
  const slugPattern = /^[A-ZÅÄÖ]+-[A-ZÅÄÖ]+-[A-ZÅÄÖ]+$/
  return slugPattern.test(slug)
}
