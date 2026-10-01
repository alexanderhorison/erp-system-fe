import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material'

import Icon from 'src/@core/components/icon'

import HandleSearh from 'src/helpers/handleSearch'
import { returnFormatTime } from 'src/helpers/formatDate'
import { Status } from 'src/@core/components/common'
import ModalAddRequestProduct from './ModalAddRequestProduct'
import ModalViewRequestProduct from './ModalViewRequestProduct'
import { fetchDetailRequestOrder } from 'src/store/apps/product-request-order'

// ** Shared Components
import DataTable from 'src/views/common/DataTable'
import TableToolbar from 'src/views/common/TableToolbar'
import FilterPanel from 'src/views/common/FilterPanel'
import { monthOptions, yearOptions, currentYear } from 'src/views/common/filterOptions'

// ** Design Tokens
import { colors } from 'src/configs/designTokens'

const RowOptions = ({ handleView, handleEdit, status, createdBy, requesterId }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
      <Tooltip title='Lihat'>
        <IconButton onClick={handleView} size='small'>
          <Icon icon='tabler:eye' fontSize='1.125rem' />
        </IconButton>
      </Tooltip>
      {status === 'PENDING' && requesterId == createdBy?.id && (
        <Tooltip title='Ubah'>
          <IconButton onClick={handleEdit} size='small'>
            <Icon icon='tabler:edit' fontSize='1.125rem' />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  )
}

// ** Name over role, used for both "Dibuat Oleh" and "Diproses Oleh".
const PersonCell = ({ person }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', lineHeight: 1.3 }}>
    <Typography noWrap variant='body2'>
      {person?.name || '-'}
    </Typography>
    <Typography noWrap sx={{ fontSize: '0.75rem', color: colors.mutedForeground }}>
      {person?.role}
    </Typography>
  </Box>
)

export default function TableRequestProduct({ timeFilter, setTimeFilter, isMobile, isTablet, isLowHeight }) {
  const dispatch = useDispatch()
  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: isLowHeight ? 5 : 10 })
  const [openModalForm, setOpenModalForm] = useState(false)
  const [openModalView, setOpenModalView] = useState(false)
  const [filterAnchor, setFilterAnchor] = useState(null)
  const [typeModal, setTypeModal] = useState('ADD')
  const userData = JSON.parse(localStorage.getItem('userData'))

  const { dataRequestOrder: data, loadingDataRequestOrder } = useSelector(state => state.productRequest)

  const filterFields = useMemo(
    () => [
      { name: 'month', label: 'Bulan', type: 'select', options: monthOptions, placeholder: 'Semua Bulan' },
      { name: 'year', label: 'Tahun', type: 'select', options: yearOptions, placeholder: 'Semua Tahun' }
    ],
    []
  )

  const activeFilterCount = [timeFilter?.month, timeFilter?.year !== currentYear ? timeFilter?.year : ''].filter(
    value => value !== '' && value != null
  ).length

  const handleSearch = searchValue => {
    setSearchText(searchValue)
    HandleSearh({
      data,
      keys: ['code', 'dateCreated'],
      searchValue,
      setData: setFilteredData,
      timeFilter: timeFilter
    })
  }

  const handleEdit = row => {
    dispatch(fetchDetailRequestOrder(row.code))
    setTypeModal('EDIT')
    setOpenModalForm(true)
  }

  const handleView = row => {
    dispatch(fetchDetailRequestOrder(row.code))
    setOpenModalView(true)
  }

  useEffect(() => {
    if (timeFilter && timeFilter.year) {
      const filtered = data.filter(item => {
        const itemDate = new Date(item.createdAt)
        const itemYear = itemDate.getFullYear() // Get the year from createdAt
        const itemMonth = itemDate.getMonth() // Get the month from createdAt (0-based index)

        // Compare it with timeFilter.year and timeFilter.month (if provided)
        const matchesYear = itemYear === parseInt(timeFilter.year)
        const matchesMonth = timeFilter.month ? itemMonth === parseInt(timeFilter.month - 1) : true

        return matchesYear && matchesMonth
      })
      setFilteredData(filtered)
    } else {
      setFilteredData(data) // If no year filter, show all data
    }
  }, [data, timeFilter])

  return (
    <>
      <FilterPanel
        size='large'
        open={Boolean(filterAnchor)}
        anchorEl={filterAnchor}
        onClose={() => setFilterAnchor(null)}
        fields={filterFields}
        value={timeFilter}
        onApply={next => setTimeFilter(prev => ({ ...prev, month: next.month || '', year: next.year || currentYear }))}
        onReset={() => setTimeFilter({ month: '', year: currentYear })}
      />

      <DataTable
        itemLabel='datas'
        loading={loadingDataRequestOrder}
        toolbar={
          <TableToolbar
            value={searchText}
            placeholder='Cari request produk'
            onChange={event => handleSearch(event.target.value)}
            clearSearch={() => handleSearch('')}
            onOpenFilters={setFilterAnchor}
            activeFilterCount={activeFilterCount}
            actions={
              <Button
                variant='contained'
                onClick={() => {
                  setOpenModalForm(true)
                  setTypeModal('ADD')
                }}
                startIcon={<Icon icon='tabler:plus' fontSize='1rem' />}
                sx={{ whiteSpace: 'nowrap' }}
              >
                Buat Product Request
              </Button>
            }
          />
        }
        columns={[
          {
            flex: 0.14,
            minWidth: 130,
            field: 'code',
            headerName: 'Kode',
            renderCell: params => <Typography variant='body2'>{params.row.code}</Typography>
          },
          {
            flex: 0.17,
            minWidth: 150,
            field: 'createdAt',
            headerName: 'Tanggal Dibuat',
            renderCell: params => (
              <Box sx={{ display: 'flex', flexDirection: 'column', lineHeight: 1.3 }}>
                <Typography variant='body2'>{params.row.dateCreated}</Typography>
                <Typography noWrap sx={{ fontSize: '0.75rem', color: colors.mutedForeground }}>
                  {returnFormatTime(params.row.createdAt)}
                </Typography>
              </Box>
            )
          },
          {
            flex: 0.17,
            minWidth: 140,
            field: 'createdBy',
            headerName: 'Dibuat Oleh',
            valueGetter: params => params.row.createdBy?.name || '',
            renderCell: ({ row }) => <PersonCell person={row.createdBy} />
          },
          {
            flex: 0.17,
            minWidth: 140,
            field: 'approvedBy',
            headerName: 'Diproses Oleh',
            valueGetter: params => params.row.approvedBy?.name || '',
            renderCell: ({ row }) => <PersonCell person={row.approvedBy} />
          },
          {
            flex: 0.13,
            minWidth: 120,
            field: 'status',
            headerName: 'Status',
            renderCell: ({ row }) => <Status status={row.status} />
          },
          {
            flex: 0.1,
            minWidth: 110,
            sortable: false,
            field: 'actions',
            headerName: 'Action',
            renderCell: ({ row }) => (
              <div onClick={e => e.stopPropagation()}>
                <RowOptions
                  handleView={() => handleView(row)}
                  handleEdit={() => handleEdit(row)}
                  status={row.status}
                  createdBy={row.createdBy}
                  requesterId={userData?.id}
                />
              </div>
            )
          }
        ]}
        pageSizeOptions={isLowHeight ? [5, 10] : [5, 10, 25]}
        onRowClick={({ row }) => handleView(row)}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        rows={filteredData}
        sx={{ '& .MuiDataGrid-row': { cursor: 'pointer' } }}
      />
      <ModalAddRequestProduct open={openModalForm} setOpen={setOpenModalForm} typeModal={typeModal} />
      <ModalViewRequestProduct open={openModalView} setOpen={setOpenModalView} />
    </>
  )
}
