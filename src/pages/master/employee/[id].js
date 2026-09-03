import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// ** MUI Imports
import Grid from '@mui/material/Grid'

import { fetchMasterDataEmployeeDetail } from 'src/store/apps/master/employee'
import DetailEmployee from 'src/views/master/employee/DetailEmployee'
import PageHeader from 'src/views/common/PageHeader'

export default function DetailMasterEmployee() {
  const dispatch = useDispatch()
  const router = useRouter()
  const query = router.query

  const { loadingDetail, detail: detailEmployee } = useSelector(state => state.masterEmployee)

  useEffect(() => {
    if (query?.id) {
      dispatch(fetchMasterDataEmployeeDetail(query.id))
    }
  }, [query.id, dispatch])

  return (
    <Grid container>
      <Grid item xs={12}>
        <PageHeader
          title='View Detail Karyawan'
          onBack={() => router.back()}
          breadcrumbs={[
            { label: 'Daily Cost' },
            { label: 'Master Data' },
            { label: 'Employees', href: '/master/employee' },
            { label: detailEmployee?.nama || 'Detail' }
          ]}
        />
        <DetailEmployee data={detailEmployee} loading={loadingDetail} />
      </Grid>
    </Grid>
  )
}
