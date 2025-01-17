import { Button, Card, Grid, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { fetchDataMasterCategory } from 'src/store/apps/master/category'
import { fetchMasterDataCompany } from 'src/store/apps/master/company'
import { fetchMasterDataType } from 'src/store/apps/master/type'
import { fetchListProductPos } from 'src/store/apps/pos'
import PointOfSaleLayout from 'src/views/point-of-sale/PointOfSaleLayout'
import FilterWarehouse from '../components/filter/FilterWarehouse'
import { Box } from '@mui/system'
import MenuPos from 'src/views/point-of-sale/MenuPos'
import TransactionLayout from 'src/views/point-of-sale/transaction/TransactionLayout'

export default function PointOfSale() {
  const dispatch = useDispatch()
  const [showFilter, setShowFilter] = useState(true)
  const [showButtonFilter, setShowButtonFilter] = useState(true)
  const [warehouse, setWarehouse] = useState(JSON.parse(localStorage.getItem('warehousePos')) || {})
  const [selectedMenu, setSelectedMenu] = useState({
    name: 'POS',
    code: 'POS'
  })

  const listMenuPos = [
    {
      name: 'POS',
      code: 'POS'
    },
    {
      name: 'Transaction',
      code: 'TRANSACTION'
    }
  ]

  const handleChangeQuery = ({ key, value }) => {
    setWarehouse(prev => ({ ...prev, [key]: value }))
    localStorage.setItem('warehousePos', JSON.stringify({ warehouseId: value }))
    localStorage.removeItem('listProductPos')
    dispatch(fetchListProductPos({ id: value }))
  }

  useEffect(() => {
    dispatch(fetchMasterDataType())
    dispatch(fetchDataMasterCategory())
    dispatch(fetchMasterDataCompany())
  }, [dispatch])

  useEffect(() => {
    if (warehouse.warehouseId) {
      dispatch(fetchListProductPos({ id: warehouse.warehouseId }))
    }
  }, [])

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} display={'flex'} mx={2} gap={2}>
        <Grid item xs={2}>
          <FilterWarehouse
            fullWidth
            data={warehouse}
            includeAllWarehouse={false}
            handleChangeQuery={handleChangeQuery}
          />
        </Grid>
        <Grid item xs={2}>
          <Button
            fullWidth
            size='small'
            sx={{ display: selectedMenu?.code === 'POS' && showButtonFilter ? 'flex' : 'none' }}
            variant={showFilter ? 'contained' : 'outlined'}
            onClick={() => {
              setShowFilter(!showFilter)
            }}
          >
            {`Show Filter`}
          </Button>
        </Grid>

        <Grid item xs={showFilter ? 4 : 2}>
          <MenuPos
            data={listMenuPos}
            onChange={setSelectedMenu}
            value={selectedMenu}
            trigger={() => {
              setShowButtonFilter(true)
            }}
          />
        </Grid>
        <Grid item xs={showFilter ? 4 : 6}>
          {/* BOOK TEMPAT SALES */}
          <Box>{/* <Typography variant='h5'></Typography> */}</Box>
        </Grid>
      </Grid>
      <Grid item xs={12} sx={{ mt: 2 }}>
        <Card>
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '77vh', p: 2 }}>
            {selectedMenu?.code === 'POS' && (
              <PointOfSaleLayout
                showFilter={showFilter}
                setShowFilter={setShowFilter}
                warehouse={warehouse}
                setShowButtonFilter={setShowButtonFilter}
              />
            )}
            {selectedMenu?.code === 'TRANSACTION' && <TransactionLayout warehouseId={warehouse.warehouseId} />}
          </Box>
        </Card>
      </Grid>
    </Grid>
  )
}
