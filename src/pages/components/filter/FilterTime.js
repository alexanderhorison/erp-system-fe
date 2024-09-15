import React, { useState } from 'react'
import { Box, Button, Menu, MenuItem } from '@mui/material'
import Icon from 'src/@core/components/icon'

// Months array for displaying month names
const monthOptions = [
  { label: 'January', value: 1 },
  { label: 'February', value: 2 },
  { label: 'March', value: 3 },
  { label: 'April', value: 4 },
  { label: 'May', value: 5 },
  { label: 'June', value: 6 },
  { label: 'July', value: 7 },
  { label: 'August', value: 8 },
  { label: 'September', value: 9 },
  { label: 'October', value: 10 },
  { label: 'November', value: 11 },
  { label: 'December', value: 12 }
]
const yearOptions = [new Date().getFullYear(), new Date().getFullYear() - 1, new Date().getFullYear() - 2]

const TimeFilter = ({ timeFilter, setTimeFilter }) => {
  const [anchorElYear, setAnchorElYear] = useState(null)
  const [anchorElMonth, setAnchorElMonth] = useState(null)

  const handleYearClick = event => {
    setAnchorElYear(event.currentTarget)
  }

  const handleMonthClick = event => {
    setAnchorElMonth(event.currentTarget)
  }

  const handleYearClose = e => {
    setAnchorElYear(null)
    if (e.target.value) {
      setTimeFilter(prev => ({ ...prev, year: e.target.value }))
    }
  }

  const handleMonthClose = e => {
    setAnchorElMonth(null)
    setTimeFilter(prev => ({ ...prev, month: e.target.value || '' }))
  }

  return (
    <Box>
      {/* Month Filter */}
      <Button
        size='small'
        variant='outlined'
        aria-haspopup='true'
        onClick={handleMonthClick}
        sx={{ mr: 2, '& svg': { ml: 0.5 } }}
      >
        {monthOptions[timeFilter?.month - 1]?.label || 'Select Month'}
        <Icon fontSize='1rem' icon='tabler:chevron-down' />
      </Button>
      <Menu
        keepMounted
        anchorEl={anchorElMonth}
        onClose={handleMonthClose}
        open={Boolean(anchorElMonth)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        {monthOptions.map(month => (
          <MenuItem key={month.value} onClick={handleMonthClose} value={month.value}>
            {month.label}
          </MenuItem>
        ))}
      </Menu>

      {/* Year Filter */}
      <Button
        size='small'
        variant='outlined'
        aria-haspopup='true'
        onClick={handleYearClick}
        sx={{ mr: 2, '& svg': { ml: 0.5 } }}
      >
        {timeFilter?.year}
        <Icon fontSize='1rem' icon='tabler:chevron-down' />
      </Button>
      <Menu
        keepMounted
        anchorEl={anchorElYear}
        onClose={handleYearClose}
        open={Boolean(anchorElYear)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        {yearOptions.map(year => (
          <MenuItem key={year} onClick={handleYearClose} value={year}>
            {year}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  )
}

export default TimeFilter
