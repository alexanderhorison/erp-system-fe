import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

import { Box, IconButton, Typography } from '@mui/material'
import Icon from 'src/@core/components/icon'

import { fetchMasterDataWarehouse } from 'src/store/apps/master/warehouse'
import HandleSearh from 'src/helpers/handleSearch'

// ** Shared Components
import DataTable from 'src/views/common/DataTable'
import TableToolbar from 'src/views/common/TableToolbar'

const RowOptions = ({ handleView }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
      <IconButton onClick={handleView} size='small' title='Lihat Gudang'>
        <Icon icon='tabler:eye' fontSize='1.125rem' />
      </IconButton>
    </Box>
  )
}

export default function TableProductWarehouse({}) {
  const dispatch = useDispatch()
  const router = useRouter()

  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 50 })

  const { data } = useSelector(state => state.warehouse)

  const handleSearch = searchValue => {
    setSearchText(searchValue)
    HandleSearh({ data, keys: ['name', 'location'], searchValue, setData: setFilteredData })
  }

  const handleRowClick = params => {
    const warehouseId = params.id
    router.push(`/product-warehouse/warehouse/${warehouseId}`)
  }

  useEffect(() => {
    dispatch(fetchMasterDataWarehouse())
    // eslint-disable-next-line
  }, [dispatch])

  useEffect(() => {
    setFilteredData(data)
    // eslint-disable-next-line
  }, [data])

  return (
    <DataTable
      itemLabel='warehouses'
      toolbar={
        <TableToolbar
          value={searchText}
          placeholder='Search warehouse or location'
          onChange={event => handleSearch(event.target.value)}
          clearSearch={() => handleSearch('')}
        />
      }
      columns={[
        {
          flex: 0.4,
          minWidth: 200,
          field: 'name',
          headerName: 'Warehouse Name',
          renderCell: params => <Typography variant='body2'>{params.row.name}</Typography>
        },
        {
          flex: 0.45,
          minWidth: 160,
          field: 'location',
          headerName: 'Location',
          renderCell: params => <Typography variant='body2'>{params.row.location || '-'}</Typography>
        },
        {
          flex: 0.15,
          minWidth: 100,
          sortable: false,
          field: 'actions',
          headerName: 'Action',
          renderCell: ({ row }) => <RowOptions handleView={() => handleRowClick(row)} />
        }
      ]}
      pageSizeOptions={[25, 50, 100]}
      onCellClick={handleRowClick}
      paginationModel={paginationModel}
      onPaginationModelChange={setPaginationModel}
      rows={filteredData}
      sx={{
        '& .MuiDataGrid-cell': {
          cursor: 'pointer'
        }
      }}
    />
  )
}
