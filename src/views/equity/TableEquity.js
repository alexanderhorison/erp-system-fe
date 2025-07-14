import { Box, Card, CardHeader, Divider, IconButton, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import Icon from 'src/@core/components/icon'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import TableHeaderEquity from './TableHeaderEquity'
import ModalFormEquity from './ModalFormEquity'
import { priceFormatWIthCurrency } from 'src/helpers/priceFormatter'
import ModalViewEquity from './ModalViewEquity'
import { deleteEquity, fetchAllEquity, fetchEquityDetail } from 'src/store/apps/equity'
import HandleSearch from 'src/helpers/handleSearch'
import { returnFormatMonthYear } from 'src/helpers/formatDate'

const RowOptions = ({ handleView, id, period }) => {
  const dispatch = useDispatch()
  const [openModalEdit, setOpenModalEdit] = useState(false)

  const handleEdit = () => {
    dispatch(fetchEquityDetail(id))
    setOpenModalEdit(true)
  }

  const handleDelete = () => {
    dispatch(deleteEquity({ id, period }))
  }

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', ml: -3 }}>
        <IconButton
          onClick={e => {
            e.stopPropagation()
            handleView()
          }}
        >
          <Icon icon='tabler:eye' />
        </IconButton>
        <IconButton onClick={handleEdit}>
          <Icon icon='tabler:edit' />
        </IconButton>
        <IconButton
          onClick={e => {
            e.stopPropagation()
            handleDelete()
          }}
        >
          <Icon icon='tabler:trash' />
        </IconButton>
      </Box>
      {openModalEdit && <ModalFormEquity open={openModalEdit} setOpen={setOpenModalEdit} typeModal={'EDIT'} id={id} />}
    </>
  )
}

export default function TableEquity() {
  const dispatch = useDispatch()

  const { allEquity } = useSelector(state => state.equity)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 100 })

  const [openModalAdd, setOpenModalAdd] = useState(false)
  const [openModalDetail, setOpenModalDetail] = useState(false)
  const [selectedRow, setSelectedRow] = useState(null)

  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState([])

  const handleSearch = searchValue => {
    setSearchText(searchValue)
    HandleSearch({
      data: allEquity,
      keys: ['date', 'notes'],
      searchValue,
      setData: setFilteredData
    })
  }

  const handleView = row => {
    setOpenModalDetail(true)
    setSelectedRow(row)
  }

  useEffect(() => {
    dispatch(fetchAllEquity())
  }, [dispatch])

  useEffect(() => {
    if (allEquity) {
      setFilteredData(allEquity)
    }
  }, [allEquity])
  console.log('allEquity', allEquity)

  return (
    <Card>
      <ModalViewEquity open={openModalDetail} setOpen={setOpenModalDetail} selectedRow={selectedRow} />
      {openModalAdd && <ModalFormEquity open={openModalAdd} setOpen={setOpenModalAdd} typeModal={'ADD'} />}
      <Divider sx={{ marginBottom: '1rem' }} />
      <DataGrid
        autoHeight
        columns={[
          {
            flex: 0.15,
            minWidth: 150,
            field: 'date',
            headerName: 'Periode',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {returnFormatMonthYear(params.row.date)}
                </Typography>
              )
            }
          },
          {
            flex: 0.25,
            minWidth: 250,
            field: 'totalEquity',
            headerName: 'Total Ekuitas',
            headerAlign: 'center',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
                  {params.row.totalEquity ? priceFormatWIthCurrency(params.row.totalEquity) : '-'}
                </Typography>
              )
            }
          },
          {
            flex: 0.3,
            minWidth: 200,
            field: 'notes',
            headerName: 'Catatan',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.notes || '-'}
                </Typography>
              )
            }
          },
          {
            flex: 0.15,
            minWidth: 120,
            sortable: false,
            field: 'actions',
            headerName: 'Actions',
            renderCell: ({ row }) => (
              <RowOptions handleView={() => handleView(row)} id={row.id} period={returnFormatMonthYear(row.date)} />
            )
          }
        ]}
        pageSizeOptions={[5, 10, 25, 50]}
        paginationModel={paginationModel}
        slots={{ toolbar: TableHeaderEquity }}
        onPaginationModelChange={setPaginationModel}
        rows={filteredData}
        sx={{
          '& .MuiSvgIcon-root': {
            fontSize: '1.125rem'
          },
          '& .MuiDataGrid-columnHeader': {
            whiteSpace: 'normal !important',
            wordWrap: 'break-word !important',
            lineHeight: '1.2 !important',
            overflow: 'visible !important',
            textAlign: 'center'
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            whiteSpace: 'normal !important',
            overflow: 'visible !important',
            lineHeight: '1.2 !important',
            fontWeight: 600
          },
          '& .MuiDataGrid-columnHeaders': {
            minHeight: '56px !important',
            maxHeight: 'none !important'
          }
        }}
        slotProps={{
          baseButton: {
            size: 'medium',
            variant: 'outlined'
          },
          toolbar: {
            value: searchText,
            placeholder: 'Cari periode atau catatan',
            clearSearch: () => handleSearch(''),
            onChange: event => handleSearch(event.target.value),
            openModalAdd: setOpenModalAdd
          }
        }}
      />
    </Card>
  )
}
