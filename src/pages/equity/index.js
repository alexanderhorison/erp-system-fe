import { Grid, Typography } from '@mui/material'
import TableEquity from 'src/views/equity/TableEquity'

export default function Equity() {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography paddingY={3} fontSize={20}>
          Ekuitas Bulanan
        </Typography>
        <TableEquity />
      </Grid>
    </Grid>
  )
}
