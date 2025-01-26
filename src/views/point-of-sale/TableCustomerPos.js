import { useState } from 'react'

import { Box, Card, IconButton, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import Icon from 'src/@core/components/icon'
import { autoSavePos } from 'src/helpers/pos/autoSavePos'

const RowOptions = ({ id, name, setSelectedCustomerPos, setOpen }) => {
  const handleAddCustomerPos = () => {
    setSelectedCustomerPos({ id, name })
    localStorage.setItem('selectedCustomerPos', JSON.stringify({ id, name }))
    autoSavePos()
    setOpen(false)
  }

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={handleAddCustomerPos}>
          <Icon icon='tabler:plus' />
        </IconButton>
      </Box>
    </>
  )
}

export default function TableCustomerPos({ setSelectedCustomerPos, setOpen, dataCustomer }) {
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 })
  return (
    <Card>
      <DataGrid
        autoHeight
        columns={[
          {
            flex: 0.1,
            minWidth: 200,
            field: 'name',
            headerName: 'Name',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.name}
                </Typography>
              )
            }
          },
          {
            flex: 0.2,
            minWidth: 120,
            field: 'email',
            headerName: 'Email',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row?.email || "-"}
                </Typography>
              )
            }
          },
          {
            flex: 0.2,
            minWidth: 120,
            field: 'phone',
            headerName: 'Phone',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row?.phoneNumber || "-"}
                </Typography>
              )
            }
          },
          {
            flex: 0.01,
            minWidth: 120,
            sortable: false,
            field: 'actions',
            headerName: 'Actions',
            renderCell: ({ row }) => <RowOptions id={row.id} name={row.name} setSelectedCustomerPos={setSelectedCustomerPos} setOpen={setOpen} />
          }
        ]}
        pageSizeOptions={[5, 10,]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        rows={dataCustomer}
        sx={{
          '& .MuiSvgIcon-root': {
            fontSize: '1.125rem'
          }
        }}
      />
    </Card>
  )
}
