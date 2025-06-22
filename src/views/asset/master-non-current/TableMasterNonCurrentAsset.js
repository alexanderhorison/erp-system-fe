import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

import { Box, Card, IconButton, Typography } from '@mui/material'

import Icon from 'src/@core/components/icon'

import { DataGrid } from '@mui/x-data-grid'

import HandleSearh from 'src/helpers/handleSearch'
import { fetchMasterNonCurrentAsset } from 'src/store/apps/asset/master-non-current'
import TableHeaderMasterNonCurrentAsset from './TableHeaderMasterNonCurrentAsset'
import { nonCurrentAssetsType } from 'src/data/nonCurrentAssetsType'
import { priceFormatWIthCurrency } from 'src/helpers/priceFormatter'
import { returnFormatDate } from 'src/helpers/formatDate'
import ModalFormMasterNonCurrentAssets from './ModalFormMasterNonCurrentAssets'

const RowOptions = ({ handleView, handleEdit }) => {
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={() => handleView()}>
          <Icon icon='tabler:eye' />
        </IconButton>
        <IconButton onClick={() => handleEdit()}>
          <Icon icon='tabler:edit' />
        </IconButton>
      </Box>
    </>
  )
}

export default function TableMasterNonCurrentAsset() {
  const dispatch = useDispatch()
  const router = useRouter()
  const [openModal, setOpenModal] = useState(false)
  const [typeModal, setTypeModal] = useState('ADD')
  const [selectedRow, setSelectedRow] = useState(null)


  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 100 })

  const { allData: data, loadingAllData: loading } = useSelector(state => state.masterNonCurrentAsset)

  const handleSearch = searchValue => {
    setSearchText(searchValue)
    HandleSearh({
      data,
      keys: ['name', 'assetType'],
      searchValue,
      setData: setFilteredData
    })
  }

  const handleView = row => {
    setSelectedRow(row)
    setTypeModal('VIEW')
    setOpenModal(true)
  }

  const handleAdd = () => {
    setSelectedRow(null)
    setTypeModal('ADD')
    setOpenModal(true)
  }

  const handleEdit = row => {
    setSelectedRow(row)
    setTypeModal('EDIT')
    setOpenModal(true)
  }

  useEffect(() => {
    dispatch(fetchMasterNonCurrentAsset())
  }, [])

  useEffect(() => {
    if (data) {
      setFilteredData(data)
    }
  }, [data])

  return (
    <Card>
      <ModalFormMasterNonCurrentAssets open={openModal} setOpen={setOpenModal} typeModal={typeModal} data={selectedRow} />
      <DataGrid
        autoHeight
        loading={loading}
        columns={[
          // {
          //   flex: 0.05,
          //   // minWidth: 100,
          //   field: 'id',
          //   headerName: 'Id',
          //   headerAlign: 'left',
          //   cellClassName: {
          //     cursor: 'pointer'
          //   },
          //   renderCell: params => {
          //     return (
          //       <Typography
          //         style={{ cursor: 'pointer' }}
          //         variant='body2'
          //         sx={{ color: 'text.primary', whiteSpace: 'normal', wordWrap: 'break-word' }}
          //       >
          //         {params.row.id}
          //       </Typography>
          //     )
          //   }
          // },
          {
            flex: 2,
            minWidth: 120,
            field: 'name',
            headerName: 'Nama Aset',
            headerAlign: 'left',
            renderCell: params => {
              return (
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography
                    variant='body2'
                    sx={{ color: 'text.primary', whiteSpace: 'normal', wordWrap: 'break-word' }}
                  >
                    {params.row.name}
                  </Typography>
                </Box>
              )
            }
          },
          {
            flex: 2,
            minWidth: 120,
            field: 'assetType',
            headerName: 'Tipe Aset',
            headerAlign: 'left',
            renderCell: params => {
              return (
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography
                    variant='body2'
                    sx={{ color: 'text.primary', whiteSpace: 'normal', wordWrap: 'break-word' }}
                  >
                    {nonCurrentAssetsType.find(type => type.value === params.row.assetType)?.key || 'Unknown'}
                  </Typography>
                </Box>
              )
            }
          },
          {
            flex: 2,
            minWidth: 120,
            field: 'assetValue',
            headerName: 'Nilai Aset',
            headerAlign: 'left',
            renderCell: params => {
              return (
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography
                    variant='body2'
                    sx={{ color: 'text.primary', whiteSpace: 'normal', wordWrap: 'break-word' }}
                  >
                    {priceFormatWIthCurrency(params.row.assetValue, false)}
                  </Typography>
                </Box>
              )
            }
          },
          {
            flex: 1,
            minWidth: 120,
            field: 'isDepreciable',
            headerName: 'Depresiasi',
            headerAlign: 'left',
            renderCell: params => {
              return (
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography
                    variant='body2'
                    sx={{ color: 'text.primary', whiteSpace: 'normal', wordWrap: 'break-word' }}
                  >
                    {params.row.isDepreciable ? 'Ya' : 'Tidak'}
                  </Typography>
                </Box>
              )
            }
          },
          {
            flex: 2,
            minWidth: 120,
            field: 'acquisitionDate',
            headerName: 'Tanggal Akuisisi',
            headerAlign: 'left',
            renderCell: params => {
              return (
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography
                    variant='body2'
                    sx={{ color: 'text.primary', whiteSpace: 'normal', wordWrap: 'break-word' }}
                  >
                    {returnFormatDate(params.row.acquisitionDate)}
                  </Typography>
                </Box>
              )
            }
          },
          {
            flex: 2,
            minWidth: 120,
            field: 'depreciationMonths',
            headerName: 'Waktu Depresiasi',
            headerAlign: 'left',
            renderCell: params => {
              return (
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography
                    variant='body2'
                    sx={{ color: 'text.primary', whiteSpace: 'normal', wordWrap: 'break-word' }}
                  >
                    {params.row?.depreciationMonths ? `${params.row.depreciationMonths} bulan` : '-'}
                  </Typography>
                </Box>
              )
            }
          },
          {
            flex: 0.2,
            minWidth: 120,
            field: 'depreciationValue',
            headerName: 'Nilai Depresiasi',
            headerAlign: 'left',
            renderCell: params => {
              return (
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography
                    variant='body2'
                    sx={{ color: 'text.primary', whiteSpace: 'normal', wordWrap: 'break-word' }}
                  >
                    {priceFormatWIthCurrency(params.row.depreciationValue, false)}
                  </Typography>
                </Box>
              )
            }
          },
          // {
          //   flex: 0.05,
          //   field: 'notes',
          //   headerName: 'Catatan',
          //   headerAlign: 'left',
          //   renderCell: params => {
          //     return (
          //       <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          //         <Typography
          //           variant='body2'
          //           sx={{ color: 'text.primary', whiteSpace: 'normal', wordWrap: 'break-word' }}
          //         >
          //           {params.row.notes || '-'}
          //         </Typography>
          //       </Box>
          //     )
          //   }
          // },
          {
            flex: 0.1,
            minWidth: 100,
            sortable: false,
            field: 'actions',
            headerName: 'Actions',
            headerAlign: 'left',
            renderCell: ({ row }) => (
              <RowOptions handleView={() => handleView(row)} handleEdit={() => handleEdit(row)} />
            )
          }
        ]}
        pageSizeOptions={[5, 10, 25, 50]}
        paginationModel={paginationModel}
        // onCellClick={params => handleRowClick(params.row)}
        slots={{ toolbar: TableHeaderMasterNonCurrentAsset }}
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
            placeholder: 'Cari nama aset',
            clearSearch: () => handleSearch(''),
            onChange: event => handleSearch(event.target.value),
            handleAdd: handleAdd
          }
        }}
      />
    </Card>
  )
}
