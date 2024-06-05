// ** Third Party Imports
import axios from 'src/configs/axios'
import { useSelector } from 'react-redux'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Components Imports
import PrintInvoice from 'src/views/delivery-order/PrintInvoice'
import { useRouter } from 'next/router'

const InvoicePrint = () => {
  const router = useRouter()
  const id = router.query.id
  return <PrintInvoice id={id} />
}

InvoicePrint.getLayout = page => <BlankLayout>{page}</BlankLayout>
InvoicePrint.setConfig = () => {
  return {
    mode: 'light'
  }
}

export default InvoicePrint
