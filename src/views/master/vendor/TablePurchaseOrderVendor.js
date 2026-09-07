import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import Icon from 'src/@core/components/icon'
import { Status } from 'src/@core/components/common'
import HandleSearh from 'src/helpers/handleSearch'
import { fetchAllPurchaseOrderVendor } from 'src/store/apps/purchase-order'

// ** Shared Components
import DataTable from 'src/views/common/DataTable'
import TableToolbar from 'src/views/common/TableToolbar'
import DateCell from 'src/views/common/DateCell'
import PersonCell from 'src/views/common/PersonCell'

// ** Design Tokens
import { status as statusTokens } from 'src/configs/designTokens'

const RowOptions = ({ handleView }) => (
  <Box onClick={event => event.stopPropagation()} sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
    <Tooltip title='Lihat'>
      <IconButton onClick={handleView} size='small'>
        <Icon icon='tabler:eye' fontSize='1.125rem' />
      </IconButton>
    </Tooltip>
  </Box>
)

export default function TablePurchaseOrderVendor({ vendorName }) {
  const dispatch = useDispatch()
  const router = useRouter()
  const id = router.query.id
  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 50 })

  const { dataPurchaseOrderVendor: data, loadingDataPurchaseOrderVendor: loading } = useSelector(
    state => state.purchaseOrder
  )

  const handleSearch = searchValue => {
    setSearchText(searchValue)
    HandleSearh({ data, keys: ['code'], searchValue, setData: setFilteredData })
  }

  const handleRowClick = row => router.push(`/purchase-order/${row.code}`)

  useEffect(() => {
    dispatch(fetchAllPurchaseOrderVendor({ id }))
  }, [id, dispatch])

  useEffect(() => {
    setFilteredData(data)
  }, [data])

  return (
    <>
      <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary', mb: 3 }}>
        Seluruh transaksi purchase order milik {vendorName || 'vendor ini'}
      </Typography>

      <DataTable
        itemLabel='purchase order'
        loading={loading}
        getRowId={row => row.code}
        onRowClick={params => handleRowClick(params.row)}
        toolbar={
          <TableToolbar
            value={searchText}
            placeholder='Cari purchase order'
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
              <Typography variant='body2' sx={{ fontWeight: 500, color: 'text.primary' }}>
                {params.row.code}
              </Typography>
            )
          },
          {
            flex: 0.18,
            minWidth: 130,
            field: 'createdAt',
            headerName: 'TANGGAL DIBUAT',
            renderCell: params => <DateCell date={params.row.dateCreated} timestamp={params.row.createdAt} />
          },
          {
            flex: 0.18,
            minWidth: 130,
            field: 'approvedAt',
            headerName: 'TANGGAL DITERIMA',
            renderCell: params => <DateCell date={params.row.dateApproved} timestamp={params.row.approvedAt} />
          },
          {
            flex: 0.18,
            minWidth: 130,
            field: 'createdBy',
            headerName: 'DIBUAT OLEH',
            sortable: false,
            renderCell: params => <PersonCell person={params.row.createdBy} />
          },
          {
            flex: 0.13,
            minWidth: 110,
            field: 'status',
            headerName: 'STATUS',
            renderCell: params => <Status status={params.row.status} />
          },
          {
            flex: 0.11,
            minWidth: 90,
            sortable: false,
            field: 'actions',
            headerName: 'ACTION',
            renderCell: ({ row }) => <RowOptions handleView={() => handleRowClick(row)} />
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
