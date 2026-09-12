import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import Icon from 'src/@core/components/icon'
import HandleSearh from 'src/helpers/handleSearch'
import { fetchMasterNonCurrentAsset } from 'src/store/apps/asset/master-non-current'
import { nonCurrentAssetsType } from 'src/data/nonCurrentAssetsType'
import { priceFormatWIthCurrency } from 'src/helpers/priceFormatter'
import { returnFormatMonthYear } from 'src/helpers/formatDate'

import ModalFormMasterNonCurrentAssets from './ModalFormMasterNonCurrentAssets'
import ModalViewMasterNonCurrentAsset from './ModalViewMasterNonCurrentAsset'

// ** Shared Components
import DataTable from 'src/views/common/DataTable'
import TableToolbar from 'src/views/common/TableToolbar'

const RowOptions = ({ onView, onEdit }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
    <Tooltip title='Lihat'>
      <IconButton onClick={onView} size='small'>
        <Icon icon='tabler:eye' fontSize='1.125rem' />
      </IconButton>
    </Tooltip>
    <Tooltip title='Ubah'>
      <IconButton onClick={onEdit} size='small'>
        <Icon icon='tabler:edit' fontSize='1.125rem' />
      </IconButton>
    </Tooltip>
  </Box>
)

export default function TableMasterNonCurrentAsset() {
  const dispatch = useDispatch()

  const [openModalForm, setOpenModalForm] = useState(false)
  const [openModalDetail, setOpenModalDetail] = useState(false)
  const [typeModal, setTypeModal] = useState('ADD')
  const [selectedRow, setSelectedRow] = useState(null)

  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 50 })

  const { allData: data, loadingAllData: loading } = useSelector(state => state.masterNonCurrentAsset)

  const handleSearch = searchValue => {
    setSearchText(searchValue)
    HandleSearh({ data, keys: ['name', 'assetType'], searchValue, setData: setFilteredData })
  }

  const handleView = row => {
    setSelectedRow(row)
    setOpenModalDetail(true)
  }

  const handleAdd = () => {
    setSelectedRow(null)
    setTypeModal('ADD')
    setOpenModalForm(true)
  }

  const handleEdit = row => {
    setSelectedRow(row)
    setTypeModal('EDIT')
    setOpenModalForm(true)
  }

  useEffect(() => {
    dispatch(fetchMasterNonCurrentAsset())
  }, [dispatch])

  useEffect(() => {
    setFilteredData(data)
  }, [data])

  return (
    <>
      <DataTable
        itemLabel='aset tidak lancar'
        loading={loading}
        getRowId={row => row.id}
        onRowClick={params => handleView(params.row)}
        toolbar={
          <TableToolbar
            value={searchText}
            placeholder='Cari nama aset'
            onChange={event => handleSearch(event.target.value)}
            clearSearch={() => handleSearch('')}
            actions={
              <Button
                variant='contained'
                onClick={handleAdd}
                startIcon={<Icon icon='tabler:plus' fontSize='1rem' />}
              >
                Tambah Aset Tidak Lancar
              </Button>
            }
          />
        }
        columns={[
          {
            flex: 0.22,
            minWidth: 160,
            field: 'name',
            headerName: 'NAMA ASET',
            renderCell: params => (
              <Typography variant='body2' sx={{ color: 'text.primary' }}>
                {params.row.name}
              </Typography>
            )
          },
          {
            flex: 0.15,
            minWidth: 140,
            field: 'assetType',
            headerName: 'JENIS ASET',
            renderCell: params => (
              <Typography variant='body2' sx={{ color: 'text.primary' }}>
                {nonCurrentAssetsType.find(type => type.value === params.row.assetType)?.key || 'Unknown'}
              </Typography>
            )
          },
          {
            flex: 0.18,
            minWidth: 150,
            field: 'assetValue',
            headerName: 'NILAI ASET',
            renderCell: params => (
              <Typography variant='body2' sx={{ color: 'text.primary' }}>
                {priceFormatWIthCurrency(params.row.assetValue, false)}
              </Typography>
            )
          },
          {
            flex: 0.15,
            minWidth: 140,
            field: 'acquisitionDate',
            headerName: 'WAKTU AKUISISI',
            renderCell: params => (
              <Typography variant='body2' sx={{ color: 'text.primary' }}>
                {returnFormatMonthYear(params.row.acquisitionDate)}
              </Typography>
            )
          },
          {
            flex: 0.1,
            minWidth: 110,
            field: 'isDepreciable',
            headerName: 'DEPRESIASI',
            renderCell: params => (
              <Typography variant='body2' sx={{ color: 'text.primary' }}>
                {params.row.isDepreciable ? 'Ya' : 'Tidak'}
              </Typography>
            )
          },
          {
            flex: 0.18,
            minWidth: 150,
            field: 'depreciationValue',
            headerName: 'JUMLAH DEPRESIASI',
            sortable: false,
            renderCell: params =>
              params.row.isDepreciable ? (
                <Box>
                  <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {priceFormatWIthCurrency(params.row.depreciationValue, false)}
                  </Typography>
                  <Typography variant='caption' sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                    Per Bulan
                  </Typography>
                </Box>
              ) : (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  -
                </Typography>
              )
          },
          {
            flex: 0.1,
            minWidth: 110,
            sortable: false,
            field: 'actions',
            headerName: 'ACTION',
            renderCell: ({ row }) => (
              <Box onClick={event => event.stopPropagation()} sx={{ width: '100%' }}>
                <RowOptions onView={() => handleView(row)} onEdit={() => handleEdit(row)} />
              </Box>
            )
          }
        ]}
        pageSizeOptions={[25, 50, 100]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        rows={filteredData}
        sx={{ '& .MuiDataGrid-row': { cursor: 'pointer' } }}
      />

      {openModalForm && (
        <ModalFormMasterNonCurrentAssets
          open={openModalForm}
          setOpen={setOpenModalForm}
          typeModal={typeModal}
          data={selectedRow}
        />
      )}
      <ModalViewMasterNonCurrentAsset open={openModalDetail} setOpen={setOpenModalDetail} selectedRow={selectedRow} />
    </>
  )
}
