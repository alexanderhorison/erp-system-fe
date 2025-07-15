import { Grid, Typography } from '@mui/material'
import TableShortTerm from 'src/views/liabilities/short-term/TableShortTerm'

export default function ShortTermLiabilities() {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography paddingY={3} fontSize={20}>
          Liabilitas Jangka Pendek Bulanan
        </Typography>
        <TableShortTerm />
      </Grid>
    </Grid>
  )
}
