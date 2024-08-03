import { Grid, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import DetailStockOpname from 'src/views/stock-opname/DetailStockOpname'

export default function HomeDetailStockOpname() {
  const { id } = useRouter().query
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography paddingY={3} fontSize={20}>
          Detail stok opname
        </Typography>
        
        <DetailStockOpname stockOpnameId={id} />
      </Grid>
    </Grid>
  )
}
