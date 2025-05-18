import { parseNumber } from "src/utils/formatNumber"

export default function safeNumberHandler(value, onChange, callback) {
  if (value === '' || /^[0-9,.\s]+$/.test(value)) {
    const numericValue = parseNumber(value)
    if (!isNaN(numericValue)) {
      onChange(numericValue)
      if (callback) callback()
    }
  }
}