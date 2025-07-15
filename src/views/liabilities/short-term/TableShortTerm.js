import { Box, Card, CardHeader, Divider, IconButton, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import Icon from 'src/@core/components/icon'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import TableHeaderShortTerm from './TableHeaderShortTerm'
import ModalFormCurrentAsset from './ModalFormShortTerm'
import { priceFormatWIthCurrency } from 'src/helpers/priceFormatter'
import ModalViewCurrentAsset from './ModalViewShortTerm'
import { deleteShortTerm, fetchAllShortTerm, fetchShortTermDetail } from 'src/store/apps/liabilities/short-term'
import ModalFormShortTerm from './ModalFormShortTerm'
import ModalViewShortTerm from './ModalViewShortTerm'
import HandleSearch from 'src/helpers/handleSearch'

const RowOptions = ({ handleView, id, date }) => {
  const dispatch = useDispatch()
  const [openModalEdit, setOpenModalEdit] = useState(false)

  const handleEdit = () => {
    dispatch(fetchShortTermDetail(id))
    setOpenModalEdit(true)
  }

  const handleDelete = () => {
    dispatch(deleteShortTerm({ id, date }))
  }

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', ml: -3 }}>
        <IconButton onClick={e => {
          e.stopPropagation()
          handleView()
        }}>
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
      {openModalEdit && <ModalFormShortTerm open={openModalEdit} setOpen={setOpenModalEdit} typeModal={'EDIT'} id={id} />}
    </>
  )
}

export default function TableShortTerm() {
  const dispatch = useDispatch()

  const { allShortTerm } = useSelector(state => state.shortTerm)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 100 })

  const [openModalAdd, setOpenModalAdd] = useState(false)
  const [openModalDetail, setOpenModalDetail] = useState(false)
  const [selectedRow, setSelectedRow] = useState(null)

  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState([])


  const handleSearch = searchValue => {
    setSearchText(searchValue)
    HandleSearch({
      data: allShortTerm,
      keys: ['date'],
      searchValue,
      setData: setFilteredData
    })
  }

  const handleView = (row) => {
    setOpenModalDetail(true)
    setSelectedRow(row)
  }

  useEffect(() => {
    dispatch(fetchAllShortTerm())
  }, [dispatch])


  useEffect(() => {
    if (allShortTerm) {
      setFilteredData(allShortTerm)
    }
  }, [allShortTerm])

  return (
    <Card>
      <ModalViewShortTerm
        open={openModalDetail}
        setOpen={setOpenModalDetail}
        selectedRow={selectedRow}
      />
      {openModalAdd && <ModalFormShortTerm open={openModalAdd} setOpen={setOpenModalAdd} typeModal={'ADD'} />}
      <Divider sx={{ marginBottom: '1rem' }} />
      <DataGrid
        autoHeight
        columns={[
          {
            flex: 0.2,
            minWidth: 200,
            field: 'date',
            headerName: 'Periode',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.date}
                </Typography>
              )
            }
          },
          {
            flex: 0.2,
            minWidth: 200,
            field: 'totalShortTermLiabilities',
            headerName: 'Total Liabilitas',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {priceFormatWIthCurrency(params.row.totalShortTermLiabilities)}
                </Typography>
              )
            }
          },
          {
            flex: 0.2,
            minWidth: 200,
            field: 'notes',
            headerName: 'Catatan',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.notes}
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
            renderCell: ({ row }) => (
              <RowOptions handleView={() => handleView(row)} id={row.id} date={row.date} />
            )
          }
        ]}
        pageSizeOptions={[5, 10, 25, 50]}
        paginationModel={paginationModel}
        slots={{ toolbar: TableHeaderShortTerm }}
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
            placeholder: 'Cari bulan',
            clearSearch: () => handleSearch(''),
            onChange: event => handleSearch(event.target.value),
            openModalAdd: setOpenModalAdd
          }
        }}
      />
    </Card>
  )
}