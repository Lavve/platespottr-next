export const vibrate = (pattern: number | number[] = 50) => {
  if ('vibrate' in navigator && window.innerWidth <= 830) {
    navigator.vibrate(pattern)
  }
}
