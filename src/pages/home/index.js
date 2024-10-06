// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CustomDashboard from '../dashboards/custom'
import { useDispatch } from 'react-redux'
import { fetchMasterDataWarehouse } from 'src/store/apps/master/warehouse'
import { Box } from '@mui/system'
import FilterWarehouse from '../components/filter/FilterWarehouse'

const Homepage = () => {
  const dispatch = useDispatch()
  const user = JSON.parse(localStorage.getItem('userData'))
  const [query, setQuery] = useState({
    warehouseId: user?.warehouseId || 6,
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
        <CustomDashboard query={query} />
      </Grid>
    </Grid>
  )
}

Homepage.acl = {
  action: 'read',
  subject: 'acl-page'
}

export default Homepage