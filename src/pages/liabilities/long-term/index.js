import { Grid, Typography } from '@mui/material'
import TableLongTerm from 'src/views/liabilities/long-term/TableLongTerm'

export default function LongTermLiabilities() {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography paddingY={3} fontSize={20}>
          Liabilitas Jangka Panjang Bulanan
        </Typography>
        <TableLongTerm />
      </Grid>
    </Grid>
  )
}
