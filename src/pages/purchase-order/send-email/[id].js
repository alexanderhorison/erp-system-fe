// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Components Imports
import { useRouter } from 'next/router'
import GeneratePdfPurchaseOrder from 'src/views/purchase-order/GeneratePdfPurchaseOrder'

const SendEmailPage = () => {
  const router = useRouter()
  const id = router.query.id
  return <GeneratePdfPurchaseOrder id={id} />
}

SendEmailPage.getLayout = page => <BlankLayout>{page}</BlankLayout>
SendEmailPage.setConfig = () => {
  return {
    mode: 'light'
  }
}

export default SendEmailPage
