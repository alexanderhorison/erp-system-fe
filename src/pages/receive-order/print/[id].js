// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Components Imports
import { useRouter } from 'next/router'
import PrintReceiveOrder from 'src/views/receive-order/PrintReceiveOrder'

const InvoicePrint = () => {
  const router = useRouter()
  const id = router.query.id
  return <PrintReceiveOrder id={id} />
}

InvoicePrint.getLayout = page => <BlankLayout>{page}</BlankLayout>
InvoicePrint.setConfig = () => {
  return {
    mode: 'light'
  }
}

export default InvoicePrint
