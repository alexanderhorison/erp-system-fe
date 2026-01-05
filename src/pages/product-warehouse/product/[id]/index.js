import { CircularProgress, Grid, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchHistoryLoanProduct, fetchHistoryProduct } from 'src/store/apps/product-warehouse'
import ButtonBack from 'src/views/common/ButtonBack'
import CustomTab from 'src/views/common/CustomTab'
import TableHistoryProduct from 'src/views/product-warehouse/product/TableHistoryProduct'

export default function HomeProduct() {
  const router = useRouter()
  const dispatch = useDispatch()
  const id = router.query.id

  const [activeTab, setActiveTab] = useState('stock-history')
  const [loadingTab, setLoadingTab] = useState(false)

  const { listHistory: data, listHistoryLoan, loadingListHistory } = useSelector(state => state.productWarehouse)

  useEffect(() => {
    dispatch(fetchHistoryProduct({ id }))
    dispatch(fetchHistoryLoanProduct({ id }))
  }, [dispatch, id])

  const tabList = [
    {
      label: 'Stock History',
      value: 'stock-history',
      icon: 'tabler:clock-stop'
    },
    {
      label: 'Stock Loan History',
      value: 'stock-loan-history',
      icon: 'tabler:history'
    }
  ]

  if (loadingListHistory) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <CircularProgress />
        </Grid>
      </Grid>
    )
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ButtonBack paddingY={3} name={`${data?.product?.productName} - ${data?.product?.unitName}`} />
        <Grid item xs={12}>
          <CustomTab
            tabContentList={tabList}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            loading={loadingTab}
            setLoadingTab={setLoadingTab}
          />
          {activeTab === 'stock-history' && (
            <Grid item xs={12} sx={{ mt: 3 }}>
              <TableHistoryProduct history={data.history} product={data.product} />
            </Grid>
          )}
          {activeTab === 'stock-loan-history' && (
            <Grid item xs={12} sx={{ mt: 3 }}>
              <TableHistoryProduct history={listHistoryLoan.history} product={listHistoryLoan.product} />
            </Grid>
          )}
        </Grid>
      </Grid>
    </Grid>
  )
}
