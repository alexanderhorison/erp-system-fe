import { Card, CardContent,  Grid, Skeleton, useTheme, Tabs, Tab } from '@mui/material'
import { Box } from '@mui/system'
import { useState } from 'react'
import Icon from 'src/@core/components/icon'
import ModalAddMasterEmployee from './ModalAddMasterEmployee'
import CardEmployee from './CardEmployee'
import EmployeeInformation from './EmployeeInformation'
import EmployeeDebtInformation from './EmployeeDebtInformation'

export default function DetailEmployee({ data, loading }) {
  const [openModal, setOpenModal] = useState(false)
  const [tabValue, setTabValue] = useState('INFORMATION')

  const theme = useTheme()

  const handleEdit = () => {
    setOpenModal(true)
  }

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue)
  }

  if (loading) {
    return <Skeleton variant='rectangular' sx={{ borderRadius: 1, height: { xs: 300, md: 400 } }} />
  }

  return (
    <Card
      sx={{
        padding: 4,
        transition: 'all 0.3s ease',
        '&:hover': { boxShadow: theme.shadows[10] }
      }}
    >
      <CardContent>
        <Grid container spacing={4}>
          <Grid item xs={12} md={3} sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
            <CardEmployee data={data} handleEdit={handleEdit} />
          </Grid>
          <Grid item xs={12} md={9} sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Tabs
                value={tabValue}
                onChange={handleChangeTab}
                aria-label='employee tabs'
                textColor='primary'
                indicatorColor='primary'
                variant='fullWidth'
              >
                <Tab
                  value='INFORMATION'
                  label='Informasi Karyawan'
                  icon={<Icon icon='mdi:account-details' />}
                  iconPosition='start'
                />
                <Tab
                  value='DEBT'
                  label='Informasi Utang'
                  icon={<Icon icon='mdi:cash-multiple' />}
                  iconPosition='start'
                />
              </Tabs>
            </Box>
            {tabValue === 'INFORMATION' && <EmployeeInformation data={data} />}
            {tabValue === 'DEBT' && <EmployeeDebtInformation data={data} />}
          </Grid>
        </Grid>
      </CardContent>
      <ModalAddMasterEmployee open={openModal} setOpen={setOpenModal} typeModal={'EDIT'} id={data.id} />
    </Card>
  )
}
