// ** Next Imports
import { useRouter } from 'next/router'

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Shared Components
import PageHeader from 'src/views/common/PageHeader'
import EditStockOpname from 'src/views/stock-opname/EditStockOpname'

export default function HomeEditStockOpname() {
  const router = useRouter()
  const { id } = router.query

  return (
    <Grid container>
      <Grid item xs={12}>
        <PageHeader
          title='Ubah Stock Opname'
          onBack={() => router.back()}
          breadcrumbs={[
            { label: 'Inventory' },
            { label: 'Stock Opname', href: '/stock-opname' },
            { label: id || 'Detail', href: `/stock-opname/${id}` },
            { label: 'Ubah' }
          ]}
        />
        <EditStockOpname />
      </Grid>
    </Grid>
  )
}
