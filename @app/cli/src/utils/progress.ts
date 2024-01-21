// https://github.com/SamVerschueren/listr/issues/86#issuecomment-407956264

import { Progress } from "got";

function repeat(num: number, char: string): string {
  return [...new Array(Math.round(num))].map(() => char).join('');
}

function formatTime(t: number) {
  return t >= 10 ? t : `0${t}`
}

function calcETA(percentage: number, start: Date,) {
  const elapsed = new Date().getTime() - start.getTime()

  const estimated = percentage > 0 ? elapsed / (percentage / 1e2) : elapsed
  const remaining = Math.round((estimated - elapsed) / 1e3)

  return (`${formatTime(Math.floor(remaining / 60))}:${formatTime(remaining - (Math.floor(remaining / 60) * 60))}`)
}

function calcSpeed(transferred: number, start: Date) {
  const elapsed = new Date().getTime() - start.getTime()
  const speed = Math.round(transferred / (elapsed / 1e3))

  return `${(speed / 1e6).toFixed(2)} Mb/s`
}

export function progressBar(progress: Progress, start: Date, size: number = 40) {
  const track = repeat(size, "░");
  const percent = Math.round(progress.percent * 100)
  const completed = repeat((percent / 100) * size, "█");

  const eta = calcETA(percent, start)
  const speed = calcSpeed(progress.transferred, start)

  return `${completed}${track}`.substring(0, size) + ` ${percent}% || ETA ${eta} || ${speed}`;
}
