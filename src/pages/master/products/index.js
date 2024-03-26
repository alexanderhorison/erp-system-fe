import { CardHeader, Grid } from '@mui/material'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addMasterDataPorduct } from 'src/store/apps/master/product'
import ModalAddMasterProduct from 'src/views/master/products/ModalAddMasterProduct'
import TableMasterProduct from 'src/views/master/products/TableMasterProduct'

export default function homeMasterProduct() {
  const dispatch = useDispatch()
  const [data, setData] = useState([])
  const [openModalAdd, setOpenModalAdd] = useState(false)

  const handleSubmitAdd = data => {
    dispatch(addMasterDataPorduct(data))
    setOpenModalAdd(false)
  }
  return (
    <Grid container spacing={6}>
      <ModalAddMasterProduct open={openModalAdd} setOpen={setOpenModalAdd} handleSubmitAdd={handleSubmitAdd} />
      <Grid item xs={12}>
        <CardHeader title='Master Data Produk' />
        <TableMasterProduct data={data} setOpenModalAdd={setOpenModalAdd} />
      </Grid>
    </Grid>
  )
}
