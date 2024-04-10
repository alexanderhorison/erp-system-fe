import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Box, Card, IconButton, Menu, MenuItem, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import Icon from 'src/@core/components/icon'

import {
  deleteMasterDataWarehouse,
  fetchMasterDataWarehouse,
  fetchMasterDataWarehouseDetail
} from 'src/store/apps/master/warehouse'

import TableHeaderMasterWarehouse from './TableHeaderMasterWarehouse'
import ModalAddMasterWarehouse from './ModalAddMasterWarehouse'

const RowOptions = ({ id, name }) => {
  const dispatch = useDispatch()
  const [openModalEdit, setOpenModalEdit] = useState(false)

  const handleDelete = () => {
    dispatch(deleteMasterDataWarehouse({ name, id }))
  }

  const handleEdit = () => {
    dispatch(fetchMasterDataWarehouseDetail(id))
    setOpenModalEdit(true)
  }

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  const { data } = useSelector(state => state.warehouse)

  const handleSearch = searchValue => {
    setSearchText(searchValue)
    if (searchValue.length) {
      const filteredRows = data.filter(row => row.name.toLowerCase().includes(searchValue.toLowerCase()))
      setFilteredData(filteredRows)
    } else {
      setFilteredData([])
    }
  }

  useEffect(() => {
    dispatch(fetchMasterDataWarehouse())
  }, [])

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
            flex: 0.2,
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
            flex: 0.01,
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
        rows={filteredData.length ? filteredData : data}
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
