import { Card, Grid, useMediaQuery, useTheme, Typography, CircularProgress } from '@mui/material'
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
import ShiftSelectionModal from 'src/views/point-of-sale/shift/ShiftSelectionModal'
import axios from 'src/configs/axios'

export default function PointOfSale() {
  const dispatch = useDispatch()
  const { user } = UseAuth()
  const theme = useTheme()

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
  const [showShiftSelection, setShowShiftSelection] = useState(false)
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
        setShowShiftSelection(false)
      } else {
        // No current shift or shift is null (from previous day)
        setShowShiftSelection(true)
      }
    } catch (error) {
      // If 404, user needs to select shift
      if (error.response?.status === 404) {
        setShowShiftSelection(true)
      } else {
        console.error('Error checking current shift:', error)
      }
    } finally {
      setShiftLoading(false)
    }
  }

  const handleShiftSelected = shift => {
    setCurrentShift(shift)
    setShowShiftSelection(false)
  }

  const handleShiftEnded = () => {
    setCurrentShift(null)
    setShowShiftSelection(true)
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

  // Status printer akan di-fetch otomatis dari backend via Redux
  // Tidak perlu manual connect dari frontend lagi

  return (
    <>
      {/* Shift Selection Modal */}
      <ShiftSelectionModal open={showShiftSelection} onShiftSelected={handleShiftSelected} />

      <Box
        sx={{
          height: '100vh',
          maxHeight: '100vh',
          overflow: 'hidden',
          p: isLowHeight ? 1 : 2,
          display: 'flex',
          gap: isLowHeight ? 5 : 0,
          flexDirection: 'column',
          boxSizing: 'border-box'
        }}
      >
        {/* Header Section - Responsive */}
        <Box
          sx={{
            height: responsiveHeight.headerHeight,
            minHeight: responsiveHeight.headerHeight,
            maxHeight: responsiveHeight.headerHeight,
            mb: isLowHeight ? 0.5 : -3,
            flexShrink: 0
          }}
        >
          <Grid container spacing={isLowHeight ? 1 : 2} sx={{ height: '100%' }}>
            <Grid item xs={12} md={8}>
              <Box sx={{ height: '100%' }}>
                <MenuPosV2
                  showFilter={showFilter}
                  setShowFilter={setShowFilter}
                  setSelectedMenu={setSelectedMenu}
                  selectedMenu={selectedMenu}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ height: '100%' }}>
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
            </Grid>
          </Grid>
        </Box>

        {/* Main Content Section - Responsive */}
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            display: 'flex',
            overflow: 'hidden',
            maxHeight: `calc(100vh - ${responsiveHeight.headerHeight})` // Use actual header height to avoid overflow
          }}
        >
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
              {selectedMenu?.code === 'POS' && (
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
              )}

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
        </Box>
      </Box>
    </>
  )
}
