// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Components Imports
import { useRouter } from 'next/router'
import PrintReceiptOrderOutstanding from 'src/views/receipt-order-outstanding/PrintReceiptOrderOutstanding'

const InvoicePrint = () => {
  const router = useRouter()
  const code = router.query.code
  return <>On Progress</>
  // return <PrintReceiptOrderOutstanding code={code} />
}

InvoicePrint.getLayout = page => <BlankLayout>{page}</BlankLayout>
InvoicePrint.setConfig = () => {
  return {
    mode: 'light'
  }
}

export default InvoicePrint
