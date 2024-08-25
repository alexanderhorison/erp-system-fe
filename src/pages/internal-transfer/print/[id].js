// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Components Imports
import { useRouter } from 'next/router'
import PrintDetailInternalTransfer from 'src/views/internalTransfer/PrintDetailInternalTransfer'

const PrintInternalTransfer = () => {
  const router = useRouter()
  const id = router.query.id
  return <PrintDetailInternalTransfer id={id} />
}

PrintInternalTransfer.getLayout = page => <BlankLayout>{page}</BlankLayout>
PrintInternalTransfer.setConfig = () => {
  return {
    mode: 'light'
  }
}

export default PrintInternalTransfer
