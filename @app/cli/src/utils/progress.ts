// https://github.com/SamVerschueren/listr/issues/86#issuecomment-407956264

function repeat(num: number, char: string): string {
  return [...new Array(Math.round(num))].map(() => char).join('');
}

function formatTime(t: number) {
  return t >= 10 ? t : `0${t}`
}

function calcETA(percentage: number, start: Date,) {
  const elapsed = new Date().getTime() - start.getTime()

  const estimated = percentage > 0 ? elapsed / (percentage / 1e2) : 0
  const remaining = Math.round((estimated - elapsed) / 1e3)

  return (`${formatTime(Math.floor(remaining / 60))}:${formatTime(remaining - (Math.floor(remaining / 60) * 60))}`)
}

export function progressBar(percentage: number, start: Date, size: number = 40) {
  const track = repeat(size, "░");
  const completed = repeat((percentage / 100) * size, "█");

  const eta = calcETA(percentage, start)

  return `${completed}${track}`.substring(0, size) + ` ${percentage}% | ETA ${eta}`;
}
