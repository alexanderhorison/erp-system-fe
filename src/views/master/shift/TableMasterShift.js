import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material'
import Icon from 'src/@core/components/icon'

import { deleteMasterDataShift, fetchMasterDataShift, fetchMasterDataShiftDetail } from 'src/store/apps/master/shift'

import ModalAddMasterShift from './ModalAddMasterShift'
import HandleSearh from 'src/helpers/handleSearch'

// ** Shared Components
import DataTable from 'src/views/common/DataTable'
import TableToolbar from 'src/views/common/TableToolbar'
import ConfirmDialog from 'src/views/common/ConfirmDialog'

// ** Formats "HH:MM:SS" (or already "HH:MM") down to "HH:MM".
const formatTime = value => (value ? value.substring(0, 5) : '')

const RowOptions = ({ id, name }) => {
  const dispatch = useDispatch()
  const [openModalEdit, setOpenModalEdit] = useState(false)
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false)
  const { loadingDelete } = useSelector(state => state.shift)

  // ** Confirmation is owned by `ConfirmDialog`; the thunk performs the request
  // without prompting again (see docs/REVAMP_BASELINE.md §4).
  const handleDelete = () => {
    dispatch(deleteMasterDataShift({ id, name }))
    setOpenConfirmDelete(false)
  }

  const handleEdit = () => {
    dispatch(fetchMasterDataShiftDetail(id))
    setOpenModalEdit(true)
  }

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
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

      <ConfirmDialog
        open={openConfirmDelete}
        onClose={() => setOpenConfirmDelete(false)}
        onConfirm={handleDelete}
        title='Hapus Shift'
        itemName={name}
        loading={loadingDelete}
      />
      {openModalEdit && (
        <ModalAddMasterShift open={openModalEdit} setOpen={setOpenModalEdit} typeModal={'EDIT'} id={id} />
      )}
    </>
  )
}

export default function TableMasterShift({}) {
  const dispatch = useDispatch()
  const [openModalAdd, setOpenModalAdd] = useState(false)

  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 50 })

  const { data } = useSelector(state => state.shift)

  const handleSearch = searchValue => {
    setSearchText(searchValue)
    HandleSearh({ data, keys: ['name'], searchValue, setData: setFilteredData })
  }

  useEffect(() => {
    dispatch(fetchMasterDataShift())
  }, [dispatch])

  useEffect(() => {
    setFilteredData(data)
  }, [data])

  return (
    <>
      {openModalAdd && <ModalAddMasterShift open={openModalAdd} setOpen={setOpenModalAdd} typeModal={'ADD'} />}
      <DataTable
        itemLabel='shift'
        toolbar={
          <TableToolbar
            value={searchText}
            placeholder='Cari nama shift'
            onChange={event => handleSearch(event.target.value)}
            clearSearch={() => handleSearch('')}
            actions={
              <Button
                variant='contained'
                onClick={() => setOpenModalAdd(true)}
                startIcon={<Icon icon='tabler:plus' fontSize='1rem' />}
              >
                Tambah Shift
              </Button>
            }
          />
        }
        columns={[
          {
            flex: 0.3,
            minWidth: 200,
            field: 'name',
            headerName: 'NAMA SHIFT',
            renderCell: params => (
              <Typography variant='body2' sx={{ color: 'text.primary' }}>
                {params.row.name}
              </Typography>
            )
          },
          {
            flex: 0.2,
            minWidth: 120,
            field: 'startShift',
            headerName: 'JAM MULAI',
            renderCell: params => (
              <Typography variant='body2' sx={{ color: 'text.primary' }}>
                {formatTime(params.row.startShift)}
              </Typography>
            )
          },
          {
            flex: 0.2,
            minWidth: 120,
            field: 'endShift',
            headerName: 'JAM SELESAI',
            renderCell: params => (
              <Typography variant='body2' sx={{ color: 'text.primary' }}>
                {formatTime(params.row.endShift)}
              </Typography>
            )
          },
          {
            flex: 0.15,
            minWidth: 120,
            sortable: false,
            field: 'actions',
            headerName: 'ACTION',
            renderCell: ({ row }) => <RowOptions id={row.id} name={row.name} />
          }
        ]}
        pageSizeOptions={[25, 50, 100]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        rows={filteredData}
      />
    </>
  )
}
