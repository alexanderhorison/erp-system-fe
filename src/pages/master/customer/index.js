import { Grid, Typography } from "@mui/material";
import TableMasterCustomer from "src/views/master/customer/TableMasterCustomer";

export default function homeMasterCustomer() {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography paddingY={3} fontSize={20}>
          Master Data Customer
        </Typography>
        <TableMasterCustomer />
      </Grid>
    </Grid>
  )
}