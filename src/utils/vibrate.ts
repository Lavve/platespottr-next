export const vibrate = (pattern: number | number[] = 20) => {
  if ('vibrate' in navigator && window.innerWidth <= 830) {
    navigator.vibrate(pattern)
  }
}
