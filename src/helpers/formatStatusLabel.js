// ** "PENDING" -> "Pending", "BELUM LUNAS" -> "Belum Lunas", "ON_PROCESS" -> "On Process":
// the first letter of every word is capital, the rest lower-case.
export const formatStatusLabel = status =>
  String(status)
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/(^|\s)\S/g, letter => letter.toUpperCase())
