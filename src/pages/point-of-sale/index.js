import { Card, Grid } from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
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

export default function PointOfSale() {
  const dispatch = useDispatch()
  const { user } = UseAuth()
  const [showFilter, setShowFilter] = useState(true)
  const [showButtonFilter, setShowButtonFilter] = useState(true)
  const [warehouse, setWarehouse] = useState(localStorage.getItem('warehousePos') ? JSON.parse(localStorage.getItem('warehousePos')) : {})

  const listMenuPos = [
    {
      name: 'POS',
      code: 'POS'
    },
    {
      name: 'Transaction',
      code: 'TRANSACTION'
    },
    {
      name: 'Open Bill',
      code: 'OPEN_BILL'
    }
  ]

  const [selectedMenu, setSelectedMenu] = useState(listMenuPos[0])

  const handleChangeQuery = ({ key, value, name }) => {
    setWarehouse(prev => ({ ...prev, [key]: value }))
    localStorage.setItem('warehousePos', JSON.stringify({ warehouseId: value, warehouseName: name }))
    localStorage.removeItem('listProductPos')
    dispatch(fetchListProductPos({ id: value }))
  }

  useEffect(() => {
    dispatch(fetchMasterDataType())
    dispatch(fetchDataMasterCategory())
    dispatch(fetchMasterDataCompany())
  }, [dispatch])

  useEffect(() => {
    if (warehouse?.warehouseId) {
      dispatch(fetchListProductPos({ id: warehouse.warehouseId }))
    }
  }, [warehouse])

  useEffect(() => {
    if (user?.warehouseId) {
      setWarehouse({
        warehouseId: user?.warehouseId,
        warehouseName: user?.warehouseName
      })
      localStorage.setItem('warehousePos', JSON.stringify({ warehouseId: user?.warehouseId, warehouseName: user?.warehouseName }))
    }
  }, [user])

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} gap={2}>
        <Box sx={{ height: '12vh' }}>
          <Grid container spacing={2} >
            <Grid item xs={8}>
              <MenuPosV2 showFilter={showFilter} setShowFilter={setShowFilter} setSelectedMenu={setSelectedMenu} selectedMenu={selectedMenu} />
            </Grid>
            <Grid item xs={4} >
              <DetailUserPos user={user} warehouse={warehouse} setWarehouse={setWarehouse} />
            </Grid>
          </Grid>
        </Box>
      </Grid>
      <Grid item xs={12} sx={{ mt: 2 }}>
        <Card>
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '70.5vh', p: 2 }}>
            {selectedMenu?.code === 'POS' && (
              <PointOfSaleLayout
                showFilter={showFilter}
                setShowFilter={setShowFilter}
                warehouse={warehouse}
                setShowButtonFilter={setShowButtonFilter}
              />
            )}
            {selectedMenu?.code === 'TRANSACTION' && <TransactionLayout warehouseId={warehouse.warehouseId} />}
            {selectedMenu?.code === 'OPEN_BILL' && <OpenBillLayout setSelectedMenu={setSelectedMenu} warehouse={warehouse}>Open Bill</OpenBillLayout>}
          </Box>
        </Card>
      </Grid>
    </Grid>
  )
}
