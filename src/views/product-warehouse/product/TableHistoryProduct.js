import { Timeline, timelineItemClasses } from '@mui/lab'
import { Card, CardContent, Typography } from '@mui/material'

import { useRouter } from 'next/router'
import TimelineItemHistory from './TimelineItemHistory'
import { Box } from '@mui/system'

export default function TableHistoryProduct({ history, product }) {
  const router = useRouter()
  return (
    <Card>
      <CardContent>
        <Box sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
          <Timeline
            sx={{
              [`& .${timelineItemClasses.root}:before`]: {
                flex: 0,
                padding: 2
              }
            }}
          >
            {history.length === 0 && (
              <Typography variant='body2' sx={{ textAlign: 'center', mt: 3 }}>
                No History Data
              </Typography>
            )}
            {history?.map((item, index) => (
              <TimelineItemHistory
                index={index}
                key={index}
                length={history.length}
                router={router}
                product={product}
                {...item}
              />
            ))}
          </Timeline>
        </Box>
      </CardContent>
    </Card>
  )
}
