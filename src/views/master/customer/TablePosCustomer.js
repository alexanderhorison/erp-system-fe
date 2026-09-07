import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import Icon from 'src/@core/components/icon'
import { Status } from 'src/@core/components/common'
import { fetchAllPointOfSaleByCustomerId, fetchDetailPointOfSale } from 'src/store/apps/pos'
import ModalViewTransactionV4 from 'src/views/point-of-sale/transaction/ModalViewTransactionV4'

// ** Shared Components
import DataTable from 'src/views/common/DataTable'
import TableToolbar from 'src/views/common/TableToolbar'
import DateCell from 'src/views/common/DateCell'

// ** Design Tokens
import { colors } from 'src/configs/designTokens'

const RowOptions = ({ handleView }) => (
  <Box onClick={event => event.stopPropagation()} sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
    <Tooltip title='Lihat'>
      <IconButton onClick={handleView} size='small'>
        <Icon icon='tabler:eye' fontSize='1.125rem' />
      </IconButton>
    </Tooltip>
  </Box>
)

export default function TablePosCustomer({ customerName }) {
  const dispatch = useDispatch()
  const router = useRouter()
  const id = router.query.id
  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 50 })
  const [openModalDetail, setOpenModalDetail] = useState(false)

  const { dataPointOfSaleCustomer: data, loadingDataPointOfSaleCustomer: loading } = useSelector(state => state.pos)

  const handleSearch = searchValue => {
    setSearchText(searchValue)
    const term = searchValue.toLowerCase()
    setFilteredData(!term ? data : (data || []).filter(row => row.code?.toLowerCase().includes(term)))
  }

  const handleRowClick = row => {
    dispatch(fetchDetailPointOfSale(row.code))
    setOpenModalDetail(true)
  }

  useEffect(() => {
    dispatch(fetchAllPointOfSaleByCustomerId({ id }))
  }, [id, dispatch])

  useEffect(() => {
    setFilteredData(data)
  }, [data])

  return (
    <>
      <Typography sx={{ fontSize: '0.8125rem', color: colors.mutedForeground, mb: 3 }}>
        Seluruh transaksi POS milik {customerName || 'customer ini'}
      </Typography>

      <DataTable
        itemLabel='transaksi'
        loading={loading}
        getRowId={row => row.code}
        onRowClick={params => handleRowClick(params.row)}
        toolbar={
          <TableToolbar
            value={searchText}
            placeholder='Cari transaksi POS'
            onChange={event => handleSearch(event.target.value)}
            clearSearch={() => handleSearch('')}
          />
        }
        columns={[
          {
            flex: 0.18,
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
            flex: 0.2,
            minWidth: 140,
            field: 'createdAt',
            headerName: 'TANGGAL DIBUAT',
            renderCell: params => <DateCell date={params.row.dateCreated} timestamp={params.row.createdAt} />
          },
          {
            flex: 0.2,
            minWidth: 140,
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
            flex: 0.14,
            minWidth: 110,
            field: 'status',
            headerName: 'STATUS',
            renderCell: params => <Status status={params.row.status} />
          },
          {
            flex: 0.14,
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
        sx={{ '& .MuiDataGrid-row': { cursor: 'pointer' } }}
      />

      <ModalViewTransactionV4 open={openModalDetail} setOpen={setOpenModalDetail} disableActions={true} />
    </>
  )
}
