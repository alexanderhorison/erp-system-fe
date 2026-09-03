import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material'
import Icon from 'src/@core/components/icon'

import {
  deleteMasterDataUnexpectedCostCategory,
  fetchMasterDataUnexpectedCostCategory,
  fetchMasterDataUnexpectedCostCategoryDetail
} from 'src/store/apps/master/unexpected-cost-category'

import ModalAddMasterUnexpectedCostCategory from './ModalAddMasterUnexpectedCostCategory'
import HandleSearh from 'src/helpers/handleSearch'

// ** Shared Components
import DataTable from 'src/views/common/DataTable'
import TableToolbar from 'src/views/common/TableToolbar'
import ConfirmDialog from 'src/views/common/ConfirmDialog'
import StatusChip from 'src/views/common/StatusChip'


const RowOptions = ({ id, name }) => {
  const dispatch = useDispatch()
  const [openModalEdit, setOpenModalEdit] = useState(false)
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false)
  const { loadingDelete } = useSelector(state => state.masterUnexpectedCostCategory)

  // ** Confirmation is owned by `ConfirmDialog`; the thunk performs the request
  // without prompting again (see docs/REVAMP_BASELINE.md §4).
  const handleDelete = () => {
    dispatch(deleteMasterDataUnexpectedCostCategory({ id, name }))
    setOpenConfirmDelete(false)
  }

  const handleEdit = () => {
    dispatch(fetchMasterDataUnexpectedCostCategoryDetail(id))
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
        title='Hapus Kategori'
        itemName={name}
        loading={loadingDelete}
      />
      {openModalEdit && (
        <ModalAddMasterUnexpectedCostCategory
          open={openModalEdit}
          setOpen={setOpenModalEdit}
          typeModal={'EDIT'}
          id={id}
        />
      )}
    </>
  )
}

export default function TableMasterUnexpectedCostCategory({}) {
  const dispatch = useDispatch()
  const [openModalAdd, setOpenModalAdd] = useState(false)

  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 50 })

  const { data } = useSelector(state => state.masterUnexpectedCostCategory)

  const handleSearch = searchValue => {
    setSearchText(searchValue)
    HandleSearh({ data, keys: ['name', 'description'], searchValue, setData: setFilteredData })
  }

  useEffect(() => {
    dispatch(fetchMasterDataUnexpectedCostCategory())
  }, [dispatch])

  useEffect(() => {
    setFilteredData(data)
  }, [data])

  return (
    <>
      {openModalAdd && (
        <ModalAddMasterUnexpectedCostCategory open={openModalAdd} setOpen={setOpenModalAdd} typeModal={'ADD'} />
      )}
      <DataTable
        itemLabel='kategori'
        toolbar={
          <TableToolbar
            value={searchText}
            placeholder='Cari nama kategori atau deskripsi'
            onChange={event => handleSearch(event.target.value)}
            clearSearch={() => handleSearch('')}
            actions={
              <Button
                variant='contained'
                onClick={() => setOpenModalAdd(true)}
                startIcon={<Icon icon='tabler:plus' fontSize='1rem' />}
              >
                Tambah Kategori
              </Button>
            }
          />
        }
        columns={[
          {
            flex: 0.3,
            minWidth: 200,
            field: 'name',
            headerName: 'NAMA KATEGORI',
            renderCell: params => (
              <Typography variant='body2' sx={{ color: 'text.primary' }}>
                {params.row.name}
              </Typography>
            )
          },
          {
            flex: 0.4,
            minWidth: 220,
            field: 'description',
            headerName: 'DESKRIPSI',
            renderCell: params => (
              <Typography variant='body2' sx={{ color: 'text.primary' }}>
                {params.row.description || '-'}
              </Typography>
            )
          },
          {
            flex: 0.15,
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
