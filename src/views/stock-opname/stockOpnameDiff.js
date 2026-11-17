// ** The system stock lives under `quantity` while adding and `systemStock` once saved.
export const getSystemStock = (row, type) => (type === 'add' ? row.quantity : row.systemStock)

/**
 * Signed difference (actual − system) for display, or `null` when there is nothing
 * to show: no actual stock entered yet, or actual equals system. `actualStock` is a
 * number on the add page and the raw input string on the edit page.
 */
export const getDiff = (row, type) => {
  const actual = row.actualStock
  if (actual === null || actual === undefined || actual === '') return null

  const diff = Number(actual) - Number(getSystemStock(row, type))
  if (!Number.isFinite(diff) || diff === 0) return null

  return diff
}

export const formatDiff = diff => (diff > 0 ? `+${diff}` : `${diff}`)

/** Counts and totals behind the "Ringkasan" panel and the "Ada selisih" filter. */
export const summarizeDiff = (rows, type) => {
  const summary = { total: rows?.length || 0, withDiff: 0, lessCount: 0, lessTotal: 0, moreCount: 0, moreTotal: 0 }

  for (const row of rows || []) {
    const diff = getDiff(row, type)
    if (diff === null) continue

    summary.withDiff += 1
    if (diff < 0) {
      summary.lessCount += 1
      summary.lessTotal += diff
    } else {
      summary.moreCount += 1
      summary.moreTotal += diff
    }
  }

  return summary
}
