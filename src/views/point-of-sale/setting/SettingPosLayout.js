import { Divider, Grid, Typography, CircularProgress } from '@mui/material'
import { Box } from '@mui/system'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { swalConfirmationOnly } from 'src/helpers/swalFunctionPos'
import { fetchAllPrinter, fetchPrinterHealthCheck } from 'src/store/apps/config/configPrinter'
import Icon from 'src/@core/components/icon'
import SettingSectionPrinter from './SettingSectionPrinter'
import CardRefreshPrinter from './CardRefreshPrinter'

export default function SettingPosLayout({ setWarehouse, user, isMobile, isTablet, isLowHeight }) {
  const dispatch = useDispatch()
  const { listPrinter, loadingListPrinter, printerHealthStatus, loadingPrinterHealth } = useSelector(
    state => state.printer
  )
  const [selectedSettings, setSelectedSettings] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)
  const [lastRefreshed, setLastRefreshed] = useState(null)
  const intervalRef = useRef(null)

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

  const handleRefreshPrinter = useCallback(() => {
    dispatch(fetchPrinterHealthCheck())
    setLastRefreshed(new Date())
  }, [dispatch])

  // Auto-refresh interval: start when SETTING_PRINTER is active, stop otherwise
  useEffect(() => {
    if (selectedSettings === 'SETTING_PRINTER') {
      intervalRef.current = setInterval(() => {
        handleRefreshPrinter()
      }, 300000)
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [selectedSettings, handleRefreshPrinter])

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
      // Fetch printer health check and record initial last refresh time
      dispatch(fetchPrinterHealthCheck())
      setLastRefreshed(new Date())
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
                      bgcolor={
                        selectedSettings === menu.value
                          ? `${process.env.NEXT_PUBLIC_ENVIRONTMENT == 'development' ? '#E3F2FD' : '#d6bdab'}`
                          : 'white'
                      }
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
                <>
                  <CardRefreshPrinter
                    onRefresh={handleRefreshPrinter}
                    loadingPrinterHealth={loadingPrinterHealth}
                    lastRefreshed={lastRefreshed}
                  />
                  {loadingListPrinter ? (
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '80%',
                        flexDirection: 'column',
                        gap: 2
                      }}
                    >
                      <CircularProgress />
                      <Typography variant='body2' color='textSecondary'>
                        Loading printer list...
                      </Typography>
                    </Box>
                  ) : (
                    <SettingSectionPrinter
                      key={refreshKey}
                      printerList={listPrinter}
                      printerHealthStatus={printerHealthStatus}
                      handleSelectPrinter={handleSelectPrinter}
                    />
                  )}
                </>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}
