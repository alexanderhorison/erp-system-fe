import { Box, Card, IconButton, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Icon from 'src/@core/components/icon'
import HandleSearh from 'src/helpers/handleSearch'
import { useRouter } from 'next/router'
import TableHeaderMasterTransformation from './TableHeaderMasterTransformation'
import ModalAddMasterTransformation from './ModalAddMasterTransformation'
import {
  deleteMasterDataTransformation,
  fetchMasterDataTransformation,
  fetchMasterDataTransformationDetail
} from 'src/store/apps/master/transformation'
import { fetchMasterDataUnit } from 'src/store/apps/master/unit'

const RowOptions = ({ id, name, productId }) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const [openModalEdit, setOpenModalEdit] = useState(false)

  const handleDelete = () => {
    dispatch(deleteMasterDataTransformation({ id, name, productId }))
  }

  const handleEdit = () => {
    dispatch(fetchMasterDataTransformationDetail(id))
    setOpenModalEdit(true)
  }

  return (
    <>
      {openModalEdit && (
        <ModalAddMasterTransformation open={openModalEdit} setOpen={setOpenModalEdit} typeModal={'EDIT'} id={id} />
      )}
      <Box sx={{ display: 'flex', alignItems: 'center', ml: -3 }}>
        {/* <IconButton onClick={handlePageTransformation}>
          <Icon icon='tabler:eye' />
        </IconButton> */}
        <IconButton onClick={handleEdit}>
          <Icon icon='tabler:edit' />
        </IconButton>
        <IconButton onClick={handleDelete}>
          <Icon icon='tabler:trash' />
        </IconButton>
      </Box>
    </>
  )
}

export default function TableMasterTransformation({ product }) {
  const dispatch = useDispatch()
  const [openModalAdd, setOpenModalAdd] = useState(false)

  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 100 })

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
    <Card>
      {openModalAdd && (
        <ModalAddMasterTransformation
          open={openModalAdd}
          product={product}
          setOpen={setOpenModalAdd}
          typeModal={'ADD'}
        />
      )}
      <DataGrid
        autoHeight
        columns={[
          {
            flex: 0.1,
            minWidth: 120,
            field: 'productTransformationId',
            headerName: 'Kode Transformasi',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.productTransformationId}
                </Typography>
              )
            }
          },
          {
            flex: 0.1,
            minWidth: 120,
            field: 'info',
            headerName: 'Perubahan Transformasi',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.info}
                </Typography>
              )
            }
          },
          {
            flex: 0.1,
            minWidth: 120,
            sortable: false,
            field: 'actions',
            headerName: 'Actions',
            renderCell: ({ row }) => <RowOptions id={row.id} name={row.name} productId={row.masterProductId} />
          }
        ]}
        pageSizeOptions={[5, 10, 25, 50]}
        paginationModel={paginationModel}
        slots={{ toolbar: TableHeaderMasterTransformation }}
        onPaginationModelChange={setPaginationModel}
        rows={filteredData}
        sx={{
          '& .MuiSvgIcon-root': {
            fontSize: '1.125rem'
          }
        }}
        slotProps={{
          baseButton: {
            size: 'medium',
            variant: 'outlined'
          },
          toolbar: {
            value: searchText,
            placeholder: 'Cari transformasi produk',
            clearSearch: () => handleSearch(''),
            onChange: event => handleSearch(event.target.value),
            openModalAdd: setOpenModalAdd
          }
        }}
      />
    </Card>
  )
}
