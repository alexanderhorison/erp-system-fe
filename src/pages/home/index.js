// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import CustomDashboard from '../dashboards/custom'
import { useDispatch } from 'react-redux'
import { fetchMasterDataWarehouse } from 'src/store/apps/master/warehouse'
import FilterWarehouse from '../components/filter/FilterWarehouse'
import { returnFormatDate } from 'src/helpers/formatDate'

// ** Design Tokens
import { colors } from 'src/configs/designTokens'

const Homepage = () => {
  const dispatch = useDispatch()
  const user = JSON.parse(localStorage.getItem('userData'))
  const [query, setQuery] = useState({
    warehouseId: user?.warehouseId || 6
  })

  const handleChangeQuery = ({ key, value }) => {
    setQuery(prev => ({ ...prev, [key]: value }))
  }

  useEffect(() => {
    dispatch(fetchMasterDataWarehouse())
  }, [dispatch])

  return (
    <Grid container>
      <Grid item xs={12}>
        <Box
          sx={{
            mb: 4,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 3
          }}
        >
          <Box>
            <Typography variant='h3' sx={{ color: colors.foreground }}>
              Dashboard - Inventory
            </Typography>
            <Typography sx={{ fontSize: '0.875rem', color: colors.mutedForeground }}>
              Ringkasan inventori dan aktivitas gudang.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
            <Typography sx={{ fontSize: '0.8125rem', color: colors.mutedForeground, whiteSpace: 'nowrap' }}>
              Diperbarui, {returnFormatDate(new Date())}
            </Typography>
            <FilterWarehouse data={query} handleChangeQuery={handleChangeQuery} />
          </Box>
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
