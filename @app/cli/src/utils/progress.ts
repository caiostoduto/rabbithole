// https://github.com/SamVerschueren/listr/issues/86#issuecomment-407956264

function repeat(num: number, char: string): string {
  return [...new Array(Math.round(num))].map(() => char).join('');
}

export function progressBar(percentage: number, size: number = 40) {
  const track = repeat(size, "░");
  const completed = repeat((percentage / 100) * size, "█");
  return `${completed}${track}`.substring(0, size) + ` ${percentage}%`;
}
