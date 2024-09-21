import { Grid, Typography } from "@mui/material";
import TableMasterRank from "src/views/master/rank/TableMasterRank";

export default function homeMasterCustomer() {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography paddingY={3} fontSize={20}>
          Master Data Rank
        </Typography>
        <TableMasterRank />
      </Grid>
    </Grid>
  )
}