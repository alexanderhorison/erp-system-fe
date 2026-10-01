import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Box, CircularProgress, IconButton, Tooltip, Typography } from '@mui/material'

import Icon from 'src/@core/components/icon'

import HandleSearh from 'src/helpers/handleSearch'
import { returnFormatTime } from 'src/helpers/formatDate'
import { Status } from 'src/@core/components/common'
import { priceFormatWIthCurrency } from 'src/helpers/priceFormatter'
import { fetchDetailPointOfSale, printPos } from 'src/store/apps/pos'
import ModalViewTransactionV4 from './ModalViewTransactionV4'
import PrintConfirmDialog from '../PrintConfirmDialog'

// ** Shared Components
import DataTable from 'src/views/common/DataTable'
import TableToolbar from 'src/views/common/TableToolbar'
import FilterPanel from 'src/views/common/FilterPanel'
import { monthOptions, yearOptions, currentYear } from 'src/views/common/filterOptions'

// ** Design Tokens
import { colors, status as statusTokens } from 'src/configs/designTokens'

const RowOptions = ({ handleView, handlePrint }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
      <Tooltip title='Lihat'>
        <IconButton onClick={handleView} size='small'>
          <Icon icon='tabler:eye' fontSize='1.125rem' />
        </IconButton>
      </Tooltip>
      <Tooltip title='Print'>
        <IconButton onClick={handlePrint} size='small'>
          <Icon icon='tabler:printer' fontSize='1.125rem' />
        </IconButton>
      </Tooltip>
    </Box>
  )
}

// ** Printer health, read from the backend via Redux (nothing is connected from the browser).
const PrinterStatus = () => {
  const { printerHealthStatus, loadingPrinterHealth } = useSelector(state => state.printer)
  const printerPos = localStorage.getItem('printerPos') ? JSON.parse(localStorage.getItem('printerPos')) : null

  // Find health status for selected printer based on IP
  const healthStatus = printerHealthStatus?.find(status => status.ip === printerPos?.ip)
  const isConnected = healthStatus?.status === 'ONLINE'
  const tone = isConnected ? statusTokens.success : statusTokens.danger

  return (
    <Tooltip title={printerPos?.name || 'Printer belum dipilih'}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Icon
          icon={isConnected ? 'tabler:circle-check' : 'tabler:circle-x'}
          fontSize='1rem'
          style={{ color: tone.fg }}
        />
        <Typography sx={{ fontSize: '0.8125rem', whiteSpace: 'nowrap', color: colors.foreground }}>
          Status Printer:{' '}
          {loadingPrinterHealth ? <CircularProgress size={12} color='inherit' /> : isConnected ? 'Online' : 'Offline'}
        </Typography>
      </Box>
    </Tooltip>
  )
}

export default function TablePointOfSale({ timeFilter, setTimeFilter, isMobile, isTablet, isLowHeight }) {
  const dispatch = useDispatch()
  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: isLowHeight ? 5 : 10 })
  const [openModalDetail, setOpenModalDetail] = useState(false)
  const [filterAnchor, setFilterAnchor] = useState(null)

  const { dataPointOfSale: data, loadingDataPointOfSale } = useSelector(state => state.pos)

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

  const handleRowClick = params => {
    const id = params?.code || params?.row?.code
    setOpenModalDetail(true)
    dispatch(fetchDetailPointOfSale(id))
  }

  // Row waiting for the cashier's answer in the print confirmation
  const [printTarget, setPrintTarget] = useState(null)

  const handleRowPrint = params => {
    setPrintTarget(params)
  }

  const handleConfirmPrint = () => {
    dispatch(printPos({ code: printTarget.code, skipPrompt: true }))
    setPrintTarget(null)
  }

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
        loading={loadingDataPointOfSale}
        toolbar={
          <TableToolbar
            value={searchText}
            placeholder='Cari kode'
            onChange={event => handleSearch(event.target.value)}
            clearSearch={() => handleSearch('')}
            onOpenFilters={setFilterAnchor}
            activeFilterCount={activeFilterCount}
            actions={<PrinterStatus />}
          />
        }
        columns={[
          {
            flex: 0.12,
            minWidth: 130,
            field: 'code',
            headerName: 'Kode',
            renderCell: params => <Typography variant='body2'>{params.row.code}</Typography>
          },
          {
            flex: 0.15,
            minWidth: 150,
            field: 'createdAt',
            headerName: 'Tanggal Transaksi',
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
            flex: 0.13,
            minWidth: 130,
            field: 'creator',
            headerName: 'Dibuat Oleh',
            valueGetter: params => params.row.creator?.name || '',
            renderCell: ({ row }) => (
              <Box sx={{ display: 'flex', flexDirection: 'column', lineHeight: 1.3 }}>
                <Typography noWrap variant='body2'>
                  {row.creator?.name}
                </Typography>
                <Typography noWrap sx={{ fontSize: '0.75rem', color: colors.mutedForeground }}>
                  {row.creator?.role}
                </Typography>
              </Box>
            )
          },
          {
            flex: 0.14,
            minWidth: 140,
            field: 'shift',
            headerName: 'Shift',
            valueGetter: params => params.row.shift?.shiftName || '',
            renderCell: ({ row }) =>
              row.shift ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', lineHeight: 1.3 }}>
                  <Typography noWrap variant='body2'>
                    {row.shift.shiftName}
                  </Typography>
                  <Typography noWrap sx={{ fontSize: '0.75rem', color: colors.mutedForeground }}>
                    {row.shift.startShift} - {row.shift.endShift}
                  </Typography>
                </Box>
              ) : (
                <Typography variant='body2'>-</Typography>
              )
          },
          {
            flex: 0.15,
            minWidth: 150,
            field: 'grandTotal',
            headerName: 'Total Pembelian',
            renderCell: params => (
              <Typography variant='body2'>{priceFormatWIthCurrency(params.row.grandTotal)}</Typography>
            )
          },
          {
            flex: 0.1,
            minWidth: 100,
            field: 'totalItems',
            headerName: 'Total Item',
            renderCell: params => <Typography variant='body2'>{params.row.totalItems}</Typography>
          },
          {
            flex: 0.1,
            minWidth: 110,
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
                <RowOptions handleView={() => handleRowClick(row)} handlePrint={() => handleRowPrint(row)} data={row} />
              </div>
            )
          }
        ]}
        pageSizeOptions={isLowHeight ? [5, 10] : [5, 10, 25]}
        onRowClick={params => handleRowClick(params)}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        rows={filteredData}
        sx={{ '& .MuiDataGrid-row': { cursor: 'pointer' } }}
      />
      <ModalViewTransactionV4 setOpen={setOpenModalDetail} open={openModalDetail} />
      <PrintConfirmDialog
        open={Boolean(printTarget)}
        onClose={() => setPrintTarget(null)}
        onConfirm={handleConfirmPrint}
      />
    </>
  )
}
