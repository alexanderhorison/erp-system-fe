// ** Next Imports
import { useRouter } from 'next/router'

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Shared Components
import PageHeader from 'src/views/common/PageHeader'
import AddStockOpname from 'src/views/stock-opname/AddStockOpname'

export default function HomeAddStockOpname() {
  const router = useRouter()

  return (
    <Grid container>
      <Grid item xs={12}>
        <PageHeader
          title='Buat Stock Opname'
          onBack={() => router.back()}
          breadcrumbs={[
            { label: 'Inventory' },
            { label: 'Stock Opname', href: '/stock-opname' },
            { label: 'Buat Stock Opname' }
          ]}
        />
        <AddStockOpname />
      </Grid>
    </Grid>
  )
}
