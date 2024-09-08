// ** Next Import
import Link from 'next/link'
import { useRouter } from 'next/router'

// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'
import CustomChip from 'src/@core/components/mui/chip'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { UseAuth } from 'src/hooks/useAuth'
import { useDispatch } from 'react-redux'
import { CardHeader, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { approveOutstandingProduct, saveToDraftOutstandingProduct } from 'src/store/apps/receipt-order-outstanding'

const ToolbarReceiptOrderOutstanding = ({ id, toggleSendInvoiceDrawer, toggleAddPaymentDrawer, status, data }) => {
  const auth = UseAuth()
  const dispatch = useDispatch()
  const router = useRouter()

  const handleSave = () => {
    const product = data.productOutstandings.map(product => {
      return {
        id: product.productOutstandingsId,
        status: product.status
      }
    })
    dispatch(saveToDraftOutstandingProduct({ data: product, code: data.code, router }))
  }

  const handleApprove = () => {
    const code = data.code
    dispatch(approveOutstandingProduct({ data, code, router }))
  }
  return (
    <>
      <Card>
        <CardContent>
          <Button fullWidth sx={{ mb: 2 }} color='secondary' variant='tonal'>
            Unduh
          </Button>
          <Button
            fullWidth
            sx={{ mb: 2, '& svg': { mr: 2 } }}
            target='_blank'
            variant='contained'
            component={Link}
            href={`/receipt-order-outstanding/print/${data.code}`}
          >
            <Icon fontSize='1.125rem' icon='tabler:printer' />
            Cetak / Print
          </Button>
          {status == 'PENDING' ? (
            <>
              <Button
                fullWidth
                variant='contained'
                color='warning'
                onClick={e => handleSave()}
                sx={{ mb: 2, '& svg': { mr: 2 } }}
              >
                <Icon fontSize='1.125rem' icon='tabler:device-floppy' />
                Simpan Surat
              </Button>
            </>
          ) : null}
          {status == 'PENDING' ? (
            <>
              <Button
                fullWidth
                variant='contained'
                color='success'
                onClick={e => handleApprove()}
                sx={{ mb: 2, '& svg': { mr: 2 } }}
              >
                <Icon fontSize='1.125rem' icon='tabler:circle-dashed-check' />
                Selesaikan Surat
              </Button>
            </>
          ) : null}
        </CardContent>
      </Card>
      <Card sx={{ marginTop: '1rem' }}>
        <CardHeader
          title='Informasi Tambahan'
          action={<CustomChip rounded label={`Important!`} skin='light' color={`warning`} />}
        />
        <CardContent>
          <Typography variant='body2' color='text.secondary'>
            1. Anda dapat mengubah kolom status untuk memasukkan produk yang sedang dalam status outstanding, sehingga memudahkan pengelolaan stok.
          </Typography>
          <Box sx={{ marginBottom: 2 }} />
          <Typography variant='body2' color='text.secondary'>
            2. Tombol "Save" memungkinkan Anda menyimpan data sementara, sehingga Anda dapat mengeditnya lagi nanti jika diperlukan.
          </Typography>
          <Box sx={{ marginBottom: 2 }} />
          <Typography variant='body2' color='text.secondary'>
            3. Dengan menekan tombol "Selesaikan", surat outstanding akan ditutup dan produk tidak dapat diubah lagi, sehingga memastikan keakuratan dan integritas data.
          </Typography>
        </CardContent>
      </Card>

    </>
  )
}

export default ToolbarReceiptOrderOutstanding
