import { Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import TableMasterNonCurrentAsset from 'src/views/asset/master-non-current/TableMasterNonCurrentAsset'

export default function MasterNonCurrentAsset() {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Box sx={{ gap: 1, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', paddingY: 3 }}>
          <Typography fontSize={20}>Master Data Aset Tidak Lancar</Typography>
        </Box>
        <TableMasterNonCurrentAsset />
      </Grid>
    </Grid>
  )
}
