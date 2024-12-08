import { Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { fetchMasterDataCompany } from 'src/store/apps/master/company'
import PointOfSaleLayout from 'src/views/point-of-sale/PointOfSaleLayout'

export default function PointOfSale() {
  const dispatch = useDispatch()
  useEffect(() => {
    // dispatch(fetchMasterDataProduct(initialFilter))
    // dispatch(fetchMasterDataType())
    // dispatch(fetchDataMasterCategory())
    dispatch(fetchMasterDataCompany())
  }, [dispatch])

  return (
    <Grid spacing={6}>
      <Grid item xs={12}>
        <Typography fontSize={20}>Point of Sale</Typography>
      </Grid>
      <Grid item xs={12} sx={{mt: 2}}>
        <PointOfSaleLayout />
      </Grid>
    </Grid>
  )
}
