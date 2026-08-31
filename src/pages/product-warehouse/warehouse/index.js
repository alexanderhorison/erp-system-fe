import Grid from '@mui/material/Grid'

import PageHeader from 'src/views/common/PageHeader'
import WarehouseCardList from 'src/views/product-warehouse/warehouse/WarehouseCardList'

export default function HomeProductWarehouse() {
  return (
    <Grid container>
      <Grid item xs={12}>
        <PageHeader
          title='Warehouse List'
          breadcrumbs={[{ label: 'Inventory' }, { label: 'Stock Management' }, { label: 'Warehouses' }]}
        />
        <WarehouseCardList />
      </Grid>
    </Grid>
  )
}
