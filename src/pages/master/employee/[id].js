import { Grid } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMasterDataEmployeeDetail } from 'src/store/apps/master/employee'
import ButtonBack from 'src/views/common/ButtonBack'
import DetailEmployee from 'src/views/master/employee/DetailEmployee'

export default function DetailMasterEmployee() {
  const dispatch = useDispatch()
  const query = useRouter().query

  const { loadingDetail, detail: detailEmployee } = useSelector(state => state.masterEmployee)

  useEffect(() => {
    if (query?.id) {
      dispatch(fetchMasterDataEmployeeDetail(query.id))
    }
  }, [query.id, dispatch])

  return (
    <Grid container spacing={6}>
      <ButtonBack name='Detail Data Karyawan' paddingY={0} />
      <Grid item xs={12}>
        <DetailEmployee data={detailEmployee} loading={loadingDetail} />
      </Grid>
    </Grid>
  )
}
