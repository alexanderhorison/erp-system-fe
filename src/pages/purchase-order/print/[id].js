// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Components Imports
import { useRouter } from 'next/router'
import PrintPurchaseOrder from 'src/views/purchase-order/PrintPurchaseOrder'

const InvoicePrint = () => {
  const router = useRouter()
  const id = router.query.id
  return <PrintPurchaseOrder id={id} />
}

InvoicePrint.getLayout = page => <BlankLayout>{page}</BlankLayout>
InvoicePrint.setConfig = () => {
  return {
    mode: 'light'
  }
}

export default InvoicePrint
