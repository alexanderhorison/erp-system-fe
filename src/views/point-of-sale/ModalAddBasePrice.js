import Typography from '@mui/material/Typography'
import { useDispatch, useSelector } from 'react-redux'
import { addMasterDataProductPrice } from 'src/store/apps/master/product-price'
import { notifyError } from 'src/helpers/notify'
import { fetchDetailProductPos } from 'src/store/apps/pos'

// ** Shared Components
import AppModal from 'src/views/common/AppModal'
import DataTable from 'src/views/common/DataTable'

// ** Design Tokens
import { colors } from 'src/configs/designTokens'

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
      headerName: 'PRODUCT'
    },
    {
      flex: 0.15,
      minWidth: 140,
      field: 'unitName',
      editable: false,
      headerName: 'UNIT'
    },
    {
      flex: 0.2,
      minWidth: 160,
      editable: true,
      type: 'number',
      align: 'left',
      headerName: 'BASE PRICE POS',
      field: 'basePricePos',
      headerAlign: 'left'
    }
  ]

  const onChangeVal = (newRow, oldRow) => {
    if (newRow.basePricePos < 0) {
      newRow.basePricePos = 0
      notifyError('Base price pos harus lebih dari 0')
    } else {
      dispatch(addMasterDataProductPrice(newRow))
    }
    return newRow
  }

  return (
    <AppModal
      open={open}
      onClose={handleClose}
      // Cells are edited inline inside AppModal's <form>; Enter must only commit the cell.
      onSubmit={event => event.preventDefault()}
      title='Add Base Price'
      size='md'
      showActions={false}
    >
      <Typography sx={{ mb: 3, fontSize: '0.8125rem', color: colors.mutedForeground }}>
        Klik dua kali pada Base Price Pos untuk mengubah nilainya
      </Typography>
      <DataTable
        columns={columns}
        rows={rowsWithProductName?.slice(0, 10)}
        processRowUpdate={onChangeVal}
        experimentalFeatures={{ newEditingApi: true }}
      />
    </AppModal>
  )
}
