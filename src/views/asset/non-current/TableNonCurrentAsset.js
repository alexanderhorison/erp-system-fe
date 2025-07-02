import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

import { Box, Card, IconButton, Typography } from '@mui/material'

import Icon from 'src/@core/components/icon'

import { DataGrid } from '@mui/x-data-grid'

import HandleSearh from 'src/helpers/handleSearch'
import { priceFormatWIthCurrency } from 'src/helpers/priceFormatter'
import { returnFormatMonthYear } from 'src/helpers/formatDate'
import TableHeaderNonCurrentAsset from './TableHeaderNonCurrentAsset'
import ModalFormGenerateNonCurrentAssets from './ModalFormGenerateNonCurrentAsset'
import { fetchDeleteMonthlyNonCurrentAsset, fetchMonthlyNonCurrentAsset } from 'src/store/apps/asset/non-current'
import ModalDetailMonthlyNonCurrentAsset from './ModalDetailMonthlyNonCurrentAsset'

const RowOptions = ({ handleView, handleDelete }) => {
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton
          onClick={e => {
            e.stopPropagation()
            handleView()
          }}
        >
          <Icon icon='tabler:eye' />
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
    </>
  )
}

export default function TableNonCurrentAsset() {
  const dispatch = useDispatch()
  const router = useRouter()
  const [openModal, setOpenModal] = useState(false)
  const [openModalDetail, setOpenModalDetail] = useState(false)
  const [typeModal, setTypeModal] = useState('ADD')
  const [selectedRow, setSelectedRow] = useState(null)

  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 100 })

  const { allData: data, loadingAllData: loading } = useSelector(state => state.nonCurrentAsset)

  const handleSearch = searchValue => {
    setSearchText(searchValue)
    HandleSearh({
      data,
      keys: ['month', 'notes'],
      searchValue,
      setData: setFilteredData
    })
  }

  const handleView = row => {
    setSelectedRow(row)
    setTypeModal('VIEW')
    setOpenModalDetail(true)
  }

  const handleAdd = () => {
    setSelectedRow(null)
    setTypeModal('ADD')
    setOpenModal(true)
  }

  const handleDelete = row => {
    dispatch(fetchDeleteMonthlyNonCurrentAsset({id: row.id, date: row.date}))
  }

  useEffect(() => {
    dispatch(fetchMonthlyNonCurrentAsset())
  }, [])

  useEffect(() => {
    if (data) {
      setFilteredData(data)
    }
  }, [data])

  return (
    <Card>
      <ModalFormGenerateNonCurrentAssets
        open={openModal}
        setOpen={setOpenModal}
        typeModal={typeModal}
        data={selectedRow}
      />
      <ModalDetailMonthlyNonCurrentAsset
        open={openModalDetail && typeModal === 'VIEW'}
        setOpen={setOpenModalDetail}
        selectedRow={selectedRow}
      />
      <DataGrid
        autoHeight
        loading={loading}
        columns={[
          {
            flex: 2,
            minWidth: 120,
            field: 'date',
            headerName: 'Bulan',
            headerAlign: 'left',
            renderCell: params => {
              return (
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography
                    variant='body2'
                    sx={{ color: 'text.primary', whiteSpace: 'normal', wordWrap: 'break-word' }}
                  >
                    {returnFormatMonthYear(params.row.date) || '-'}
                  </Typography>
                </Box>
              )
            }
          },
          {
            flex: 3,
            minWidth: 150,
            field: 'totalValue',
            headerName: 'Jumlah Total',
            headerAlign: 'left',
            renderCell: params => {
              return (
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography
                    variant='body2'
                    sx={{ color: 'text.primary', whiteSpace: 'normal', wordWrap: 'break-word' }}
                  >
                    {priceFormatWIthCurrency(params.row.totalValue, false) || '-'}
                  </Typography>
                </Box>
              )
            }
          },
          {
            flex: 3,
            minWidth: 150,
            field: 'notes',
            headerName: 'Catatan',
            headerAlign: 'left',
            renderCell: params => {
              return (
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography
                    variant='body2'
                    sx={{ color: 'text.primary', whiteSpace: 'normal', wordWrap: 'break-word' }}
                  >
                    {params.row.notes || '-'}
                  </Typography>
                </Box>
              )
            }
          },
          {
            flex: 0.1,
            minWidth: 100,
            sortable: false,
            field: 'actions',
            headerName: 'Actions',
            headerAlign: 'left',
            renderCell: ({ row }) => (
              <RowOptions handleView={() => handleView(row)} handleDelete={() => handleDelete(row)} />
            )
          }
        ]}
        pageSizeOptions={[5, 10, 25, 50]}
        paginationModel={paginationModel}
        onCellClick={params => {
          handleView(params.row)
        }}
        slots={{ toolbar: TableHeaderNonCurrentAsset }}
        onPaginationModelChange={setPaginationModel}
        rows={filteredData}
        sx={{
          '& .MuiSvgIcon-root': {
            fontSize: '1.125rem'
          },
          '& .MuiDataGrid-cell': {
            cursor: 'pointer',
            whiteSpace: 'normal !important',
            wordWrap: 'break-word !important'
          },
          '& .MuiDataGrid-columnHeader': {
            textAlign: 'left'
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            whiteSpace: 'normal !important',
            wordWrap: 'break-word !important',
            lineHeight: '1.2 !important'
          },
          '& .MuiDataGrid-columnHeader .MuiDataGrid-columnHeaderTitleContainer': {
            height: 'auto !important',
            minHeight: '40px !important'
          },
          '& .MuiDataGrid-row': {
            maxHeight: 'none !important'
          },
          '& .MuiDataGrid-renderingZone': {
            maxHeight: 'none !important'
          },
          '& .MuiDataGrid-columnHeaders': {
            minHeight: '60px !important'
          }
        }}
        slotProps={{
          baseButton: {
            size: 'medium',
            variant: 'outlined'
          },
          toolbar: {
            value: searchText,
            placeholder: 'Cari bulan atau notes',
            clearSearch: () => handleSearch(''),
            onChange: event => handleSearch(event.target.value),
            handleAdd: handleAdd
          }
        }}
      />
    </Card>
  )
}
