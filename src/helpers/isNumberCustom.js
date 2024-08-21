export default function isNumberCustom(value) {
  if (typeof value === 'number') {
    return value
  }
  return "-"
}
