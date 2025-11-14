// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Components Imports
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import PrintGoodsOut from 'src/views/adjustment/goods-out/PrintGoodsOut'
import { fetchCompanyInfo } from 'src/store/apps/config/configCompany'

const PrintAdjustmentGoodsOut = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const id = router.query.id

  useEffect(() => {
    if (id) {
      dispatch(fetchCompanyInfo())
    }
  }, [id, dispatch])

  return <PrintGoodsOut id={id} />
}

PrintAdjustmentGoodsOut.getLayout = page => <BlankLayout>{page}</BlankLayout>
PrintAdjustmentGoodsOut.setConfig = () => {
  return {
    mode: 'light'
  }
}

export default PrintAdjustmentGoodsOut
