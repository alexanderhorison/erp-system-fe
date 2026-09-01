import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Store Imports
import { fetchAllRequestOrder } from 'src/store/apps/product-request-order'

// ** Shared Components
import PageHeader from 'src/views/common/PageHeader'
import TableRequestProduct from 'src/views/product-request/TableProductRequest'

export default function ProductRequest() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchAllRequestOrder())
  }, [dispatch])

  return (
    <Grid container>
      <Grid item xs={12}>
        <PageHeader
          title='Daftar Product Request'
          breadcrumbs={[{ label: 'Home' }, { label: 'Product Request' }]}
        />
        {/* The month/year `TimeFilter` that used to sit beside the title is now
            part of the table's shared filter panel. */}
        <TableRequestProduct />
      </Grid>
    </Grid>
  )
}
