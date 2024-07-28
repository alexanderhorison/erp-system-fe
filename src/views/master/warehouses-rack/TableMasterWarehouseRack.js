import { Box, Card, IconButton, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Icon from 'src/@core/components/icon'
import HandleSearh from 'src/helpers/handleSearch'
import { useRouter } from 'next/router'
import TableHeaderMasterWarehouseRack from './TableHeaderMasterWarehouseRack'
import { deleteMasterDataWarehouseRack, fetchMasterDataWarehouseRack } from 'src/store/apps/master/warehouse-rack'

const RowOptions = ({ id, name, warehouseId }) => {
  const dispatch = useDispatch()
  const router = useRouter()

  const handleDelete = () => {
    dispatch(deleteMasterDataWarehouseRack({ id, name, warehouseId }))
  }

  const handleEdit = () => {
    router.push(`/master/warehouses/${warehouseId}/edit/${id}`)
  }

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', ml: -3 }}>
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

export default function TableMasterWarehouseRack({ warehouseId }) {
  const dispatch = useDispatch()

  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  const { data } = useSelector(state => state.masterWarehouseRack)

  const router = useRouter()

  const handleSearch = searchValue => {
    setSearchText(searchValue)
    HandleSearh({ data, keys: ['name'], searchValue, setData: setFilteredData })
  }

  useEffect(() => {
    if (router.query.id) {
      dispatch(fetchMasterDataWarehouseRack(router.query.id))
    }
  }, [dispatch, router.query.id])

  useEffect(() => {
    setFilteredData(data)
  }, [data])

  const handleAdd = () => {
    router.push(`/master/warehouses/${warehouseId}/add`)
  }

  return (
    <Card>
      <DataGrid
        autoHeight
        columns={[
          {
            flex: 0.1,
            minWidth: 120,
            field: 'name',
            headerName: 'Nama Rak',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.name}
                </Typography>
              )
            }
          },
          {
            flex: 0.1,
            minWidth: 120,
            field: 'description',
            headerName: 'Deskripsi Rak',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.description}
                </Typography>
              )
            }
          },
          {
            flex: 0.04,
            minWidth: 120,
            sortable: false,
            field: 'actions',
            headerName: 'Actions',
            renderCell: ({ row }) => <RowOptions id={row.id} name={row.name} warehouseId={warehouseId} />
          }
        ]}
        pageSizeOptions={[5, 10, 25, 50]}
        paginationModel={paginationModel}
        slots={{ toolbar: TableHeaderMasterWarehouseRack }}
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
            placeholder: 'Cari Rak',
            clearSearch: () => handleSearch(''),
            onChange: event => handleSearch(event.target.value),
            openModalAdd: handleAdd
          }
        }}
      />
    </Card>
  )
}
