import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'

import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material'
import Icon from 'src/@core/components/icon'

import HandleSearh from 'src/helpers/handleSearch'
import {
  deleteMasterDataVendor,
  fetchMasterDataVendor,
  fetchMasterDataVendorDetail
} from 'src/store/apps/master/vendor'
import ModalAddMasterVendor from './ModalAddMasterVendor'

// ** Shared Components
import DataTable from 'src/views/common/DataTable'
import TableToolbar from 'src/views/common/TableToolbar'
import ConfirmDialog from 'src/views/common/ConfirmDialog'

const RowOptions = ({ id, name }) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const [openModalEdit, setOpenModalEdit] = useState(false)
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false)
  const { loadingDelete } = useSelector(state => state.masterVendor)

  // ** Confirmation is owned by `ConfirmDialog`; the thunk performs the request
  // without prompting again (see docs/REVAMP_BASELINE.md §4).
  const handleDelete = () => {
    dispatch(deleteMasterDataVendor({ id, name }))
    setOpenConfirmDelete(false)
  }

  const handleEdit = () => {
    dispatch(fetchMasterDataVendorDetail(id))
    setOpenModalEdit(true)
  }

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        <Tooltip title='Lihat'>
          <IconButton onClick={() => router.push(`/master/vendor/${id}`)} size='small'>
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

      <ConfirmDialog
        open={openConfirmDelete}
        onClose={() => setOpenConfirmDelete(false)}
        onConfirm={handleDelete}
        title='Hapus Vendor'
        itemName={name}
        loading={loadingDelete}
      />
      {openModalEdit && (
        <ModalAddMasterVendor open={openModalEdit} setOpen={setOpenModalEdit} typeModal={'EDIT'} id={id} />
      )}
    </>
  )
}

/** Email over phone number when both exist; whichever one is present alone otherwise. */
const ContactCell = ({ email, phoneNumber }) => {
  if (!email && !phoneNumber) {
    return (
      <Typography variant='body2' sx={{ color: 'text.secondary' }}>
        -
      </Typography>
    )
  }

  if (email && phoneNumber) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant='body2' sx={{ color: 'text.primary', fontSize: '0.8125rem' }}>
          {email}
        </Typography>
        <Typography variant='body2' sx={{ color: 'text.secondary', fontSize: '0.8125rem' }}>
          {phoneNumber}
        </Typography>
      </Box>
    )
  }

  return (
    <Typography variant='body2' sx={{ color: 'text.primary' }}>
      {email || phoneNumber}
    </Typography>
  )
}

export default function TableMasterVendor({}) {
  const dispatch = useDispatch()
  const router = useRouter()
  const [openModalAdd, setOpenModalAdd] = useState(false)

  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 50 })

  const { data } = useSelector(state => state.masterVendor)

  const handleSearch = searchValue => {
    setSearchText(searchValue)
    HandleSearh({ data, keys: ['name'], searchValue, setData: setFilteredData })
  }

  useEffect(() => {
    dispatch(fetchMasterDataVendor())
  }, [dispatch])

  useEffect(() => {
    setFilteredData(data)
  }, [data])

  return (
    <>
      {openModalAdd && <ModalAddMasterVendor open={openModalAdd} setOpen={setOpenModalAdd} typeModal={'ADD'} />}
      <DataTable
        itemLabel='vendor'
        getRowId={row => row.id}
        onRowClick={params => router.push(`/master/vendor/${params.row.id}`)}
        toolbar={
          <TableToolbar
            value={searchText}
            placeholder='Cari nama vendor'
            onChange={event => handleSearch(event.target.value)}
            clearSearch={() => handleSearch('')}
            actions={
              <Button
                variant='contained'
                onClick={() => setOpenModalAdd(true)}
                startIcon={<Icon icon='tabler:plus' fontSize='1rem' />}
              >
                Tambah Vendor
              </Button>
            }
          />
        }
        columns={[
          {
            flex: 0.08,
            minWidth: 60,
            field: 'id',
            headerName: 'ID',
            renderCell: params => (
              <Typography variant='body2' sx={{ color: 'text.primary' }}>
                {params.row.id}
              </Typography>
            )
          },
          {
            flex: 0.2,
            minWidth: 160,
            field: 'name',
            headerName: 'NAMA VENDOR',
            renderCell: params => (
              <Typography variant='body2' sx={{ color: 'text.primary' }}>
                {params.row.name}
              </Typography>
            )
          },
          {
            flex: 0.22,
            minWidth: 180,
            field: 'contact',
            headerName: 'EMAIL / NOMOR TELEPON',
            sortable: false,
            renderCell: params => <ContactCell email={params.row.email} phoneNumber={params.row.phoneNumber} />
          },
          {
            flex: 0.12,
            minWidth: 110,
            field: 'rankName',
            headerName: 'RANK',
            renderCell: params => (
              <Typography variant='body2' sx={{ color: 'text.primary' }}>
                {params.row.rankName || '-'}
              </Typography>
            )
          },
          {
            flex: 0.18,
            minWidth: 140,
            field: 'notes',
            headerName: 'CATATAN',
            renderCell: params => (
              <Typography variant='body2' sx={{ color: 'text.primary' }}>
                {params.row.notes || '-'}
              </Typography>
            )
          },
          {
            flex: 0.15,
            minWidth: 120,
            sortable: false,
            field: 'actions',
            headerName: 'ACTION',
            renderCell: ({ row }) => (
              <Box onClick={event => event.stopPropagation()} sx={{ width: '100%' }}>
                <RowOptions id={row.id} name={row.name} />
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
    </>
  )
}
