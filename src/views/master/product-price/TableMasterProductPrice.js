import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { DataGrid } from '@mui/x-data-grid'
import { useDispatch, useSelector } from 'react-redux'
import swal from 'src/pages/sweetalert'
import { forceUpdateMasterDataModal } from 'src/store/apps/master/modal'
import { addMasterDataProductPrice } from 'src/store/apps/master/product-price'
import { environtmentColor } from 'src/helpers/getEnvirontmentColor'

export default function TableMasterProductPrice({ product }) {
  const dispatch = useDispatch()
  const { data } = useSelector(state => state.masterProductPrice)

  // Add the hardcoded product name to each row
  const rowsWithProductName = data?.map(row => ({
    ...row,
    productName: product?.name, //
    productId: product?.id
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
      flex: 0.25,
      minWidth: 230,
      field: 'unitName',
      editable: false,
      headerName: 'Unit'
    },
    {
      flex: 0.15,
      minWidth: 200,
      editable: true,
      type: 'number',
      align: 'left',
      headerName: 'Base Price',
      field: 'basePrice',
      headerAlign: 'left'
    },
    {
      flex: 0.15,
      minWidth: 200,
      editable: true,
      type: 'number',
      align: 'left',
      headerName: 'Base Price Pos',
      field: 'basePricePos',
      headerAlign: 'left'
    },
    {
      flex: 0.15,
      minWidth: 200,
      editable: true,
      type: 'number',
      align: 'left',
      headerName: 'Master Modal',
      field: 'masterModal',
      headerAlign: 'left'
    }
  ]

  const onChangeVal = (newRow, oldRow) => {
    // Mengidentifikasi kolom yang diubah
    const changedField = Object.keys(newRow).find(key => newRow[key] !== oldRow[key]);
    console.log(newRow);

    if (['basePrice', 'basePricePos'].includes(changedField)) {
      if (newRow.basePrice < 0) {
        newRow.basePrice = 0
        swal.fire({
          icon: 'error',
          title: 'Base price harus lebih dari 0',
          timer: 2000,
          confirmButtonColor: environtmentColor()
        })
      }
      if (newRow.basePricePos < 0) {
        newRow.basePricePos = 0
        swal.fire({
          icon: 'error',
          title: 'Base price pos harus lebih dari 0',
          timer: 2000,
          confirmButtonColor: environtmentColor()
        })
      }
      dispatch(addMasterDataProductPrice(newRow))
      return newRow
    } else if (changedField === 'masterModal') {
      if (newRow.masterModal < 0) {
        newRow.masterModal = 0
        swal.fire({
          icon: 'error',
          title: 'Master Modal harus lebih dari 0',
          timer: 2000,
          confirmButtonColor: environtmentColor()
        })
      } else {
        dispatch(forceUpdateMasterDataModal({
          productId: newRow.productId,
          unitId: newRow.unitId,
          modal: newRow.masterModal
        }))
      }
      return newRow
    }
  }

  return (
    <Card>
      <Box>
        <DataGrid
          columns={columns}
          rows={rowsWithProductName?.slice(0, 10)}
          autoHeight={true}
          processRowUpdate={onChangeVal}
          experimentalFeatures={{ newEditingApi: true }}
        />
      </Box>
    </Card>
  )
}
