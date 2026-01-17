import { Box, Button, Card, Dialog, DialogActions, DialogContent, Grid, Typography } from '@mui/material'
import { CustomCloseButton } from '../pages/dialog-examples/DialogEditUserInfo'
import Icon from 'src/@core/components/icon'
import { useDispatch, useSelector } from 'react-redux'
import { addMasterDataProductPrice } from 'src/store/apps/master/product-price'
import { DataGrid } from '@mui/x-data-grid'
import swal from 'src/pages/sweetalert'
import { fetchDetailProductPos } from 'src/store/apps/pos'
import { environtmentColor } from 'src/helpers/getEnvirontmentColor'

export default function ModalAddBasePrice({ open, setOpen, product, setSelected }) {
  const dispatch = useDispatch()
  const handleClose = () => {
    const warehouse = JSON.parse(localStorage.getItem('warehousePos'))
      dispatch(fetchDetailProductPos({ warehouseId: warehouse?.warehouseId, productId: product?.productId }))
    setSelected(null)
    setOpen(false)
  }

  const { data } = useSelector(state => state.masterProductPrice)

  // Add the hardcoded product name to each row
  const rowsWithProductName = data?.map(row => ({
    ...row,
    productName: product?.productName, //
    productId: product?.productId
  }))

  const columns = [
    {
      flex: 0.25,
      minWidth: 200,
      editable: false,
      field: 'productName',
      headerName: 'Product'
    },
    {
      flex: 0.15,
      minWidth: 230,
      field: 'unitName',
      editable: false,
      headerName: 'Unit'
    },
    {
      flex: 0.20,
      minWidth: 200,
      editable: true,
      type: 'number',
      align: 'left',
      headerName: 'Base Price Pos',
      field: 'basePricePos',
      headerAlign: 'left'
    }
  ]

  const onChangeVal = (newRow, oldRow) => {
    if (newRow.basePricePos < 0) {
      newRow.basePricePos = 0
      swal.fire({
        icon: 'error',
        title: 'Base price pos harus lebih dari 0',
        timer: 2000,
        confirmButtonColor: environtmentColor()
      })
    } else {
      dispatch(addMasterDataProductPrice(newRow))
    }
    return newRow
  }

  return (
    <>
      <Card>
        <Dialog
          fullWidth
          open={open}
          maxWidth='md'
          scroll='body'
          onClose={handleClose}
          disableEnforceFocus
          sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
        >
          <DialogContent>
            <CustomCloseButton onClick={handleClose}>
              <Icon icon='tabler:x' fontSize='1.25rem' />
            </CustomCloseButton>
            <DataGrid
              sx={{ marginTop: 2 }}
              columns={columns}
              rows={rowsWithProductName?.slice(0, 10)}
              autoHeight={true}
              processRowUpdate={onChangeVal}
              experimentalFeatures={{ newEditingApi: true }}
            />
          </DialogContent>
        </Dialog>
      </Card>
    </>
  )
}
