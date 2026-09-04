import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import Icon from 'src/@core/components/icon'
import { Status } from 'src/@core/components/common'
import { returnFormatTime } from 'src/helpers/formatDate'
import { fetchAllSalesOrderCustomer } from 'src/store/apps/sales-order'

// ** Shared Components
import DataTable from 'src/views/common/DataTable'
import TableToolbar from 'src/views/common/TableToolbar'

// ** Design Tokens
import { colors, status as statusTokens } from 'src/configs/designTokens'

const RowOptions = ({ handleView, handleEdit, canEdit }) => (
  <Box onClick={event => event.stopPropagation()} sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
    <Tooltip title='Lihat'>
      <IconButton onClick={handleView} size='small'>
        <Icon icon='tabler:eye' fontSize='1.125rem' />
      </IconButton>
    </Tooltip>
    {canEdit && (
      <Tooltip title='Ubah'>
        <IconButton onClick={handleEdit} size='small'>
          <Icon icon='tabler:edit' fontSize='1.125rem' />
        </IconButton>
      </Tooltip>
    )}
  </Box>
)

/** Date over the time it happened, so the column stays narrow. */
const DateCell = ({ date, timestamp }) => {
  if (!date) {
    return (
      <Typography variant='body2' sx={{ color: colors.mutedForeground }}>
        -
      </Typography>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {date}
      </Typography>
      <Typography noWrap sx={{ fontSize: '0.75rem', lineHeight: '16px', color: colors.mutedForeground }}>
        {returnFormatTime(timestamp)}
      </Typography>
    </Box>
  )
}

export default function TableSalesOrderCustomer({ customerName }) {
  const dispatch = useDispatch()
  const router = useRouter()
  const id = router.query.id
  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 50 })

  const { dataSalesOrderCustomer: data, loadingDataSalesOrderCustomer: loading } = useSelector(
    state => state.salesOrder
  )

  const handleSearch = searchValue => {
    setSearchText(searchValue)
    const term = searchValue.toLowerCase()
    setFilteredData(!term ? data : (data || []).filter(row => row.code?.toLowerCase().includes(term)))
  }

  const handleRowClick = row => router.push(`/sales-order/${row.code}`)
  const handleRowEdit = row => router.push(`/sales-order/edit/${row.code}`)

  useEffect(() => {
    dispatch(fetchAllSalesOrderCustomer({ id }))
  }, [id, dispatch])

  useEffect(() => {
    setFilteredData(data)
  }, [data])

  return (
    <>
      <Typography sx={{ fontSize: '0.8125rem', color: colors.mutedForeground, mb: 3 }}>
        Seluruh transaksi sales order milik {customerName || 'customer ini'}
      </Typography>

      <DataTable
        itemLabel='sales order'
        loading={loading}
        getRowId={row => row.code}
        onRowClick={params => handleRowClick(params.row)}
        toolbar={
          <TableToolbar
            value={searchText}
            placeholder='Cari sales order'
            onChange={event => handleSearch(event.target.value)}
            clearSearch={() => handleSearch('')}
          />
        }
        columns={[
          {
            flex: 0.14,
            minWidth: 150,
            field: 'code',
            headerName: 'KODE',
            renderCell: params => (
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant='body2' sx={{ fontWeight: 500, color: 'text.primary' }}>
                  {params.row.code}
                </Typography>
                {params.row.isLoanStockSO && (
                  <Typography noWrap sx={{ fontSize: '0.75rem', lineHeight: '16px', color: colors.mutedForeground }}>
                    Loan Stock SO
                  </Typography>
                )}
              </Box>
            )
          },
          {
            flex: 0.16,
            minWidth: 130,
            field: 'createdAt',
            headerName: 'TANGGAL DIBUAT',
            renderCell: params => <DateCell date={params.row.dateCreated} timestamp={params.row.createdAt} />
          },
          {
            flex: 0.18,
            minWidth: 130,
            field: 'approvedAt',
            headerName: 'TANGGAL DIKIRIM',
            renderCell: params => <DateCell date={params.row.dateApproved} timestamp={params.row.approvedAt} />
          },
          {
            flex: 0.18,
            minWidth: 130,
            field: 'createdBy',
            headerName: 'DIBUAT OLEH',
            sortable: false,
            renderCell: params => (
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography noWrap variant='body2' sx={{ fontWeight: 500, color: 'text.primary' }}>
                  {params.row.createdBy?.name || '-'}
                </Typography>
                {params.row.createdBy?.roleName && (
                  <Typography noWrap sx={{ fontSize: '0.75rem', lineHeight: '16px', color: colors.mutedForeground }}>
                    {params.row.createdBy.roleName}
                  </Typography>
                )}
              </Box>
            )
          },
          {
            flex: 0.11,
            minWidth: 110,
            field: 'status',
            headerName: 'STATUS',
            renderCell: params => <Status status={params.row.status} />
          },
          {
            flex: 0.13,
            minWidth: 100,
            sortable: false,
            field: 'actions',
            headerName: 'ACTION',
            renderCell: ({ row }) => (
              <RowOptions
                handleView={() => handleRowClick(row)}
                handleEdit={() => handleRowEdit(row)}
                canEdit={row.status === 'PENDING'}
              />
            )
          }
        ]}
        pageSizeOptions={[25, 50, 100]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        rows={filteredData}
        getRowClassName={params => (params.row.amountDebt ? 'row-with-debt' : '')}
        sx={{
          '& .MuiDataGrid-row': { cursor: 'pointer' },
          '& .row-with-debt': {
            backgroundColor: statusTokens.danger.bg,
            '&:hover': { backgroundColor: statusTokens.danger.bg }
          }
        }}
      />
    </>
  )
}
