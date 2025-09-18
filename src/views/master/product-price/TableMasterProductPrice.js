import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { DataGrid } from '@mui/x-data-grid'
import { useDispatch, useSelector } from 'react-redux'
import { useState, useCallback, useEffect } from 'react'
import swal from 'src/pages/sweetalert'
import { forceUpdateMasterDataModal } from 'src/store/apps/master/modal'
import { addMasterDataProductPrice, fetchMasterDataProductPrice } from 'src/store/apps/master/product-price'

export default function TableMasterProductPrice({ product }) {
  const dispatch = useDispatch()
  const { data, loading, pagination } = useSelector(state => state.masterProductPrice)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  // Add the hardcoded product name to each row
  const rowsWithProductName = data?.map(row => ({
    ...row,
    productName: product?.name,
    productId: product?.id
  }))

  const handlePaginationChange = (newPaginationModel) => {
    setPaginationModel(newPaginationModel)

    const params = {
      page: newPaginationModel.page + 1, // Backend expects 1-based pagination
      limit: newPaginationModel.pageSize,
      productId: product?.id
    }

    dispatch(fetchMasterDataProductPrice(params))
  }

  useEffect(() => {
    if (product?.id) {
      const params = {
        page: 1,
        limit: 10,
        productId: product.id
      }
      dispatch(fetchMasterDataProductPrice(params))
    }
  }, [dispatch, product?.id])

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
      headerName: 'Master Modal',
      field: 'masterModal',
      headerAlign: 'left'
    }
  ]

  const onChangeVal = (newRow, oldRow) => {
    // Mengidentifikasi kolom yang diubah
    const changedField = Object.keys(newRow).find(key => newRow[key] !== oldRow[key]);
    console.log(newRow);
    
    if (changedField === 'basePrice') {
      if (newRow.basePrice < 0) {
        newRow.basePrice = 0
        swal.fire({
          icon: 'error',
          title: 'Base price harus lebih dari 0',
          timer: 2000,
          confirmButtonColor: '#6F4E37'
        })
      } else {
        dispatch(addMasterDataProductPrice(newRow))
      }
      return newRow
    } else if (changedField === 'masterModal') {
      if (newRow.masterModal < 0) {
        newRow.masterModal = 0
        swal.fire({
          icon: 'error',
          title: 'Master Modal harus lebih dari 0',
          timer: 2000,
          confirmButtonColor: '#6F4E37'
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
          loading={loading}
          columns={columns}
          rows={rowsWithProductName || []}
          rowCount={pagination?.total || 0}
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={handlePaginationChange}
          pageSizeOptions={[5, 10, 25, 50]}
          autoHeight={true}
          processRowUpdate={onChangeVal}
          experimentalFeatures={{ newEditingApi: true }}
        />
      </Box>
    </Card>
  )
}
