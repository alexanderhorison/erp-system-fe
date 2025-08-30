import { Card, Grid } from '@mui/material'
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
import { connectToPrinter } from 'src/utils/printerHelper'
import RequestProductLayout from 'src/views/point-of-sale/request-product/RequestProductLayout'

export default function PointOfSale() {
  const dispatch = useDispatch()
  const { user } = UseAuth()
  const heightBody = '22.5rem'

  const [showFilter, setShowFilter] = useState(true)
  const [warehouse, setWarehouse] = useState({
    warehouseId: 6, // Hardcode gudang depan
    warehouseName: 'GUDANG DEPAN'
  })
  const [scriptEpos, setScriptEpos] = useState(false)

  const { printerStatus } = useSelector(state => state.printer)

  const printerPos = localStorage.getItem('printerPos') ? JSON.parse(localStorage.getItem('printerPos')) : null

  const [selectedMenu, setSelectedMenu] = useState({
    name: 'POS',
    code: 'POS'
  })

  useEffect(() => {
    dispatch(fetchMasterDataType())
    dispatch(fetchDataMasterCategory())
    dispatch(fetchMasterDataCompany())
  }, [dispatch])

  useEffect(() => {
    if (warehouse?.warehouseId) {
      dispatch(fetchListProductPos({ id: warehouse.warehouseId }))
    }
    // Save to localstorage
    localStorage.setItem('warehousePos', JSON.stringify(warehouse))
  }, [warehouse])

  useEffect(() => {
    if (printerPos && !printerStatus.connected) {
      connectToPrinter({ printerConfig: printerPos, dispatch })
    }
  }, [scriptEpos])

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} gap={2}>
        <Box sx={{ height: '6.5rem' }}>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <MenuPosV2
                showFilter={showFilter}
                setShowFilter={setShowFilter}
                setSelectedMenu={setSelectedMenu}
                selectedMenu={selectedMenu}
              />
            </Grid>
            <Grid item xs={4}>
              <DetailUserPos
                user={user}
                warehouse={warehouse}
                setOpenSetting={() =>
                  setSelectedMenu({
                    name: 'Setting',
                    code: 'SETTING'
                  })
                }
              />
            </Grid>
          </Grid>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Card sx={{ height: heightBody, backgroundColor: '' }}>
          <Box sx={{ display: 'grid', flexDirection: 'column', p: 2 }}>
            {selectedMenu?.code === 'POS' && (
              <PointOfSaleLayout
                showFilter={showFilter}
                setShowFilter={setShowFilter}
                warehouse={warehouse}
                setScriptEpos={setScriptEpos}
                heightBody={heightBody}
              />
            )}

            {selectedMenu?.code === 'TRANSACTION' && <TransactionLayout warehouseId={warehouse.warehouseId} />}

            {selectedMenu?.code === 'OPEN_BILL' && (
              <OpenBillLayout setSelectedMenu={setSelectedMenu} warehouse={warehouse}>
                Open Bill
              </OpenBillLayout>
            )}

            {selectedMenu?.code === 'SETTING' && <SettingPosLayout setWarehouse={setWarehouse} user={user} />}

            {selectedMenu?.code === 'REQUEST_BARANG' && <RequestProductLayout warehouseId={warehouse.warehouseId} />}
          </Box>
        </Card>
      </Grid>
    </Grid>
  )
}

PointOfSale.appBarContent = false
