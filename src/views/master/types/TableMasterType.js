import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Box, Button, IconButton, Typography } from '@mui/material'
import Icon from 'src/@core/components/icon'

import { deleteMasterDataType, fetchMasterDataType, fetchMasterDataTypeDetail } from 'src/store/apps/master/type'

import ModalAddMasterType from './ModalAddMasterType'
import HandleSearh from 'src/helpers/handleSearch'

// ** Shared Components
import DataTable from 'src/views/common/DataTable'
import TableToolbar from 'src/views/common/TableToolbar'
import ConfirmDialog from 'src/views/common/ConfirmDialog'

const RowOptions = ({ id, name }) => {
  const dispatch = useDispatch()
  const [openModalEdit, setOpenModalEdit] = useState(false)
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false)
  const { loadingDelete } = useSelector(state => state.type)

  const handleDelete = () => {
    dispatch(deleteMasterDataType({ id, name }))
    setOpenConfirmDelete(false)
  }

  const handleEdit = () => {
    dispatch(fetchMasterDataTypeDetail(id))
    setOpenModalEdit(true)
  }

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        <IconButton onClick={handleEdit} size='small'>
          <Icon icon='tabler:edit' fontSize='1.125rem' />
        </IconButton>
        <IconButton onClick={() => setOpenConfirmDelete(true)} size='small' sx={{ color: 'error.main' }}>
          <Icon icon='tabler:trash' fontSize='1.125rem' />
        </IconButton>
      </Box>
      {openModalEdit && (
        <ModalAddMasterType open={openModalEdit} setOpen={setOpenModalEdit} typeModal={'EDIT'} id={id} />
      )}
      <ConfirmDialog
        open={openConfirmDelete}
        onClose={() => setOpenConfirmDelete(false)}
        onConfirm={handleDelete}
        title='Delete Type'
        itemName={name}
        loading={loadingDelete}
      />
    </>
  )
}

export default function TableMasterType({}) {
  const dispatch = useDispatch()
  const [openModalAdd, setOpenModalAdd] = useState(false)

  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 50 })

  const { data } = useSelector(state => state.type)

  const handleSearch = searchValue => {
    setSearchText(searchValue)
    HandleSearh({ data, keys: ['name'], searchValue, setData: setFilteredData })
  }

  useEffect(() => {
    dispatch(fetchMasterDataType())
  }, [dispatch])

  useEffect(() => {
    setFilteredData(data)
  }, [data])

  return (
    <>
      {openModalAdd && <ModalAddMasterType open={openModalAdd} setOpen={setOpenModalAdd} typeModal={'ADD'} />}
      <DataTable
        itemLabel='types'
        toolbar={
          <TableToolbar
            value={searchText}
            placeholder='Search type name'
            onChange={event => handleSearch(event.target.value)}
            clearSearch={() => handleSearch('')}
            actions={
              <Button
                variant='contained'
                onClick={() => setOpenModalAdd(true)}
                startIcon={<Icon icon='tabler:plus' fontSize='1rem' />}
              >
                Add Type
              </Button>
            }
          />
        }
        columns={[
          {
            flex: 0.3,
            minWidth: 200,
            field: 'name',
            headerName: 'Type Name',
            renderCell: params => <Typography variant='body2'>{params.row.name}</Typography>
          },
          {
            flex: 0.5,
            minWidth: 200,
            field: 'description',
            headerName: 'Description',
            renderCell: params => <Typography variant='body2'>{params.row.description || '-'}</Typography>
          },
          {
            flex: 0.15,
            minWidth: 120,
            sortable: false,
            field: 'actions',
            headerName: 'Action',
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
