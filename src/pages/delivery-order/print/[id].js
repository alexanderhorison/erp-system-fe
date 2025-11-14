// ** Third Party Imports
import axios from 'src/configs/axios'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Components Imports
import PrintInvoice from 'src/views/delivery-order/PrintInvoice'
import { useRouter } from 'next/router'
import { fetchCompanyInfo } from 'src/store/apps/config/configCompany'

const InvoicePrint = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const id = router.query.id

  useEffect(() => {
    if (id) {
      dispatch(fetchCompanyInfo())
    }
  }, [id, dispatch])

  return <PrintInvoice id={id} />
}

InvoicePrint.getLayout = page => <BlankLayout>{page}</BlankLayout>
InvoicePrint.setConfig = () => {
  return {
    mode: 'light'
  }
}

export default InvoicePrint
