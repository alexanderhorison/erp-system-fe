export default function HandleSearch({ data, keys = [], setData, searchValue, timeFilter = null }) {
  if (searchValue && typeof searchValue === 'number') {
    searchValue = searchValue.toString()
  }

  if (searchValue && searchValue.length && keys.length) {
    const filteredRows = data.filter(row => {
      return keys.some(key => {
        const value = (row[key]?.toString() || '').toLowerCase()
        const searchText = searchValue.toLowerCase()
        return value.includes(searchText) || value.includes(`-${searchText}`)
      })
    })

    // Apply year/month filter if timeFilter exists
    let finalFilteredRows = filteredRows

    if (timeFilter && timeFilter.year) {
      finalFilteredRows = filteredRows.filter(row => {
        const itemDate = new Date(row.createdAt)
        const itemYear = itemDate.getFullYear() // Get the year from createdAt
        const itemMonth = itemDate.getMonth() // Get the month from createdAt (0-based index)

        const matchesYear = timeFilter?.year ? itemYear === parseInt(timeFilter.year) : true
        const matchesMonth = timeFilter?.month ? itemMonth === parseInt(timeFilter.month - 1) : true
        return matchesYear && matchesMonth
      })
    }

    setData(finalFilteredRows)
  } else {
    if (timeFilter && timeFilter.year) {
      const filtered = data.filter(item => {
        const itemDate = new Date(item.createdAt)
        const itemYear = itemDate.getFullYear() // Get the year from createdAt
        const itemMonth = itemDate.getMonth() // Get the month from createdAt (0-based index)

        // Compare it with timeFilter.year and timeFilter.month (if provided)
        const matchesYear = itemYear === parseInt(timeFilter.year)
        const matchesMonth = timeFilter.month ? itemMonth === parseInt(timeFilter.month - 1) : true

        return matchesYear && matchesMonth
      })
      setData(filtered)
    } else {
      setData(data) // If no year filter, show all data
    }
  }
}
