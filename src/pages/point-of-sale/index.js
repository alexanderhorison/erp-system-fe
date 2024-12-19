import { Button, Grid, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { fetchDataMasterCategory } from 'src/store/apps/master/category'
import { fetchMasterDataCompany } from 'src/store/apps/master/company'
import { fetchMasterDataType } from 'src/store/apps/master/type'
import { fetchListProductPos } from 'src/store/apps/pos'
import PointOfSaleLayout from 'src/views/point-of-sale/PointOfSaleLayout'
import FilterWarehouse from '../components/filter/FilterWarehouse'

export default function PointOfSale() {
  const dispatch = useDispatch()
  const [showFilter, setShowFIlter] = useState(true)
  const [warehouse, setWarehouse] = useState(JSON.parse(localStorage.getItem('warehousePos')) || {})

  const handleChangeQuery = ({ key, value }) => {
    setWarehouse(prev => ({ ...prev, [key]: value }))
    localStorage.setItem('warehousePos', JSON.stringify({ warehouseId: value }))
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
      <Grid item xs={12} display={"flex"} mx={2} gap={2}>
        <FilterWarehouse data={warehouse} includeAllWarehouse={false} handleChangeQuery={handleChangeQuery} />
        <Button
          size='small'
          variant={showFilter ? 'contained' : 'outlined'}
          onClick={() => {
            setShowFIlter(!showFilter)
          }}
        >
          {`Show Filter`}
        </Button>
      </Grid>
      <Grid item xs={12} sx={{ mt: 2 }}>
        <PointOfSaleLayout
          showFilter={showFilter}
          setShowFIlter={() => setShowFIlter(!showFilter)}
        />
      </Grid>
    </Grid>
  )
}
