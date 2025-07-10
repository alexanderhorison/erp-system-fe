import { Box, Card, Divider, IconButton, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import Icon from 'src/@core/components/icon'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { priceFormatWIthCurrency } from 'src/helpers/priceFormatter'
import HandleSearch from 'src/helpers/handleSearch'
import { fetchAllLongTerm, fetchLongTermDetail, deleteLongTerm } from 'src/store/apps/liabilities/long-term'
import ModalFormLongTerm from './ModalFormLongTerm'
import ModalViewLongTerm from './ModalViewLongTerm'
import TableHeaderLongTerm from './TableHeaderLongTerm'

const RowOptions = ({ handleView, id, date }) => {
  const dispatch = useDispatch()
  const [openModalEdit, setOpenModalEdit] = useState(false)

  const handleEdit = () => {
    dispatch(fetchLongTermDetail(id))
    setOpenModalEdit(true)
  }

  const handleDelete = () => {
    dispatch(deleteLongTerm({ id, period: date }))
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
      {openModalEdit && (
        <ModalFormLongTerm open={openModalEdit} setOpen={setOpenModalEdit} typeModal={'EDIT'} id={id} />
      )}
    </>
  )
}

export default function TableLongTerm() {
  const dispatch = useDispatch()

  const { allLongTerm } = useSelector(state => state.longTerm)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 100 })

  console.log('allLongTerm', allLongTerm)

  const [openModalAdd, setOpenModalAdd] = useState(false)
  const [openModalDetail, setOpenModalDetail] = useState(false)
  const [selectedRow, setSelectedRow] = useState(null)

  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState([])

  const handleSearch = searchValue => {
    setSearchText(searchValue)
    HandleSearch({
      data: allLongTerm,
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
    dispatch(fetchAllLongTerm())
  }, [dispatch])

  useEffect(() => {
    if (allLongTerm) {
      setFilteredData(allLongTerm)
    }
  }, [allLongTerm])

  return (
    <Card>
      <ModalViewLongTerm open={openModalDetail} setOpen={setOpenModalDetail} selectedRow={selectedRow} />
      {openModalAdd && <ModalFormLongTerm open={openModalAdd} setOpen={setOpenModalAdd} typeModal={'ADD'} />}
      <Divider sx={{ marginBottom: '1rem' }} />
      <DataGrid
        autoHeight
        columns={[
          {
            flex: 0.1,
            minWidth: 110,
            field: 'date',
            headerName: 'Tanggal',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.date}
                </Typography>
              )
            }
          },
          {
            flex: 0.18,
            minWidth: 180,
            field: 'shareHolderLoans',
            headerName: 'Pinjaman Kepada Pemegang Saham',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {priceFormatWIthCurrency(params.row.shareHolderLoans)}
                </Typography>
              )
            }
          },
          {
            flex: 0.18,
            minWidth: 180,
            field: 'longTermBankLoans',
            headerName: 'Hutang Bank Jangka Panjang',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {priceFormatWIthCurrency(params.row.longTermBankLoans)}
                </Typography>
              )
            }
          },
          {
            flex: 0.18,
            minWidth: 180,
            field: 'otherLongtermLiabilities',
            headerName: 'Kewajiban Jangka Panjang Lainnya',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {priceFormatWIthCurrency(params.row.otherLongtermLiabilities)}
                </Typography>
              )
            }
          },
          {
            flex: 0.18,
            minWidth: 180,
            field: 'totalLongtermLiabilities',
            headerName: 'Jumlah Liabilitas Jangka Panjang',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
                  {priceFormatWIthCurrency(params.row.totalLongtermLiabilities)}
                </Typography>
              )
            }
          },
          {
            flex: 0.15,
            minWidth: 150,
            field: 'notes',
            headerName: 'Catatan',
            renderCell: params => {
              return (
                <Typography
                  variant='body2'
                  sx={{
                    color: 'text.primary',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '100%'
                  }}
                  title={params.row.notes || '-'}
                >
                  {params.row.notes || '-'}
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
            renderCell: ({ row }) => <RowOptions handleView={() => handleView(row)} id={row.id} date={row.date} />
          }
        ]}
        pageSizeOptions={[5, 10, 25, 50]}
        paginationModel={paginationModel}
        slots={{ toolbar: TableHeaderLongTerm }}
        onPaginationModelChange={setPaginationModel}
        rows={filteredData}
        sx={{
          '& .MuiSvgIcon-root': {
            fontSize: '1.125rem'
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            whiteSpace: 'normal',
            lineHeight: '1.2',
            wordWrap: 'break-word',
            textAlign: 'center'
          },
          '& .MuiDataGrid-columnHeader': {
            height: 'auto !important',
            minHeight: '56px'
          }
        }}
        slotProps={{
          baseButton: {
            size: 'medium',
            variant: 'outlined'
          },
          toolbar: {
            value: searchText,
            placeholder: 'Cari tanggal',
            clearSearch: () => handleSearch(''),
            onChange: event => handleSearch(event.target.value),
            openModalAdd: setOpenModalAdd
          }
        }}
      />
    </Card>
  )
}
