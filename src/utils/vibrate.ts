export const vibrate = (pattern: number | number[] = 3) => {
  const hasVibrate =
    typeof window !== 'undefined' &&
    typeof navigator !== 'undefined' &&
    'vibrate' in navigator &&
    window.innerWidth <= 830

  if (hasVibrate) {
    navigator.vibrate(pattern)
  }
}
