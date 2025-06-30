import { Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import TableNonCurrentAsset from 'src/views/asset/non-current/TableNonCurrentAsset'

export default function NonCurrentAsset() {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Box sx={{ gap: 1, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', paddingY: 3 }}>
          <Typography fontSize={20}>Aset Tidak Lancar Bulanan</Typography>
        </Box>
        <TableNonCurrentAsset />
      </Grid>
    </Grid>
  )
}
