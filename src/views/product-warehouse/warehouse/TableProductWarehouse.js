import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

import { Box, Card, IconButton, Typography } from '@mui/material'
import Icon from 'src/@core/components/icon'

import { DataGrid } from '@mui/x-data-grid'

import { fetchMasterDataWarehouse } from 'src/store/apps/master/warehouse'
import TableHeaderProductWarehouse from './TableHeaderProductWarehouse'
import HandleSearh from 'src/helpers/handleSearch'

const RowOptions = ({ handleView }) => {
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={handleView}>
          <Icon icon='tabler:eye' />
        </IconButton>
      </Box>
    </>
  )
}

export default function TableProductWarehouse({ }) {
  const dispatch = useDispatch()
  const router = useRouter()

  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  const { data } = useSelector(state => state.warehouse)

  const handleSearch = searchValue => {
    setSearchText(searchValue)
    HandleSearh({ data, keys: ["name", "location"], searchValue, setData: setFilteredData })
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
    <Card>
      <DataGrid
        autoHeight
        columns={[
          {
            flex: 0.1,
            minWidth: 200,
            field: 'name',
            headerName: 'Nama Gudang',
            cellClassName: {
              cursor: 'pointer'
            },
            renderCell: params => {
              return (
                <Typography style={{ cursor: 'pointer' }} variant='body2' sx={{ color: 'text.primary' }}>
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
            renderCell: ({ row }) => <RowOptions handleView={() => handleRowClick(row)} />
          }
        ]}
        pageSizeOptions={[5, 10, 25, 50]}
        onCellClick={handleRowClick}
        paginationModel={paginationModel}
        slots={{ toolbar: TableHeaderProductWarehouse }}
        onPaginationModelChange={setPaginationModel}
        rows={filteredData}
        sx={{
          '& .MuiSvgIcon-root': {
            fontSize: '1.125rem'
          },
          '& .MuiDataGrid-cell': {
            cursor: 'pointer'
          }
        }}
        slotProps={{
          baseButton: {
            size: 'medium',
            variant: 'outlined'
          },
          toolbar: {
            value: searchText,
            clearSearch: () => handleSearch(''),
            onChange: event => handleSearch(event.target.value),
            placeholder: "Cari gudang atau lokasi"
          }
        }}
      />
    </Card>
  )
}
