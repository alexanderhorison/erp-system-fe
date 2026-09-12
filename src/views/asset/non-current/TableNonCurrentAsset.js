import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import Icon from 'src/@core/components/icon'
import HandleSearh from 'src/helpers/handleSearch'
import { priceFormatWIthCurrency } from 'src/helpers/priceFormatter'
import { returnFormatMonthYear } from 'src/helpers/formatDate'
import { fetchDeleteMonthlyNonCurrentAsset, fetchMonthlyNonCurrentAsset } from 'src/store/apps/asset/non-current'

import ModalFormGenerateNonCurrentAssets from './ModalFormGenerateNonCurrentAsset'
import ModalDetailMonthlyNonCurrentAsset from './ModalDetailMonthlyNonCurrentAsset'

// ** Shared Components
import DataTable from 'src/views/common/DataTable'
import TableToolbar from 'src/views/common/TableToolbar'
import ConfirmDialog from 'src/views/common/ConfirmDialog'

const RowOptions = ({ onView, period, id }) => {
  const dispatch = useDispatch()
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false)
  const { loadingDelete } = useSelector(state => state.nonCurrentAsset)

  // ** Confirmation is owned by `ConfirmDialog`; the thunk performs the request
  // without prompting again (see docs/REVAMP_BASELINE.md §4).
  const handleDelete = () => {
    dispatch(fetchDeleteMonthlyNonCurrentAsset({ id, date: period }))
    setOpenConfirmDelete(false)
  }

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        <Tooltip title='Lihat'>
          <IconButton onClick={onView} size='small'>
            <Icon icon='tabler:eye' fontSize='1.125rem' />
          </IconButton>
        </Tooltip>
        <Tooltip title='Hapus'>
          <IconButton onClick={() => setOpenConfirmDelete(true)} size='small' sx={{ color: 'error.main' }}>
            <Icon icon='tabler:trash' fontSize='1.125rem' />
          </IconButton>
        </Tooltip>
      </Box>

      <ConfirmDialog
        open={openConfirmDelete}
        onClose={() => setOpenConfirmDelete(false)}
        onConfirm={handleDelete}
        title='Hapus Aset Tidak Lancar Bulanan'
        itemName={period}
        loading={loadingDelete}
      />
    </>
  )
}

export default function TableNonCurrentAsset() {
  const dispatch = useDispatch()

  const [openModalAdd, setOpenModalAdd] = useState(false)
  const [openModalDetail, setOpenModalDetail] = useState(false)
  const [selectedRow, setSelectedRow] = useState(null)

  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 50 })

  const { allData: data, loadingAllData: loading } = useSelector(state => state.nonCurrentAsset)

  const handleSearch = searchValue => {
    setSearchText(searchValue)
    HandleSearh({ data, keys: ['date', 'notes'], searchValue, setData: setFilteredData })
  }

  const handleView = row => {
    setSelectedRow(row)
    setOpenModalDetail(true)
  }

  useEffect(() => {
    dispatch(fetchMonthlyNonCurrentAsset())
  }, [dispatch])

  useEffect(() => {
    setFilteredData(data)
  }, [data])

  return (
    <>
      <DataTable
        itemLabel='aset tidak lancar bulanan'
        loading={loading}
        getRowId={row => row.id}
        onRowClick={params => handleView(params.row)}
        toolbar={
          <TableToolbar
            value={searchText}
            placeholder='Cari bulan atau catatan'
            onChange={event => handleSearch(event.target.value)}
            clearSearch={() => handleSearch('')}
            actions={
              <Button
                variant='contained'
                onClick={() => setOpenModalAdd(true)}
                startIcon={<Icon icon='tabler:plus' fontSize='1rem' />}
              >
                Buat Aset Tidak Lancar Bulanan
              </Button>
            }
          />
        }
        columns={[
          {
            flex: 0.25,
            minWidth: 160,
            field: 'date',
            headerName: 'PERIODE',
            renderCell: params => (
              <Typography variant='body2' sx={{ color: 'text.primary' }}>
                {returnFormatMonthYear(params.row.date) || '-'}
              </Typography>
            )
          },
          {
            flex: 0.3,
            minWidth: 160,
            field: 'totalValue',
            headerName: 'JUMLAH TOTAL',
            renderCell: params => (
              <Typography variant='body2' sx={{ color: 'text.primary' }}>
                {priceFormatWIthCurrency(params.row.totalValue, false) || '-'}
              </Typography>
            )
          },
          {
            flex: 0.35,
            minWidth: 200,
            field: 'notes',
            headerName: 'CATATAN',
            sortable: false,
            renderCell: params => (
              <Typography variant='body2' sx={{ color: 'text.primary' }}>
                {params.row.notes || '-'}
              </Typography>
            )
          },
          {
            flex: 0.1,
            minWidth: 110,
            sortable: false,
            field: 'actions',
            headerName: 'ACTION',
            renderCell: ({ row }) => (
              <Box onClick={event => event.stopPropagation()} sx={{ width: '100%' }}>
                <RowOptions onView={() => handleView(row)} period={row.date} id={row.id} />
              </Box>
            )
          }
        ]}
        pageSizeOptions={[25, 50, 100]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        rows={filteredData}
        sx={{ '& .MuiDataGrid-row': { cursor: 'pointer' } }}
      />

      {openModalAdd && <ModalFormGenerateNonCurrentAssets open={openModalAdd} setOpen={setOpenModalAdd} />}
      <ModalDetailMonthlyNonCurrentAsset open={openModalDetail} setOpen={setOpenModalDetail} selectedRow={selectedRow} />
    </>
  )
}
