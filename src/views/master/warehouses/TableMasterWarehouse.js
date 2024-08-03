import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'

import { Box, Card, IconButton, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import Icon from 'src/@core/components/icon'

import {
  deleteMasterDataWarehouse,
  fetchMasterDataWarehouse,
  fetchMasterDataWarehouseDetail
} from 'src/store/apps/master/warehouse'

import TableHeaderMasterWarehouse from './TableHeaderMasterWarehouse'
import ModalAddMasterWarehouse from './ModalAddMasterWarehouse'
import HandleSearh from 'src/helpers/handleSearch'

const RowOptions = ({ id, name }) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const [openModalEdit, setOpenModalEdit] = useState(false)

  const handleDelete = () => {
    dispatch(deleteMasterDataWarehouse({ name, id }))
  }

  const handleEdit = () => {
    dispatch(fetchMasterDataWarehouseDetail(id))
    setOpenModalEdit(true)
  }

  const handlePageWarehouseRack = () => {
    router.push(`/master/warehouses/${id}/warehouse-rack`)
  }

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center',  ml: -3 }}>
        <IconButton onClick={handlePageWarehouseRack}>
          <Icon icon='tabler:eye' />
        </IconButton>
        <IconButton onClick={handleEdit}>
          <Icon icon='tabler:edit' />
        </IconButton>
        <IconButton onClick={handleDelete}>
          <Icon icon='tabler:trash' />
        </IconButton>
      </Box>
      {openModalEdit && (
        <ModalAddMasterWarehouse open={openModalEdit} setOpen={setOpenModalEdit} typeModal={'EDIT'} id={id} />
      )}
    </>
  )
}

export default function TableMasterWarehouse({}) {
  const dispatch = useDispatch()
  const [openModalAdd, setOpenModalAdd] = useState(false)

  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 100 })

  const { data } = useSelector(state => state.warehouse)

  const handleSearch = searchValue => {
    setSearchText(searchValue)
    HandleSearh({ data, keys: ["name"], searchValue, setData: setFilteredData })
  }

  useEffect(() => {
    dispatch(fetchMasterDataWarehouse())
  }, [dispatch])

  useEffect(() => {
    setFilteredData(data)
  }, [data])

  return (
    <Card>
      {openModalAdd && <ModalAddMasterWarehouse open={openModalAdd} setOpen={setOpenModalAdd} typeModal={'ADD'} />}
      <DataGrid
        autoHeight
        columns={[
          {
            flex: 0.1,
            minWidth: 200,
            field: 'name',
            headerName: 'Nama Gudang',
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
            field: 'location',
            headerName: 'Lokasi',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.location}
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
            renderCell: ({ row }) => <RowOptions id={row.id} name={row.name} />
          }
        ]}
        pageSizeOptions={[5, 10, 25, 50]}
        paginationModel={paginationModel}
        slots={{ toolbar: TableHeaderMasterWarehouse }}
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
            placeholder: 'Cari nama gudang',
            clearSearch: () => handleSearch(''),
            onChange: event => handleSearch(event.target.value),
            openModalAdd: setOpenModalAdd
          }
        }}
      />
    </Card>
  )
}
