import { Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";

export default function CurrentAsset() {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Box sx={{ gap: 1, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', paddingY: 3 }}>
          <Typography fontSize={20}>Aset Lancar Bulanan</Typography>
        </Box>
      </Grid>
    </Grid>
  )
}
