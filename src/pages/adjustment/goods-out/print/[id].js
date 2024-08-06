// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Components Imports
import { useRouter } from 'next/router'
import PrintGoodsOut from 'src/views/adjustment/goods-out/PrintGoodsOut'

const PrintAdjustmentGoodsOut = () => {
  const router = useRouter()
  const id = router.query.id
  return <PrintGoodsOut id={id} />
}

PrintAdjustmentGoodsOut.getLayout = page => <BlankLayout>{page}</BlankLayout>
PrintAdjustmentGoodsOut.setConfig = () => {
  return {
    mode: 'light'
  }
}

export default PrintAdjustmentGoodsOut
