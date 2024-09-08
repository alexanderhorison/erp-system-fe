// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

const ToolbarReceive = ({ id, toggleSendInvoiceDrawer, toggleAddPaymentDrawer, status }) => {
  // const auth = UseAuth()
  // const dispatch = useDispatch()
  // const router = useRouter()

  // const onUpdateSuratJalan = (deliveryOrderId, e) => {
  //   // e.preventDefault()
  //   dispatch(updateReceiveOrder({ deliveryOrderId, router }))
  // }
  return (
    <Card>
      <CardContent>
        {/* <Button fullWidth variant='contained' onClick={toggleSendInvoiceDrawer} sx={{ mb: 2, '& svg': { mr: 2 } }}>
          <Icon fontSize='1.125rem' icon='tabler:send' />
          Kirim Invoice
        </Button>
        */}
        <Button fullWidth sx={{ mb: 2 }} color='secondary' variant='tonal'>
          Unduh
        </Button>
        <Button
          fullWidth
          sx={{ mb: 2, '& svg': { mr: 2 } }}
          target='_blank'
          variant='contained'
          component={Link}
          href={`/receive-order/print/${id}`}
        >
          <Icon fontSize='1.125rem' icon='tabler:printer' />
          Cetak / Print
        </Button>
        {/* {[1, 3].includes(auth?.user?.roleId) && status == 'PENDING' ? (
          <>
            <Button
              fullWidth
              variant='contained'
              onClick={e => onUpdateSuratJalan(id, e)}
              sx={{ mb: 2, '& svg': { mr: 2 } }}
            >
              <Icon fontSize='1.125rem' icon='tabler:check' />
              Terima Surat Jalan
            </Button>
          </>
        ) : null} */}
        {/* <Button
          fullWidth
          sx={{ mb: 2 }}
          variant='tonal'
          component={Link}
          color='secondary'
          href={`/apps/invoice/edit/${id}`}
        >
          Edit Invoice
        </Button> */}
        {/* <Button fullWidth variant='contained' sx={{ '& svg': { mr: 2 } }} onClick={toggleAddPaymentDrawer}>
          <Icon fontSize='1.125rem' icon='tabler:currency-dollar' />
          Add Payment
        </Button> */}
      </CardContent>
    </Card>
  )
}

export default ToolbarReceive
