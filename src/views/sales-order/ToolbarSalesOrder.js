// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { UseAuth } from 'src/hooks/useAuth'
import { CardHeader, Typography } from '@mui/material'
import CustomChip from 'src/@core/components/mui/chip'
import { updateSalesOrder } from 'src/store/apps/sales-order'
import { priceFormat } from 'src/helpers/priceFormatter'

const ToolbarSalesOrder = ({ id, data }) => {
  const auth = UseAuth()
  const dispatch = useDispatch()
  const router = useRouter()

  const onUpdateSalesOrder = (code, type, e) => {
    dispatch(updateSalesOrder({ code, type, router }))
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
            href={`/sales-order/print/${id}`}
          >
            <Icon fontSize='1.125rem' icon='tabler:printer' />
            Cetak / Print
          </Button>
          {[1, 3].includes(auth?.user?.roleId) && data?.status == 'PENDING' ? (
            <>
              <Button
                fullWidth
                variant='contained'
                color='success'
                onClick={e => onUpdateSalesOrder(id, 'approve', e)}
                sx={{ mb: 2, '& svg': { mr: 2 } }}
              >
                <Icon fontSize='1.125rem' icon='tabler:check' />
                Terima Sales Order
              </Button>
              <Button
                fullWidth
                variant='contained'
                color='error'
                onClick={e => onUpdateSalesOrder(id, 'reject', e)}
                sx={{ mb: 2, '& svg': { mr: 2 } }}
              >
                <Icon fontSize='1.125rem' icon='tabler:x' />
                Tolak Sales Order
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
            Jika sales order diterima, barang akan dilakukan pengecekan stock, Jika cukup maka surat akan diterima dan
            stock di gudang akan dikurangi.
          </Typography>
        </CardContent>
      </Card>
      {data?.status === 'APPROVED' && data?.id && (
        <Card sx={{ marginTop: '1rem' }}>
          <CardHeader
            title='Status Pembayaran'
            action={
              <CustomChip
                rounded
                label={
                  data?.amountDebt == 0
                    ? 'LUNAS'
                    : data?.grandTotal === data?.amountDebt
                    ? 'BELUM LUNAS'
                    : 'SEBAGIAN LUNAS'
                }
                skin='light'
                color={data?.amountDebt == 0 ? 'success' : data?.grandTotal === data?.amountDebt ? 'error' : 'warning'}
              />
            }
          />
          <CardContent>
            <Typography variant='body2' color='text.secondary'>
              Total yang sudah dibayar: Rp. {priceFormat(data?.amountPaid)}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Total yang belum dibayar: Rp. {priceFormat(data?.amountDebt)}
            </Typography>
          </CardContent>
        </Card>
      )}
    </>
  )
}

export default ToolbarSalesOrder
