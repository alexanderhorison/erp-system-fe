import { Card, CardContent, Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useState } from 'react'
import DailyCostCalendarView from 'src/views/daily-cost-calendar/DailyCostCalendarView'

export default function DailyCostCalendar() {
  const expenses = [
    { date: "2025-05-01", amount: 15000000 },
    { date: "2025-05-01", amount: 8000000 },
    { date: "2025-05-03", amount: 5000000 },
    { date: "2025-05-05", amount: 1250000 },
    { date: "2025-05-05", amount: 350000 },
    { date: "2025-05-15", amount: 7000000 },
    { date: "2025-05-20", amount: 990000 },
  ];
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Box sx={{ gap: 1, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', paddingY: 3 }}>
          <Typography fontSize={20}>Daily Cost Calendar</Typography>
        </Box>
        <Card>
          <CardContent>
            <DailyCostCalendarView expenses={expenses} />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}