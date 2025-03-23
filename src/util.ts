export function roundTo(number: number, decimalPoints: number): number {
  const mult = Math.pow(10, decimalPoints);
  return Math.round(number * mult) / mult;
}
