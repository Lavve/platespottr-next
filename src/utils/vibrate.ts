export const vibrate = (pattern: number | number[] = 5) => {
  if ('vibrate' in navigator && window.innerWidth <= 830) {
    navigator.vibrate(pattern)
  }
}
