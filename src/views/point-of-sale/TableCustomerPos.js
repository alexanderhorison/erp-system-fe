import { Box, Card, IconButton, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import Icon from 'src/@core/components/icon'
import { autoSavePos } from 'src/helpers/pos/autoSavePos'

const RowOptions = ({ id, name, email, setSelectedCustomerPos, setOpen }) => {
  let customerEmail = email || "";
  const handleAddCustomerPos = () => {
    setSelectedCustomerPos({ id, name, email: customerEmail })
    localStorage.setItem('selectedCustomerPos', JSON.stringify({ id, name, email: customerEmail }))
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

export default function TableCustomerPos({
  setSelectedCustomerPos,
  setOpen,
  dataCustomer,
  paginationModel,
  setPaginationModel,
  loading,
}) {
  return (
    <Card>
      <DataGrid
        autoHeight
        loading={loading}
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
            renderCell: ({ row }) => <RowOptions id={row.id} name={row.name} email={row.email} setSelectedCustomerPos={setSelectedCustomerPos} setOpen={setOpen} />
          }
        ]}
        pageSizeOptions={[5, 10,]}
        paginationMode='server'
        rowCount={dataCustomer?.pagination?.total || 0}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        rows={dataCustomer?.data || []}
        sx={{
          '& .MuiSvgIcon-root': {
            fontSize: '1.125rem'
          }
        }}
      />
    </Card>
  )
}
