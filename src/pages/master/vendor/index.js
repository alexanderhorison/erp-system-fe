import { Grid, Typography } from "@mui/material";
import TableMasterVendor from "src/views/master/vendor/TableMasterVendor";

export default function HomeMasterDataVendor() {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography paddingY={3} fontSize={20}>
          Master Data Vendor
        </Typography>
        <TableMasterVendor />
      </Grid>
    </Grid>
  )
}