import { Box, Card, IconButton, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import {  useEffect, useMemo, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import Icon from 'src/@core/components/icon'
// import ModalAddMasterProduct from './ModalAddMasterProduct'
import HandleSearh from 'src/helpers/handleSearch'
import { useRouter } from 'next/router'
import { fetchListStockOpname } from 'src/store/apps/stock-opname'
import TableHeaderStockOpname from './TableHeaderStockOpname'
import { returnFormatDate } from 'src/helpers/formatDate'

const RowOptions = ({ id, name, router }) => {
  const dispatch = useDispatch()
  
  const [openModalEdit, setOpenModalEdit] = useState(false)

  const handleDelete = () => {
    // dispatch(deleteMasterDataProduct({ id, name }))
  }

  const handleEdit = () => {
    // dispatch(fetchMasterDataProductDetail(id))
    setOpenModalEdit(true)
  }

  const handlePageTransformation = () => {
    router.push(`/stock-opname/${id}`)
  }

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', }}>
        <IconButton onClick={handlePageTransformation}>
          <Icon icon='tabler:eye' />
        </IconButton>
        {/* <IconButton onClick={handleEdit}>
          <Icon icon='tabler:edit' />
        </IconButton>
        <IconButton onClick={handleDelete}>
          <Icon icon='tabler:trash' />
        </IconButton> */}
      </Box>
    </>
  )
}

export default function TableListStockOpname({}) {
  const dispatch = useDispatch()
  const router = useRouter()

  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  const { listData: data } = useSelector(state => state.stockOpname)

  const handleSearch = searchValue => {
    setSearchText(searchValue)
    HandleSearh({ data, keys: ['code', 'warehouseName'], searchValue, setData: setFilteredData })
  }

  useEffect(() => {
    dispatch(fetchListStockOpname())
  }, [dispatch])

  useMemo(() => {
    setFilteredData(data)
  }, [data])

  const handleAddStockOpname = () => {
    router.push('/stock-opname/add')
  }

  return (
    <Card>
      <DataGrid
        autoHeight
        columns={[
          {
            flex: 0.1,
            minWidth: 200,
            field: 'code',
            headerName: 'Code',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.code}
                </Typography>
              )
            }
          },
          {
            flex: 0.1,
            minWidth: 120,
            field: 'createdAt',
            headerName: 'Tanggal',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {returnFormatDate(params.row.createdAt)}
                </Typography>
              )
            }
          },
          {
            flex: 0.2,
            minWidth: 120,
            field: 'warehouseName',
            headerName: 'Gudang',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.warehouseName}
                </Typography>
              )
            }
          },
          {
            flex: 0.1,
            minWidth: 120,
            field: 'status',
            headerName: 'Status',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.status}
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
            renderCell: ({ row }) => <RowOptions id={row.id} name={row.name} router={router}/>
          }
        ]}
        pageSizeOptions={[5, 10, 25, 50]}
        paginationModel={paginationModel}

        slots={{ toolbar: TableHeaderStockOpname }}
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
            placeholder: 'Cari code atau gudang',
            clearSearch: () => handleSearch(''),
            onChange: event => handleSearch(event.target.value),
            addStockOpname: () => handleAddStockOpname()
          }
        }}
      />
    </Card>
  )
}
