import { Box, Card, CardHeader, Divider, IconButton, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import Icon from 'src/@core/components/icon'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteAsset, fetchAsset, fetchAssetDetail } from 'src/store/apps/asset/current'
import TableHeaderCurrentAsset from './TableHeaderMasterProduct'
import ModalFormCurrentAsset from './ModalFormCurrentAsset'
import { priceFormatWIthCurrency } from 'src/helpers/priceFormatter'
import ModalViewCurrentAsset from './ModalViewCurrentAsset'

const RowOptions = ({ handleView, id, period }) => {
  const dispatch = useDispatch()
  const [openModalEdit, setOpenModalEdit] = useState(false)

  const handleEdit = () => {
    dispatch(fetchAssetDetail(id))
    setOpenModalEdit(true)
  }

  const handleDelete = () => {
    dispatch(deleteAsset({ id, period }))
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
      {openModalEdit && <ModalFormCurrentAsset open={openModalEdit} setOpen={setOpenModalEdit} typeModal={'EDIT'} id={id} />}
    </>
  )
}

export default function TableCurrentAsset() {
  const dispatch = useDispatch()

  const { allAssetCurrent } = useSelector(state => state.assetCurrent)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 100 })

  const [openModalAdd, setOpenModalAdd] = useState(false)
  const [openModalDetail, setOpenModalDetail] = useState(false)
  const [selectedRow, setSelectedRow] = useState(null)

  const handleView = (row) => {
    setOpenModalDetail(true)
    setSelectedRow(row)
  }

  useEffect(() => {
    dispatch(fetchAsset())
  }, [dispatch])

  return (
    <Card>
      <ModalViewCurrentAsset
        open={openModalDetail}
        setOpen={setOpenModalDetail}
        selectedRow={selectedRow}
      />
      {openModalAdd && <ModalFormCurrentAsset open={openModalAdd} setOpen={setOpenModalAdd} typeModal={'ADD'} />}
      <Divider sx={{ marginBottom: '1rem' }} />
      <DataGrid
        autoHeight
        columns={[
          {
            flex: 0.2,
            minWidth: 200,
            field: 'period',
            headerName: 'Bulan',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.period}
                </Typography>
              )
            }
          },
          {
            flex: 0.2,
            minWidth: 200,
            field: 'grandTotal',
            headerName: 'Total Aset',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {priceFormatWIthCurrency(params.row.grandTotal)}
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
              <RowOptions handleView={() => handleView(row)} id={row.id} period={row.period} />
            )
          }
        ]}
        pageSizeOptions={[5, 10, 25, 50]}
        paginationModel={paginationModel}
        slots={{ toolbar: TableHeaderCurrentAsset }}
        onPaginationModelChange={setPaginationModel}
        rows={allAssetCurrent}
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