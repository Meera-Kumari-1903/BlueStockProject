export function getTodaySeed(): number {
  const today = new Date();

  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  return year * 10000 + month * 100 + day;
}
