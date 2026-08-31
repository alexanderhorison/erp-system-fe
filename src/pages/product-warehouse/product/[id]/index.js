import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Skeleton from '@mui/material/Skeleton'

import { fetchHistoryLoanProduct, fetchHistoryProduct } from 'src/store/apps/product-warehouse'

// ** Shared Components
import PageHeader from 'src/views/common/PageHeader'
import CustomTab from 'src/views/common/CustomTab'
import TableHistoryProduct from 'src/views/product-warehouse/product/TableHistoryProduct'

// ** Design Tokens
import { colors, radii, shadows } from 'src/configs/designTokens'

export default function HomeProduct() {
  const router = useRouter()
  const dispatch = useDispatch()
  const id = router.query.id

  const [activeTab, setActiveTab] = useState('stock-history')
  const [loadingTab, setLoadingTab] = useState(false)

  const { listHistory: data, listHistoryLoan, loadingListHistory } = useSelector(state => state.productWarehouse)

  // ** `router.query` is empty on the first render of a dynamic route, so `id`
  // starts undefined. Firing then would request `/history/undefined`, which the
  // API rejects and the thunk surfaces as an error toast before the real
  // request even runs.
  useEffect(() => {
    if (!id) return
    dispatch(fetchHistoryProduct({ id }))
    dispatch(fetchHistoryLoanProduct({ id }))
  }, [dispatch, id])

  const tabList = [
    { label: 'Stock History', value: 'stock-history', icon: 'tabler:clock-stop' },
    { label: 'Stock Loan History', value: 'stock-loan-history', icon: 'tabler:history' }
  ]

  const product = data?.product
  const title = product?.productName ? `${product.productName} - ${product.unitName}` : 'Product History'

  // ** Skeletons keep the header and tabs in place while the two history
  // requests resolve, instead of collapsing the page to a bare spinner.
  if (loadingListHistory) {
    return (
      <Grid container>
        <Grid item xs={12}>
          <Skeleton variant='text' width={280} height={38} />
          <Skeleton variant='text' width={160} height={22} sx={{ mb: 4 }} />
          <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
            <Skeleton variant='rounded' width={150} height={38} />
            <Skeleton variant='rounded' width={170} height={38} />
          </Box>
          <Card
            elevation={0}
            sx={{ p: 4, borderRadius: `${radii.lg}px`, border: `1px solid ${colors.border}`, boxShadow: shadows.xs }}
          >
            {[0, 1, 2].map(row => (
              <Box key={row} sx={{ display: 'flex', gap: 3, mb: 4 }}>
                <Skeleton variant='circular' width={28} height={28} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant='text' width={220} height={20} />
                  <Skeleton variant='rounded' height={92} sx={{ mt: 1 }} />
                </Box>
              </Box>
            ))}
          </Card>
        </Grid>
      </Grid>
    )
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <PageHeader
          title={title}
          subtitle={product?.rackName}
          onBack={() => router.back()}
          breadcrumbs={[
            { label: 'Inventory' },
            { label: 'Stock Management' },
            { label: 'Warehouses', href: '/product-warehouse/warehouse' },
            { label: 'Product History' }
          ]}
        />

        <Box sx={{ mb: 4 }}>
          <CustomTab
            tabContentList={tabList}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            loading={loadingTab}
            setLoadingTab={setLoadingTab}
          />
        </Box>

        {activeTab === 'stock-history' && (
          <TableHistoryProduct history={data?.history} product={data?.product} />
        )}
        {activeTab === 'stock-loan-history' && (
          <TableHistoryProduct history={listHistoryLoan?.history} product={listHistoryLoan?.product} />
        )}
      </Grid>
    </Grid>
  )
}
