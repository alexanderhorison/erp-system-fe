import { Box, Card, IconButton, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import Icon from 'src/@core/components/icon'
import { autoSavePos } from 'src/helpers/pos/autoSavePos'
import { priceFormat } from 'src/helpers/priceFormatter'

const RowOptions = ({ row, setSelectedCustomerPos, setOpen }) => {
  const dataCustomer = {
    id: row.id,
    name: row.name,
    email: row.email || "",
    totalPos: row.totalPos || 0,
    totalAmountPos: row.totalAmountPos || 0,
    totalAmountPaidPos: row.totalAmountPaidPos || 0,
    totalAmountDebtPos: row.totalAmountDebtPos || 0,
  }
  const handleAddCustomerPos = () => {
    setSelectedCustomerPos(dataCustomer)
    localStorage.setItem('selectedCustomerPos', JSON.stringify(dataCustomer))
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
            headerName: 'Email & Phone',
            renderCell: params => {
              return (
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row?.email || "-"}
                  </Typography>
                  <Typography noWrap variant='caption' sx={{ textAlign: 'center' }}>
                    {params.row?.phoneNumber || "-"}
                  </Typography>
                </Box>

              )
            }
          },
          {
            flex: 0.2,
            minWidth: 120,
            field: 'totalAmountDebtPos',
            headerName: 'Hutang',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {priceFormat(params.row?.totalAmountDebtPos || 0)}
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
            renderCell: ({ row }) => <RowOptions row={row} setSelectedCustomerPos={setSelectedCustomerPos} setOpen={setOpen} />
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
