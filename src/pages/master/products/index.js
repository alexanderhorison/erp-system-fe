import { CardHeader, Grid } from '@mui/material'
import { useState } from 'react'
import ModalAddMasterProduct from 'src/views/master/products/ModalAddMasterProduct'
import TableMasterProduct from 'src/views/master/products/TableMasterProduct'

export default function homeMasterProduct() {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <CardHeader title='Master Data Produk' />
        <TableMasterProduct
        />
      </Grid>
    </Grid>
  )
}
