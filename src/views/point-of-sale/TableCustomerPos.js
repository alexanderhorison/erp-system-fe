import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

import Icon from 'src/@core/components/icon'
import { autoSavePos } from 'src/helpers/pos/autoSavePos'
import { priceFormat } from 'src/helpers/priceFormatter'

// ** Shared Components
import DataTable from 'src/views/common/DataTable'

// ** Design Tokens
import { colors } from 'src/configs/designTokens'

const RowOptions = ({ row, setSelectedCustomerPos, setOpen }) => {
  const dataCustomer = {
    id: row.id,
    name: row.name,
    email: row.email || '',
    totalPos: row.totalPos || 0,
    totalAmountPos: row.totalAmountPos || 0,
    totalAmountPaidPos: row.totalAmountPaidPos || 0,
    totalAmountDebtPos: row.totalAmountDebtPos || 0,
    lastDateDebtPos: row.lastDateDebtPos || ''
  }
  const handleAddCustomerPos = () => {
    setSelectedCustomerPos(dataCustomer)
    localStorage.setItem('selectedCustomerPos', JSON.stringify(dataCustomer))
    autoSavePos()
    setOpen(false)
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
      <IconButton onClick={handleAddCustomerPos} size='small' aria-label='Pilih customer'>
        <Icon icon='tabler:plus' fontSize='1.125rem' />
      </IconButton>
    </Box>
  )
}

export default function TableCustomerPos({
  setSelectedCustomerPos,
  setOpen,
  dataCustomer,
  paginationModel,
  setPaginationModel,
  loading,
  toolbar
}) {
  return (
    <DataTable
      itemLabel='customers'
      toolbar={toolbar}
      loading={loading}
      columns={[
        {
          flex: 0.3,
          minWidth: 160,
          field: 'name',
          headerName: 'Name'
        },
        {
          flex: 0.35,
          minWidth: 200,
          field: 'email',
          headerName: 'Email & Phone Number',
          sortable: false,
          renderCell: params => {
            return (
              <Box sx={{ display: 'flex', flexDirection: 'column', lineHeight: 1.3 }}>
                <Typography noWrap sx={{ fontSize: '0.875rem', color: colors.foreground }}>
                  {params.row?.email || '-'}
                </Typography>
                <Typography noWrap sx={{ fontSize: '0.75rem', color: colors.mutedForeground }}>
                  {params.row?.phoneNumber || '-'}
                </Typography>
              </Box>
            )
          }
        },
        {
          flex: 0.2,
          minWidth: 110,
          field: 'totalAmountDebtPos',
          headerName: 'Hutang',
          renderCell: params => (
            <Typography sx={{ fontSize: '0.875rem', color: colors.foreground }}>
              {params.row?.totalAmountDebtPos ? priceFormat(params.row.totalAmountDebtPos) : '-'}
            </Typography>
          )
        },
        {
          flex: 0.15,
          minWidth: 90,
          sortable: false,
          field: 'actions',
          headerName: 'Action',
          renderCell: ({ row }) => (
            <RowOptions row={row} setSelectedCustomerPos={setSelectedCustomerPos} setOpen={setOpen} />
          )
        }
      ]}
      pageSizeOptions={[5, 10]}
      paginationMode='server'
      rowCount={dataCustomer?.pagination?.total || 0}
      paginationModel={paginationModel}
      onPaginationModelChange={setPaginationModel}
      rows={dataCustomer?.data || []}
    />
  )
}
