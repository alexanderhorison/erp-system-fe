import { Card, CardContent, Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllDailyCost } from 'src/store/apps/daily-cost'
import DailyCostCalendarView from 'src/views/daily-cost-calendar/DailyCostCalendarView'

export default function DailyCostCalendar() {

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Box sx={{ gap: 1, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', paddingY: 3 }}>
          <Typography fontSize={20}>Daily Cost Calendar</Typography>
        </Box>
        <Card>
          <CardContent>
            <DailyCostCalendarView />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}