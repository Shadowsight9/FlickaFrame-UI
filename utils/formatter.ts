export function formatDuration(duration: number) {
  const min = String(Math.floor(duration / 60)).padStart(2, '0')
  const sec = String(Math.floor(duration % 60)).padStart(2, '0')
  return `${min}:${sec}`
}
