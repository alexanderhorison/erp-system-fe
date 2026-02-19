import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { IconButton, Tooltip } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import Icon from 'src/@core/components/icon'
import { priceFormat } from 'src/helpers/priceFormatter'
import ModalEditProductPrice from './ModalEditProductPrice'

export default function TableMasterProductPrice({ product }) {
  const { data } = useSelector(state => state.masterProductPrice)
  const [openModal, setOpenModal] = useState(false)
  const [selectedRow, setSelectedRow] = useState(null)

  // Add product context to each row
  const rowsWithProductName = data?.map(row => ({
    ...row,
    productName: product?.name,
    productId: product?.id
  }))

  const handleEditClick = row => {
    setSelectedRow(row)
    setOpenModal(true)
  }

  const columns = [
    {
      flex: 0.25,
      minWidth: 200,
      field: 'productName',
      headerName: 'Product'
    },
    {
      flex: 0.2,
      minWidth: 180,
      field: 'unitName',
      headerName: 'Unit'
    },
    {
      flex: 0.15,
      minWidth: 160,
      align: 'left',
      headerName: 'Base Price',
      field: 'basePrice',
      headerAlign: 'left',
      renderCell: ({ row }) => priceFormat(row.basePrice ?? 0)
    },
    {
      flex: 0.15,
      minWidth: 160,
      align: 'left',
      headerName: 'Base Price Pos',
      field: 'basePricePos',
      headerAlign: 'left',
      renderCell: ({ row }) => priceFormat(row.basePricePos ?? 0)
    },
    {
      flex: 0.15,
      minWidth: 160,
      align: 'left',
      headerName: 'Master Modal',
      field: 'masterModal',
      headerAlign: 'left',
      renderCell: ({ row }) => priceFormat(row.masterModal ?? 0)
    },
    {
      flex: 0.08,
      minWidth: 80,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => (
        <Tooltip>
          <IconButton size='small' onClick={() => handleEditClick(row)}>
            <Icon icon='tabler:edit' fontSize='1.2rem' />
          </IconButton>
        </Tooltip>
      )
    }
  ]

  return (
    <>
      <Card>
        <Box>
          <DataGrid
            columns={columns}
            rows={rowsWithProductName?.slice(0, 10)}
            autoHeight={true}
            disableRowSelectionOnClick
          />
        </Box>
      </Card>

      {openModal && selectedRow && (
        <ModalEditProductPrice
          open={openModal}
          setOpen={setOpenModal}
          row={selectedRow}
        />
      )}
    </>
  )
}
