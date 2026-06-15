export default function normalizeDuration(duration: number): string {
  const minutes = Math.trunc(duration)
  let seconds = Math.ceil((duration - minutes) * 60)
  
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}