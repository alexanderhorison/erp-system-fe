import Grid from '@mui/material/Grid'
import { useRouter } from 'next/router'

import PageHeader from 'src/views/common/PageHeader'
import AddInternalTransfer from 'src/views/internalTransfer/AddInternalTransfer'

export default function InternalTransferAdd() {
  const router = useRouter()

  return (
    <Grid container>
      <Grid item xs={12}>
        <PageHeader
          title='Pembuatan Surat Internal Transfer'
          onBack={() => router.back()}
          breadcrumbs={[
            { label: 'Inventory' },
            { label: 'Stock Management' },
            { label: 'Internal Transfer', href: '/internal-transfer' },
            { label: 'Pembuatan' }
          ]}
        />
        <AddInternalTransfer />
      </Grid>
    </Grid>
  )
}
