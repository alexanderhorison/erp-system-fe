import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import Icon from 'src/@core/components/icon'
import HandleSearch from 'src/helpers/handleSearch'
import { priceFormatWIthCurrency } from 'src/helpers/priceFormatter'
import { returnFormatMonthYear } from 'src/helpers/formatDate'
import { deleteLongTerm, fetchAllLongTerm, fetchLongTermDetail } from 'src/store/apps/liabilities/long-term'

import ModalFormLongTerm from './ModalFormLongTerm'
import ModalViewLongTerm from './ModalViewLongTerm'

// ** Shared Components
import DataTable from 'src/views/common/DataTable'
import TableToolbar from 'src/views/common/TableToolbar'
import ConfirmDialog from 'src/views/common/ConfirmDialog'

const RowOptions = ({ onView, id, period }) => {
  const dispatch = useDispatch()
  const [openModalEdit, setOpenModalEdit] = useState(false)
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false)
  const { loadingDelete } = useSelector(state => state.longTerm)

  const handleEdit = () => {
    dispatch(fetchLongTermDetail(id))
    setOpenModalEdit(true)
  }

  // ** Confirmation is owned by `ConfirmDialog`; the thunk performs the request
  // without prompting again (see docs/REVAMP_BASELINE.md §4).
  const handleDelete = () => {
    dispatch(deleteLongTerm({ id, period }))
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
        <Tooltip title='Ubah'>
          <IconButton onClick={handleEdit} size='small'>
            <Icon icon='tabler:edit' fontSize='1.125rem' />
          </IconButton>
        </Tooltip>
        <Tooltip title='Hapus'>
          <IconButton onClick={() => setOpenConfirmDelete(true)} size='small' sx={{ color: 'error.main' }}>
            <Icon icon='tabler:trash' fontSize='1.125rem' />
          </IconButton>
        </Tooltip>
      </Box>

      {openModalEdit && (
        <ModalFormLongTerm open={openModalEdit} setOpen={setOpenModalEdit} typeModal='EDIT' id={id} />
      )}

      <ConfirmDialog
        open={openConfirmDelete}
        onClose={() => setOpenConfirmDelete(false)}
        onConfirm={handleDelete}
        title='Hapus Liabilitas Jangka Panjang'
        itemName={period}
        loading={loadingDelete}
      />
    </>
  )
}

export default function TableLongTerm() {
  const dispatch = useDispatch()

  const { allLongTerm: data, loadingAllLongTerm: loading } = useSelector(state => state.longTerm)

  const [openModalAdd, setOpenModalAdd] = useState(false)
  const [openModalDetail, setOpenModalDetail] = useState(false)
  const [selectedRow, setSelectedRow] = useState(null)

  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 50 })

  const handleSearch = searchValue => {
    setSearchText(searchValue)
    HandleSearch({ data, keys: ['date', 'notes'], searchValue, setData: setFilteredData })
  }

  const handleView = row => {
    setOpenModalDetail(true)
    setSelectedRow(row)
  }

  useEffect(() => {
    dispatch(fetchAllLongTerm())
  }, [dispatch])

  useEffect(() => {
    setFilteredData(data)
  }, [data])

  return (
    <>
      <DataTable
        itemLabel='liabilitas jangka panjang'
        loading={loading}
        getRowId={row => row.id}
        onRowClick={params => handleView(params.row)}
        toolbar={
          <TableToolbar
            value={searchText}
            placeholder='Cari periode atau catatan'
            onChange={event => handleSearch(event.target.value)}
            clearSearch={() => handleSearch('')}
            actions={
              <Button
                variant='contained'
                onClick={() => setOpenModalAdd(true)}
                startIcon={<Icon icon='tabler:plus' fontSize='1rem' />}
              >
                Tambah Liabilitas Jangka Panjang
              </Button>
            }
          />
        }
        columns={[
          {
            flex: 0.2,
            minWidth: 150,
            field: 'date',
            headerName: 'PERIODE',
            renderCell: params => (
              <Typography variant='body2' sx={{ color: 'text.primary' }}>
                {returnFormatMonthYear(params.row.date)}
              </Typography>
            )
          },
          {
            flex: 0.35,
            minWidth: 220,
            field: 'totalLongtermLiabilities',
            headerName: 'JUMLAH LIABILITAS JANGKA PANJANG',
            renderCell: params => (
              <Typography variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
                {priceFormatWIthCurrency(params.row.totalLongtermLiabilities)}
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
                <RowOptions onView={() => handleView(row)} id={row.id} period={row.date} />
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

      {openModalAdd && <ModalFormLongTerm open={openModalAdd} setOpen={setOpenModalAdd} typeModal='ADD' />}
      <ModalViewLongTerm open={openModalDetail} setOpen={setOpenModalDetail} selectedRow={selectedRow} />
    </>
  )
}
