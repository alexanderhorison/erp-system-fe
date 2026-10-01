import { useState } from 'react'
import { useSelector } from 'react-redux'

import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

import Icon from 'src/@core/components/icon'
import { priceFormat } from 'src/helpers/priceFormatter'
import ModalEditProductPrice from './ModalEditProductPrice'

// ** Shared Components
import DataTable from 'src/views/common/DataTable'

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
      headerName: 'PRODUCT'
    },
    {
      flex: 0.15,
      minWidth: 140,
      field: 'unitName',
      headerName: 'UNIT'
    },
    {
      flex: 0.15,
      minWidth: 140,
      headerName: 'BASE PRICE',
      field: 'basePrice',
      renderCell: ({ row }) => priceFormat(row.basePrice ?? 0)
    },
    {
      flex: 0.15,
      minWidth: 140,
      headerName: 'BASE PRICE POS',
      field: 'basePricePos',
      renderCell: ({ row }) => priceFormat(row.basePricePos ?? 0)
    },
    {
      flex: 0.15,
      minWidth: 140,
      headerName: 'MASTER MODAL',
      field: 'masterModal',
      renderCell: ({ row }) => priceFormat(row.masterModal ?? 0)
    },
    {
      flex: 0.1,
      minWidth: 100,
      sortable: false,
      field: 'actions',
      headerName: 'ACTION',
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          <Tooltip title='Edit'>
            <IconButton size='small' onClick={() => handleEditClick(row)}>
              <Icon icon='tabler:edit' fontSize='1.125rem' />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ]

  return (
    <>
      <DataTable columns={columns} rows={rowsWithProductName?.slice(0, 10)} />

      {openModal && selectedRow && <ModalEditProductPrice open={openModal} setOpen={setOpenModal} row={selectedRow} />}
    </>
  )
}
