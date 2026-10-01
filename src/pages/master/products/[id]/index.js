import Grid from '@mui/material/Grid'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMasterDataProductDetail } from 'src/store/apps/master/product'
import TableMasterTransformation from 'src/views/master/transformation/TableMasterTransformation'
import TableMasterProductPrice from 'src/views/master/product-price/TableMasterProductPrice'
import { fetchMasterDataProductPrice } from 'src/store/apps/master/product-price'
import PageHeader from 'src/views/common/PageHeader'
import SectionHeading from 'src/views/common/SectionHeading'

export default function MasterProductTransformation() {
  const router = useRouter()
  const dispatch = useDispatch()

  const id = router.query.id

  const { detail } = useSelector(state => state.masterProduct)

  // Fetch Detail product
  useEffect(() => {
    if (id) {
      dispatch(fetchMasterDataProductDetail(id))
      dispatch(fetchMasterDataProductPrice(id))
    }
  }, [id, dispatch])

  return (
    <Grid container>
      <Grid item xs={12}>
        <PageHeader
          title={`Master Transformasi ${detail?.name || ''}`.trim()}
          onBack={() => router.back()}
          breadcrumbs={[
            { label: 'Inventory' },
            { label: 'Data Inventory' },
            { label: 'Products', href: '/master/products' },
            { label: detail?.name || 'Detail' }
          ]}
        />
      </Grid>
      <Grid item xs={12} sx={{ mb: 4 }}>
        <SectionHeading number={1} title='Master Transformasi' />
        <TableMasterTransformation product={detail} />
      </Grid>
      <Grid item xs={12}>
        <SectionHeading number={2} title='Master Product Price And Master Modal' />
        <TableMasterProductPrice product={detail} />
      </Grid>
    </Grid>
  )
}
