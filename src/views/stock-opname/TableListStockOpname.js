import { Box, Card, IconButton, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { useEffect, useMemo, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import Icon from 'src/@core/components/icon'
// import ModalAddMasterProduct from './ModalAddMasterProduct'
import HandleSearh from 'src/helpers/handleSearch'
import { useRouter } from 'next/router'
import { deleteStockOpname, fetchListStockOpname } from 'src/store/apps/stock-opname'
import TableHeaderStockOpname from './TableHeaderStockOpname'
import { returnFormatDate } from 'src/helpers/formatDate'
import { Status } from 'src/@core/components/common'

const RowOptions = (props) => {
  const dispatch = useDispatch()

  const handleDelete = () => {
    dispatch(deleteStockOpname({ id: props.id, name: `${props.code} - ${props.date} - ${props.warehouseName}` }))
  }

  const handleEdit = () => {
    props.router.push(`/stock-opname/${props.id}/edit`)
  }

  const handleClickDetail = () => {
    props.router.push(`/stock-opname/${props.code}`)
  }

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', }}>
        <IconButton onClick={handleClickDetail}>
          <Icon icon='tabler:eye' />
        </IconButton>
        {
          props.status === 'DRAFT' &&
          <IconButton onClick={handleEdit} >
            <Icon icon='tabler:edit' />
          </IconButton>
        }
        {
          process.env.NEXT_PUBLIC_DEVELOPMENT_MODE === 'true' && (
            <IconButton onClick={handleDelete}>
              <Icon icon='tabler:trash' />
            </IconButton>
          )
        }
      </Box>
    </>
  )
}

export default function TableListStockOpname({ }) {
  const dispatch = useDispatch()
  const router = useRouter()

  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 100 })

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
        getRowId={(row) => row.code}
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
                  {params.row.opnameDate}
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
                <Status status={params.row.status} />
              )
            }
          },
          {
            flex: 0.1,
            minWidth: 120,
            sortable: false,
            field: 'actions',
            headerName: 'Actions',
            renderCell: ({ row }) => <RowOptions id={row.id} date={returnFormatDate(row.createdAt)} warehouseName={row.warehouseName} code={row.code} router={router} status={row.status} />
          }
        ]}
        pageSizeOptions={[5, 10, 25, 50]}
        paginationModel={paginationModel}
        onRowClick={row => router.push(`/stock-opname/${row.id}`)}
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
