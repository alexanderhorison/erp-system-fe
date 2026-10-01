import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'

import { Box, Button, IconButton, Typography } from '@mui/material'
import Icon from 'src/@core/components/icon'
import HandleSearh from 'src/helpers/handleSearch'

import ModalAddMasterTransformation from './ModalAddMasterTransformation'
import {
  deleteMasterDataTransformation,
  fetchMasterDataTransformation,
  fetchMasterDataTransformationDetail
} from 'src/store/apps/master/transformation'
import { fetchMasterDataUnit } from 'src/store/apps/master/unit'

// ** Shared Components
import DataTable from 'src/views/common/DataTable'
import TableToolbar from 'src/views/common/TableToolbar'
import ConfirmDialog from 'src/views/common/ConfirmDialog'

const RowOptions = ({ id, name, code, productId }) => {
  const dispatch = useDispatch()
  const [openModalEdit, setOpenModalEdit] = useState(false)
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false)
  const { loadingDelete } = useSelector(state => state.masterTransformation)

  const handleDelete = () => {
    dispatch(deleteMasterDataTransformation({ id, name, productId }))
    setOpenConfirmDelete(false)
  }

  const handleEdit = () => {
    dispatch(fetchMasterDataTransformationDetail(id))
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
        <ModalAddMasterTransformation open={openModalEdit} setOpen={setOpenModalEdit} typeModal={'EDIT'} id={id} />
      )}
      <ConfirmDialog
        open={openConfirmDelete}
        onClose={() => setOpenConfirmDelete(false)}
        onConfirm={handleDelete}
        title='Hapus Transformasi'
        itemName={code}
        loading={loadingDelete}
      />
    </>
  )
}

export default function TableMasterTransformation({ product }) {
  const dispatch = useDispatch()
  const [openModalAdd, setOpenModalAdd] = useState(false)

  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 50 })

  const { data } = useSelector(state => state.masterTransformation)

  const router = useRouter()

  const handleSearch = searchValue => {
    setSearchText(searchValue)
    HandleSearh({ data, keys: ['info'], searchValue, setData: setFilteredData })
  }

  useEffect(() => {
    if (router.query.id) {
      dispatch(fetchMasterDataTransformation(router.query.id))
    }
    dispatch(fetchMasterDataUnit())
  }, [dispatch, router.query.id])

  useEffect(() => {
    setFilteredData(data)
  }, [data])

  return (
    <>
      {openModalAdd && (
        <ModalAddMasterTransformation
          open={openModalAdd}
          product={product}
          setOpen={setOpenModalAdd}
          typeModal={'ADD'}
        />
      )}
      <DataTable
        itemLabel='transformasi'
        toolbar={
          <TableToolbar
            value={searchText}
            placeholder='Cari transformasi produk'
            onChange={event => handleSearch(event.target.value)}
            clearSearch={() => handleSearch('')}
            actions={
              <Button
                variant='contained'
                onClick={() => setOpenModalAdd(true)}
                startIcon={<Icon icon='tabler:plus' fontSize='1rem' />}
              >
                Tambahkan Transformasi
              </Button>
            }
          />
        }
        columns={[
          {
            flex: 0.3,
            minWidth: 160,
            field: 'code',
            headerName: 'KODE TRANSFORMASI',
            renderCell: params => <Typography variant='body2'>{params.row.code}</Typography>
          },
          {
            flex: 0.5,
            minWidth: 200,
            field: 'info',
            headerName: 'PERUBAHAN TRANSFORMASI',
            renderCell: params => <Typography variant='body2'>{params.row.info}</Typography>
          },
          {
            flex: 0.15,
            minWidth: 120,
            sortable: false,
            field: 'actions',
            headerName: 'ACTION',
            renderCell: ({ row }) => (
              <RowOptions id={row.id} name={row.name} code={row.code} productId={row.masterProductId} />
            )
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
