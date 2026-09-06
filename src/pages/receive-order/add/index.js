import { useRouter } from 'next/router'
import Grid from '@mui/material/Grid'
import TableAllChooseReceiveOrder from 'src/views/receive-order/TableAllChooseReceiveOrder'

// ** Shared Components
import PageHeader from 'src/views/common/PageHeader'

export default function AddReceiveOrder() {
  const router = useRouter()

  return (
    <Grid container>
      <Grid item xs={12}>
        <PageHeader
          title='Pilih Surat Jalan'
          subtitle='Pilih surat jalan yang akan diterima'
          onBack={() => router.back()}
          breadcrumbs={[
            { label: 'Home' },
            { label: 'Penerimaan Surat Jalan', href: '/receive-order' },
            { label: 'Pilih Surat Jalan' }
          ]}
        />
        <TableAllChooseReceiveOrder />
      </Grid>
    </Grid>
  )
}
