// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Components Imports
import { useRouter } from 'next/router'
import PrintGoodsIn from 'src/views/adjustment/goods-in/PrintGoodsIn'

const PrintAdjustmentGoodsIn = () => {
  const router = useRouter()
  const id = router.query.id
  return <PrintGoodsIn id={id} />
}

PrintAdjustmentGoodsIn.getLayout = page => <BlankLayout>{page}</BlankLayout>
PrintAdjustmentGoodsIn.setConfig = () => {
  return {
    mode: 'light'
  }
}

export default PrintAdjustmentGoodsIn
