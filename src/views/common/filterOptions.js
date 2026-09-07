/**
 * filterOptions
 * -------------------------------------------------------------------------------------
 * `{ value, label }` option lists shared by every table's month/year `FilterPanel`
 * field (see docs/REVAMP_BASELINE.md `FilterPanel`). Previously copy-pasted
 * verbatim into ~10 table files — centralised here so a change (e.g. adding a
 * 4th year back) only needs to happen once.
 */

export const monthOptions = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' }
]

export const currentYear = new Date().getFullYear()

// ** Current year plus the two before it — matches every table's existing range.
export const yearOptions = [currentYear, currentYear - 1, currentYear - 2].map(year => ({
  value: year,
  label: `${year}`
}))
