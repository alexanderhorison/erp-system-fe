import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import { fetchCompanyInfo } from 'src/store/apps/config/configCompany'
import PageHeader from 'src/views/common/PageHeader'
import CompanyInfoCard from 'src/views/settings/configuration-setting/CompanyInfoCard'

// ** Design Tokens
import { colors } from 'src/configs/designTokens'

export default function ConfigurationSetting() {
  const dispatch = useDispatch()

  const { loadingCompanyInfo: loading, errorCompanyInfo: error, companyInfo } = useSelector(
    state => state.companyConfig
  )

  useEffect(() => {
    dispatch(fetchCompanyInfo())
  }, [dispatch])

  return (
    <Grid container>
      <Grid item xs={12}>
        <PageHeader title='Configuration Setting' breadcrumbs={[{ label: 'Users & Permissions' }, { label: 'Configuration Setting' }]} />

        {error ? (
          <Typography sx={{ fontSize: '0.875rem', color: colors.destructive }}>
            Error loading configuration settings: {error}
          </Typography>
        ) : (
          <CompanyInfoCard companyInfo={companyInfo} loading={loading} />
        )}
      </Grid>
    </Grid>
  )
}
