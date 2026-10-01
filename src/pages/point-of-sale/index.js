import { Card, useMediaQuery, useTheme, Typography, CircularProgress } from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDataMasterCategory } from 'src/store/apps/master/category'
import { fetchMasterDataCompany } from 'src/store/apps/master/company'
import { fetchMasterDataType } from 'src/store/apps/master/type'
import { fetchListProductPos } from 'src/store/apps/pos'
import PointOfSaleLayout from 'src/views/point-of-sale/PointOfSaleLayout'
import { Box } from '@mui/system'
import TransactionLayout from 'src/views/point-of-sale/transaction/TransactionLayout'
import OpenBillLayout from 'src/views/point-of-sale/open-bill/OpenBillLayout'
import { UseAuth } from 'src/hooks/useAuth'
import MenuPosV2 from 'src/views/point-of-sale/MenuPosV2'
import DetailUserPos from 'src/views/point-of-sale/DetailUserPos'
import SettingPosLayout from 'src/views/point-of-sale/setting/SettingPosLayout'
import RequestProductLayout from 'src/views/point-of-sale/request-product/RequestProductLayout'
import { fetchPrinterHealthCheck } from 'src/store/apps/config/configPrinter'
import axios from 'src/configs/axios'
import { useRouter } from 'next/router'
import Logo from 'src/icons/logo'
import { colors, stone } from 'src/configs/designTokens'

export default function PointOfSale() {
  const dispatch = useDispatch()
  const { user } = UseAuth()
  const theme = useTheme()
  const router = useRouter()

  // Responsive breakpoints
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'))
  const isLowHeight = useMediaQuery('(max-height: 600px)')

  // Simplified height calculation for better scroll control
  const getResponsiveHeight = () => {
    if (isLowHeight) {
      return {
        headerHeight: '80px',
        containerHeight: '100vh'
      }
    } else if (isMobile) {
      return {
        headerHeight: '100px',
        containerHeight: '100vh'
      }
    } else if (isTablet) {
      return {
        headerHeight: '120px',
        containerHeight: '100vh'
      }
    } else {
      return {
        headerHeight: '140px',
        containerHeight: '100vh'
      }
    }
  }

  const responsiveHeight = getResponsiveHeight()

  const [showFilter, setShowFilter] = useState(true)
  const [warehouse, setWarehouse] = useState({
    warehouseId: 6, // Hardcode gudang depan
    warehouseName: 'GUDANG DEPAN'
  })
  const [scriptEpos, setScriptEpos] = useState(false)

  // Shift management state
  const [currentShift, setCurrentShift] = useState(null)
  const [shiftLoading, setShiftLoading] = useState(true)

  const { printerStatus } = useSelector(state => state.printer)

  const printerPos = localStorage.getItem('printerPos') ? JSON.parse(localStorage.getItem('printerPos')) : null

  const [selectedMenu, setSelectedMenu] = useState({
    name: 'POS',
    code: 'POS'
  })

  const cartFromTransaction = useSelector(state => state.pos.cartFromTransaction)

  // Check for current shift on component mount
  useEffect(() => {
    checkCurrentShift()
  }, [])

  const checkCurrentShift = async () => {
    try {
      setShiftLoading(true)
      const response = await axios.get('/user-shift/current')
      if (response.data?.success && response.data.data) {
        setCurrentShift(response.data.data)
      } else {
        // No current shift or shift is null (from previous day)
        // Redirect to shift selection page
        router.push('/point-of-sale-shift')
      }
    } catch (error) {
      // If 404 or 400, user needs to select shift
      if (error.response?.status === 404 || error.response?.status === 400) {
        router.push('/point-of-sale-shift')
      } else {
        console.error('Error checking current shift:', error)
        router.push('/point-of-sale-shift')
      }
    } finally {
      setShiftLoading(false)
    }
  }

  const handleShiftEnded = () => {
    setCurrentShift(null)
    // Redirect to shift selection page
    router.push('/point-of-sale-shift')
  }

  useEffect(() => {
    // Disable scrolling on this page
    document.body.style.overflow = 'hidden'
    return () => {
      // Re-enable scrolling when leaving this page
      document.body.style.overflow = 'auto'
    }
  }, [])

  useEffect(() => {
    dispatch(fetchMasterDataType())
    dispatch(fetchDataMasterCategory())
    dispatch(fetchMasterDataCompany())
    dispatch(fetchPrinterHealthCheck())
  }, [dispatch])

  useEffect(() => {
    if (warehouse?.warehouseId) {
      dispatch(fetchListProductPos({ id: warehouse.warehouseId }))
    }
    // Save to localstorage
    localStorage.setItem('warehousePos', JSON.stringify(warehouse))
  }, [warehouse])

  useEffect(() => {
    if (cartFromTransaction) {
      setSelectedMenu({ name: 'POS', code: 'POS' })
    }
  }, [cartFromTransaction])

  // Check printer health status periodically (every 30 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(fetchPrinterHealthCheck())
    }, 600000) // 60 seconds

    return () => clearInterval(interval)
  }, [dispatch])

  // Only show POS if shift is active
  if (shiftLoading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' height='100vh' flexDirection='column' gap={2}>
        <CircularProgress />
        <Typography>Memeriksa shift aktif...</Typography>
      </Box>
    )
  }

  // If no current shift, don't render anything (redirecting...)
  if (!currentShift) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' height='100vh' flexDirection='column' gap={2}>
        <CircularProgress />
        <Typography>Mengalihkan ke pemilihan shift...</Typography>
      </Box>
    )
  }

  // Status printer akan di-fetch otomatis dari backend via Redux
  // Tidak perlu manual connect dari frontend lagi

  const isPosMenu = selectedMenu?.code === 'POS'

  return (
    <>
      <Box
        sx={{
          height: '100vh',
          maxHeight: '100vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          backgroundColor: stone[100]
        }}
      >
        {/* Top bar: brand, navigation, shift and user */}
        <Box
          component='header'
          sx={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 3,
            px: { xs: 3, md: 5 },
            py: isLowHeight ? 1 : 2,
            borderBottom: `1px solid ${colors.border}`,
            backgroundColor: colors.background
          }}
        >
          <Logo width={36} height={36} style={{ flexShrink: 0 }} />
          <MenuPosV2 setSelectedMenu={setSelectedMenu} selectedMenu={selectedMenu} />
          <Box sx={{ flex: 1, minWidth: 0, display: 'flex', justifyContent: 'flex-end' }}>
            <DetailUserPos
              user={user}
              warehouse={warehouse}
              currentShift={currentShift}
              onShiftEnded={handleShiftEnded}
              setOpenSetting={() =>
                setSelectedMenu({
                  name: 'Setting',
                  code: 'SETTING'
                })
              }
            />
          </Box>
        </Box>

        {/* Main content */}
        <Box sx={{ flex: 1, minHeight: 0, display: 'flex', p: isLowHeight ? 2 : { xs: 3, md: 4 } }}>
          {isPosMenu ? (
            <Box sx={{ width: '100%', height: '100%', minHeight: 0 }}>
              <PointOfSaleLayout
                showFilter={showFilter}
                setShowFilter={setShowFilter}
                warehouse={warehouse}
                setScriptEpos={setScriptEpos}
                heightBody={responsiveHeight.bodyHeight}
                isMobile={isMobile}
                isTablet={isTablet}
                isLowHeight={isLowHeight}
              />
            </Box>
          ) : (
            <Card
              sx={{
                width: '100%',
                height: '100%',
                maxHeight: '100%',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Box
                sx={{
                  height: '100%',
                  p: isLowHeight ? 1 : 2,
                  pb: isLowHeight ? 2 : 3,
                  overflow: 'auto',
                  minHeight: 0,
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {selectedMenu?.code === 'TRANSACTION' && (
                  <TransactionLayout
                    warehouseId={warehouse.warehouseId}
                    isMobile={isMobile}
                    isTablet={isTablet}
                    isLowHeight={isLowHeight}
                  />
                )}

                {selectedMenu?.code === 'OPEN_BILL' && (
                  <OpenBillLayout
                    setSelectedMenu={setSelectedMenu}
                    warehouse={warehouse}
                    isMobile={isMobile}
                    isTablet={isTablet}
                    isLowHeight={isLowHeight}
                  >
                    Open Bill
                  </OpenBillLayout>
                )}

                {selectedMenu?.code === 'SETTING' && (
                  <SettingPosLayout
                    setWarehouse={setWarehouse}
                    user={user}
                    isMobile={isMobile}
                    isTablet={isTablet}
                    isLowHeight={isLowHeight}
                  />
                )}

                {selectedMenu?.code === 'REQUEST_BARANG' && (
                  <RequestProductLayout
                    warehouseId={warehouse.warehouseId}
                    isMobile={isMobile}
                    isTablet={isTablet}
                    isLowHeight={isLowHeight}
                  />
                )}
              </Box>
            </Card>
          )}
        </Box>
      </Box>
    </>
  )
}
