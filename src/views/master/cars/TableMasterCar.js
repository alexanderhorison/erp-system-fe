import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material'
import Icon from 'src/@core/components/icon'

import { deleteMasterDataCar, fetchMasterDataCar, fetchMasterDataCarDetail } from 'src/store/apps/master/car'

import ModalAddMasterCar from './ModalAddMasterCar'
import HandleSearh from 'src/helpers/handleSearch'

// ** Shared Components
import DataTable from 'src/views/common/DataTable'
import TableToolbar from 'src/views/common/TableToolbar'
import ConfirmDialog from 'src/views/common/ConfirmDialog'
import StatusChip from 'src/views/common/StatusChip'


const formatCurrency = value =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value || 0)

const RowOptions = ({ id, name }) => {
  const dispatch = useDispatch()
  const [openModalEdit, setOpenModalEdit] = useState(false)
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false)
  const { loadingDelete } = useSelector(state => state.masterCar)

  // ** Confirmation is owned by `ConfirmDialog`; the thunk performs the request
  // without prompting again (see docs/REVAMP_BASELINE.md §4).
  const handleDelete = () => {
    dispatch(deleteMasterDataCar({ id, name }))
    setOpenConfirmDelete(false)
  }

  const handleEdit = () => {
    dispatch(fetchMasterDataCarDetail(id))
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
        title='Hapus Mobil'
        itemName={name}
        loading={loadingDelete}
      />
      {openModalEdit && (
        <ModalAddMasterCar open={openModalEdit} setOpen={setOpenModalEdit} typeModal={'EDIT'} id={id} />
      )}
    </>
  )
}

export default function TableMasterCar({}) {
  const dispatch = useDispatch()
  const [openModalAdd, setOpenModalAdd] = useState(false)

  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 50 })

  const { data } = useSelector(state => state.masterCar)

  const handleSearch = searchValue => {
    setSearchText(searchValue)
    HandleSearh({ data, keys: ['name', 'plate_number'], searchValue, setData: setFilteredData })
  }

  useEffect(() => {
    dispatch(fetchMasterDataCar())
  }, [dispatch])

  useEffect(() => {
    setFilteredData(data)
  }, [data])

  return (
    <>
      {openModalAdd && <ModalAddMasterCar open={openModalAdd} setOpen={setOpenModalAdd} typeModal={'ADD'} />}
      <DataTable
        itemLabel='mobil'
        toolbar={
          <TableToolbar
            value={searchText}
            placeholder='Cari nama mobil atau plat nomor'
            onChange={event => handleSearch(event.target.value)}
            clearSearch={() => handleSearch('')}
            actions={
              <Button
                variant='contained'
                onClick={() => setOpenModalAdd(true)}
                startIcon={<Icon icon='tabler:plus' fontSize='1rem' />}
              >
                Tambah Mobil
              </Button>
            }
          />
        }
        columns={[
          {
            flex: 0.2,
            minWidth: 160,
            field: 'name',
            headerName: 'NAMA MOBIL',
            renderCell: params => (
              <Typography variant='body2' sx={{ color: 'text.primary' }}>
                {params.row.name}
              </Typography>
            )
          },
          {
            flex: 0.15,
            minWidth: 120,
            field: 'plate_number',
            headerName: 'PLAT NOMOR',
            renderCell: params => (
              <Typography variant='body2' sx={{ color: 'text.primary' }}>
                {params.row.plate_number}
              </Typography>
            )
          },
          {
            flex: 0.17,
            minWidth: 150,
            field: 'emoneyBalance',
            headerName: 'E-MONEY BALANCE',
            renderCell: params => (
              <Typography variant='body2' sx={{ color: 'text.primary' }}>
                {formatCurrency(params.row.emoneyBalance)}
              </Typography>
            )
          },
          {
            flex: 0.23,
            minWidth: 160,
            field: 'description',
            headerName: 'DESKRIPSI',
            renderCell: params => (
              <Typography variant='body2' sx={{ color: 'text.primary' }}>
                {params.row.description || '-'}
              </Typography>
            )
          },
          {
            flex: 0.1,
            minWidth: 110,
            field: 'is_active',
            headerName: 'STATUS',
            renderCell: params => <StatusChip isActive={params.row.is_active} />
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
