export default function parsePeriodString(periodStr) {
  if (!periodStr) return null;
  const [year, month] = periodStr.split('-');
  return new Date(parseInt(year), parseInt(month) - 1);
}