import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

// ** MUI Imports
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Helpers
import { fetchDashboardSalesOrderOverDueDate } from 'src/store/apps/dashboard'
import { returnToLocaleDateString } from 'src/helpers/formatDate'

// ** Shared Components
import DataTable from 'src/views/common/DataTable'
import TableToolbar from 'src/views/common/TableToolbar'
import DateCell from 'src/views/common/DateCell'
import PersonCell from 'src/views/common/PersonCell'

const RowOptions = ({ onView }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
    <Tooltip title='Lihat'>
      <IconButton onClick={onView} size='small'>
        <Icon icon='tabler:eye' fontSize='1.125rem' />
      </IconButton>
    </Tooltip>
  </Box>
)

/**
 * DashboardSo6
 * -------------------------------------------------------------------------------------
 * "List PO Melewati Batas Waktu" (Figma: sales-order dashboard — table
 * pattern matches the mockup's "List PO Melewati Batas Waktu"; this instance
 * lists overdue Sales Orders).
 */
export default function DashboardSo6() {
  const dispatch = useDispatch()
  const router = useRouter()

  const [searchText, setSearchText] = useState('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  const { dataDashboardSalesOrderOverDueDate, loadingDashboardSalesOrderOverDueDate } = useSelector(
    state => state.dashboard
  )

  const fetchData = (customParams = {}) => {
    dispatch(
      fetchDashboardSalesOrderOverDueDate({
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        ...(searchText && { search: searchText }),
        ...customParams
      })
    )
  }

  const handleSearch = searchValue => {
    setSearchText(searchValue)
    setPaginationModel(prev => ({ ...prev, page: 0 }))
    fetchData({ page: 1, search: searchValue || undefined })
  }

  const handlePaginationChange = newPaginationModel => {
    setPaginationModel(newPaginationModel)
    dispatch(
      fetchDashboardSalesOrderOverDueDate({
        page: newPaginationModel.page + 1,
        limit: newPaginationModel.pageSize,
        ...(searchText && { search: searchText })
      })
    )
  }

  const handleView = row => {
    router.push(`/sales-order/${row.code}`)
  }

  useEffect(() => {
    dispatch(fetchDashboardSalesOrderOverDueDate({ page: 1, limit: paginationModel.pageSize }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])

  return (
    <DataTable
      itemLabel='products'
      loading={loadingDashboardSalesOrderOverDueDate}
      getRowId={row => row.code}
      onRowClick={params => handleView(params.row)}
      rowCount={dataDashboardSalesOrderOverDueDate?.totalData || 0}
      paginationMode='server'
      toolbar={
        <TableToolbar
          value={searchText}
          placeholder='Cari kode'
          onChange={event => handleSearch(event.target.value)}
          clearSearch={() => handleSearch('')}
        />
      }
      columns={[
        {
          flex: 0.2,
          minWidth: 130,
          field: 'code',
          headerName: 'KODE',
          renderCell: params => (
            <Typography variant='body2' sx={{ fontWeight: 500, color: 'text.primary' }}>
              {params.row.code}
            </Typography>
          )
        },
        {
          flex: 0.25,
          minWidth: 150,
          field: 'createdAt',
          headerName: 'TANGGAL DIBUAT',
          renderCell: params => (
            <DateCell date={returnToLocaleDateString(params.row.createdAt)} timestamp={params.row.createdAt} />
          )
        },
        {
          flex: 0.25,
          minWidth: 150,
          field: 'dueDate',
          headerName: 'TANGGAL JATUH TEMPO',
          renderCell: params => (
            <DateCell date={returnToLocaleDateString(params.row.dueDate)} timestamp={params.row.dueDate} />
          )
        },
        {
          flex: 0.2,
          minWidth: 150,
          field: 'createdBy',
          headerName: 'DIBUAT OLEH',
          sortable: false,
          renderCell: params => (
            <PersonCell person={{ name: params.row.creatorName, role: params.row.creatorRole }} />
          )
        },
        {
          flex: 0.1,
          minWidth: 90,
          sortable: false,
          field: 'actions',
          headerName: 'ACTION',
          renderCell: ({ row }) => (
            <Box onClick={event => event.stopPropagation()} sx={{ width: '100%' }}>
              <RowOptions onView={() => handleView(row)} />
            </Box>
          )
        }
      ]}
      pageSizeOptions={[10, 25, 50]}
      paginationModel={paginationModel}
      onPaginationModelChange={handlePaginationChange}
      rows={dataDashboardSalesOrderOverDueDate?.data || []}
      sx={{ '& .MuiDataGrid-row': { cursor: 'pointer' } }}
    />
  )
}
