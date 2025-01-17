// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Components Imports
import { useRouter } from 'next/router'
import PrintPointOfSale from 'src/views/point-of-sale/transaction/PrintPointOfSale'

const PointOfSalePrint = () => {
  const router = useRouter()
  const id = router.query.id
  return <PrintPointOfSale id={id} />
}

PointOfSalePrint.getLayout = page => <BlankLayout>{page}</BlankLayout>
PointOfSalePrint.setConfig = () => {
  return {
    mode: 'light'
  }
}

export default PointOfSalePrint
