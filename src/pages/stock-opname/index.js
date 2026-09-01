// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Shared Components
import PageHeader from 'src/views/common/PageHeader'
import TableListStockOpname from 'src/views/stock-opname/TableListStockOpname'

export default function HomeStockOpname() {
  return (
    <Grid container>
      <Grid item xs={12}>
        <PageHeader
          title='Daftar Stock Opname'
          breadcrumbs={[{ label: 'Inventory' }, { label: 'Stock Opname' }]}
        />
        {/* The month/year `TimeFilter` that used to sit beside the title is now
            part of the table's shared filter panel. */}
        <TableListStockOpname />
      </Grid>
    </Grid>
  )
}
