import { Divider, Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { swalConfirmationOnly } from 'src/helpers/swalFunctionPos'
import { fetchAllPrinter, fetchPrinterHealthCheck } from 'src/store/apps/config/configPrinter'
import Icon from 'src/@core/components/icon'
import SettingSectionPrinter from './SettingSectionPrinter'

export default function SettingPosLayout({ setWarehouse, user, isMobile, isTablet, isLowHeight }) {
  const dispatch = useDispatch()
  const { listPrinter, loadingListPrinter, printerHealthStatus } = useSelector(state => state.printer)
  const [selectedSettings, setSelectedSettings] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  const menus = [{ label: 'Pilih Printer', value: 'SETTING_PRINTER', icon: 'tabler:printer' }]

  const handleSelectPrinter = printer => {
    swalConfirmationOnly({
      title: 'Pilih Printer',
      text: `Apakah anda ingin mengganti printer menjadi ${printer.value}?`,
      confirmButtonText: 'Ya, Konfirmasi',
      showCancelButton: true,
      cancelButtonText: 'Tidak',
      onClickYes: () => {
        let printerPos = {
          id: printer.id,
          name: printer.description,
          ip: printer.value_json.ip,
          port: printer.value_json.port,
          domain_type: printer.value_json.domain_type,
          connection_type: printer.value_json.connection_type
        }
        localStorage.setItem('printerPos', JSON.stringify(printerPos))
        setRefreshKey(prev => prev + 1) // Force re-render
      }
    })
  }

  const handleSelectMenu = value => {
    setSelectedSettings(value)
    if (value === 'SETTING_PRINTER') {
      if (!listPrinter.length) {
        dispatch(
          fetchAllPrinter({
            query: {
              category: 'PRINTER',
              key: 'PRINTER_POS'
            }
          })
        )
      }
      // Fetch printer health check only if not already fetched
      if (!printerHealthStatus || printerHealthStatus.length === 0) {
        dispatch(fetchPrinterHealthCheck())
      }
    }
  }

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        p: isLowHeight ? 1 : { xs: 1, md: 3 }
      }}
    >
      {/* Header Section */}
      <Box sx={{ flexShrink: 0, mb: isLowHeight ? 1 : 2 }}>
        <Box sx={{ gap: 1, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <Typography fontSize={isLowHeight ? 14 : { xs: 16, md: 20 }}>Setting POS</Typography>
        </Box>
        <Divider />
      </Box>

      {/* Content Section */}
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <Grid container spacing={{ xs: 1, md: 3 }} sx={{ height: '100%' }}>
          <Grid item xs={12} md={6} sx={{ height: '100%' }}>
            <Box
              sx={{
                bgcolor: '#f0f0f0',
                overflowY: 'auto',
                height: '100%',
                p: isLowHeight ? 1 : { xs: 2, md: 3 },
                borderRadius: 2
              }}
            >
              <Grid container spacing={{ xs: 1, md: 2 }}>
                {menus.map(menu => (
                  <Grid item xs={6} md={3} key={menu.value}>
                    <Box
                      border={0}
                      bgcolor={selectedSettings === menu.value ? '#d6bdab' : 'white'}
                      boxShadow={1}
                      borderRadius={1}
                      height={{ xs: 80, md: 100 }}
                      display='flex'
                      flexDirection='column'
                      alignItems='center'
                      justifyContent='center'
                      onClick={() => handleSelectMenu(menu.value)} // Hanya panggil action jika tidak disable
                      style={{
                        opacity: 1,
                        pointerEvents: 'auto',
                        cursor: 'pointer'
                      }}
                    >
                      <Icon icon={menu.icon} width={isMobile ? 20 : 24} height={isMobile ? 20 : 24} />
                      <Typography variant='body2' fontSize={{ xs: '0.65rem', md: '0.75rem' }} mt={1} textAlign='center'>
                        {menu.label}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={12} md={6} sx={{ height: '100%' }}>
            <Box
              sx={{
                bgcolor: '#f0f0f0',
                overflowY: 'auto',
                height: '100%',
                p: isLowHeight ? 1 : { xs: 2, md: 3 },
                borderRadius: 2
              }}
            >
              {selectedSettings === 'SETTING_PRINTER' && (
                <SettingSectionPrinter
                  key={refreshKey}
                  printerList={listPrinter}
                  printerHealthStatus={printerHealthStatus}
                  handleSelectPrinter={handleSelectPrinter}
                />
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}
