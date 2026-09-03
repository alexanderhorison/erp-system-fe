import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material'
import Icon from 'src/@core/components/icon'

import {
  deleteMasterDataCategory,
  fetchDataMasterCategory,
  fetchDataMasterCategoryDetail
} from 'src/store/apps/master/category'

import ModalAddMasterCategory from './ModalAddMasterCategory'
import HandleSearh from 'src/helpers/handleSearch'

// ** Shared Components
import DataTable from 'src/views/common/DataTable'
import TableToolbar from 'src/views/common/TableToolbar'
import ConfirmDialog from 'src/views/common/ConfirmDialog'

const RowOptions = ({ id, name }) => {
  const dispatch = useDispatch()
  const [openModalEdit, setOpenModalEdit] = useState(false)
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false)
  const { loadingDelete } = useSelector(state => state.category)

  // ** Confirmation is owned by `ConfirmDialog`; the thunk performs the request
  // without prompting again.
  const handleDelete = () => {
    dispatch(deleteMasterDataCategory({ id, name }))
    setOpenConfirmDelete(false)
  }

  const handleEdit = () => {
    dispatch(fetchDataMasterCategoryDetail(id))
    setOpenModalEdit(true)
  }

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        <Tooltip title='Edit'>
          <IconButton onClick={handleEdit} size='small'>
            <Icon icon='tabler:edit' fontSize='1.125rem' />
          </IconButton>
        </Tooltip>
        <Tooltip title='Delete'>
          <IconButton onClick={() => setOpenConfirmDelete(true)} size='small' sx={{ color: 'error.main' }}>
            <Icon icon='tabler:trash' fontSize='1.125rem' />
          </IconButton>
        </Tooltip>
      </Box>

      <ConfirmDialog
        open={openConfirmDelete}
        onClose={() => setOpenConfirmDelete(false)}
        onConfirm={handleDelete}
        title='Delete Category'
        itemName={name}
        loading={loadingDelete}
      />
      {openModalEdit && (
        <ModalAddMasterCategory open={openModalEdit} setOpen={setOpenModalEdit} typeModal={'EDIT'} id={id} />
      )}
    </>
  )
}

export default function TableMasterCategory({}) {
  const dispatch = useDispatch()
  const [openModalAdd, setOpenModalAdd] = useState(false)

  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 50 })

  const { data } = useSelector(state => state.category)

  const handleSearch = searchValue => {
    setSearchText(searchValue)
    HandleSearh({ data, keys: ['name'], searchValue, setData: setFilteredData })
  }

  useEffect(() => {
    dispatch(fetchDataMasterCategory())
  }, [dispatch])

  useEffect(() => {
    setFilteredData(data)
  }, [data])

  return (
    <>
      {openModalAdd && <ModalAddMasterCategory open={openModalAdd} setOpen={setOpenModalAdd} typeModal={'ADD'} />}
      <DataTable
        itemLabel='categories'
        toolbar={
          <TableToolbar
            value={searchText}
            placeholder='Search category name'
            onChange={event => handleSearch(event.target.value)}
            clearSearch={() => handleSearch('')}
            actions={
              <Button
                variant='contained'
                onClick={() => setOpenModalAdd(true)}
                startIcon={<Icon icon='tabler:plus' fontSize='1rem' />}
              >
                Add Category
              </Button>
            }
          />
        }
        columns={[
          {
            flex: 0.35,
            minWidth: 200,
            field: 'name',
            headerName: 'CATEGORY NAME',
            renderCell: params => (
              <Typography variant='body2' sx={{ color: 'text.primary' }}>
                {params.row.name}
              </Typography>
            )
          },
          {
            flex: 0.45,
            minWidth: 200,
            field: 'description',
            headerName: 'DESCRIPTION',
            renderCell: params => (
              <Typography variant='body2' sx={{ color: 'text.primary' }}>
                {params.row.description || '-'}
              </Typography>
            )
          },
          {
            flex: 0.2,
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
