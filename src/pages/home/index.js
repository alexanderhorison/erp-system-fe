// ** React Imports
import { useContext, useEffect, useState } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CustomDashboard from '../dashboards/custom'
import CrmDashboard from '../dashboards/crm'
import AnalyticsDashboard from '../dashboards/analytics'
import EcommerceDashboard from '../dashboards/ecommerce'
import { useDispatch } from 'react-redux'
import { fetchMasterDataWarehouse } from 'src/store/apps/master/warehouse'
import { Box } from '@mui/system'
import FilterWarehouse from '../components/filter/FilterWarehouse'

const Homepage = () => {
  const dispatch = useDispatch()
  const user = JSON.parse(localStorage.getItem('userData'))
  const [query, setQuery] = useState({
    warehouseId: user?.warehouseId || 0,
  })

  const handleChangeQuery = ({ key, value }) => {
    setQuery(prev => ({ ...prev, [key]: value }))
  }

  useEffect(() => {
    dispatch(fetchMasterDataWarehouse())
  }, [])

  return (
    <Grid container>
      <Grid item xs={12}>
        <Box sx={{ gap: 1, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', paddingY: 3 }}>
          <Typography fontSize={20}>Dashboard</Typography>
          <FilterWarehouse
            data={query}
            handleChangeQuery={handleChangeQuery}
          />
        </Box>
      </Grid>
      <Grid item md={12} xs={12}>
        <Card>
          <CardContent>
            <CustomDashboard query={query} />
          </CardContent>
        </Card>
        {/* <Card>
          <CardHeader title='Selamat datang di inventory sistem' />
          <CardContent>
            <AnalyticsDashboard />
            <CrmDashboard />
            <EcommerceDashboard />
          </CardContent>
        </Card> */}
      </Grid>
    </Grid>
  )
}

Homepage.acl = {
  action: 'read',
  subject: 'acl-page'
}

export default Homepage