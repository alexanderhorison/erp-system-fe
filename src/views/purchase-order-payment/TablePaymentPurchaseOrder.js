import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import Icon from 'src/@core/components/icon'
import HandleSearh from 'src/helpers/handleSearch'
import { priceFormat } from 'src/helpers/priceFormatter'
import ModalAddPayment from './ModalAddPaymentPurchaseOrder'

// ** Shared Components
import DataTable from 'src/views/common/DataTable'
import TableToolbar from 'src/views/common/TableToolbar'
import DateCell from 'src/views/common/DateCell'
import PersonCell from 'src/views/common/PersonCell'

const RowOptions = ({ handleView }) => (
  <Box onClick={event => event.stopPropagation()} sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
    <Tooltip title='Lihat'>
      <IconButton onClick={handleView} size='small'>
        <Icon icon='tabler:eye' fontSize='1.125rem' />
      </IconButton>
    </Tooltip>
  </Box>
)

export default function TablePaymentPurchaseOrder({ purchaseOrderData }) {
  const [openModalAdd, setOpenModalAdd] = useState(false)
  const [openModalView, setOpenModalView] = useState(false)
  const [detailPayment, setDetailPayment] = useState({})

  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 })

  const { dataPurchaseOrderPayment: data } = useSelector(state => state.purchaseOrderPayment)

  const handleSearch = searchValue => {
    setSearchText(searchValue)
    HandleSearh({ data, keys: ['typePayment', 'dateCreated'], searchValue, setData: setFilteredData })
  }

  const handleRowClick = row => {
    setDetailPayment(row)
    setOpenModalView(true)
  }

  const canAddPayment =
    purchaseOrderData?.amountDebt && purchaseOrderData?.amountDebt != 0 && purchaseOrderData?.status === 'APPROVED'

  useEffect(() => {
    setFilteredData(data)
  }, [data])

  return (
    <>
      {openModalAdd && (
        <ModalAddPayment
          open={openModalAdd}
          setOpen={setOpenModalAdd}
          typeModal={'ADD'}
          purchaseOrderId={purchaseOrderData?.id}
          amountDebt={purchaseOrderData?.amountDebt}
          purchaseOrderCode={purchaseOrderData?.code}
        />
      )}
      {openModalView && (
        <ModalAddPayment
          open={openModalView}
          setOpen={setOpenModalView}
          typeModal={'VIEW'}
          purchaseOrderId={purchaseOrderData?.id}
          detailPayment={detailPayment}
        />
      )}

      <DataTable
        itemLabel='payment'
        getRowId={row => row.id}
        onRowClick={params => handleRowClick(params.row)}
        toolbar={
          <TableToolbar
            value={searchText}
            placeholder='Cari payment'
            onChange={event => handleSearch(event.target.value)}
            clearSearch={() => handleSearch('')}
            actions={
              canAddPayment && (
                <Button
                  variant='contained'
                  onClick={() => setOpenModalAdd(true)}
                  startIcon={<Icon icon='tabler:plus' fontSize='1rem' />}
                >
                  Buat Pembayaran
                </Button>
              )
            }
          />
        }
        columns={[
          {
            flex: 0.18,
            minWidth: 150,
            field: 'typePayment',
            headerName: 'TIPE PEMBAYARAN',
            renderCell: params => (
              <Typography variant='body2' sx={{ color: 'text.primary' }}>
                {params.row.typePayment}
              </Typography>
            )
          },
          {
            flex: 0.18,
            minWidth: 150,
            field: 'amount',
            headerName: 'JUMLAH PEMBAYARAN',
            renderCell: params => (
              <Typography variant='body2' sx={{ fontWeight: 500, color: 'text.primary' }}>
                Rp {priceFormat(params.row.amount)}
              </Typography>
            )
          },
          {
            flex: 0.18,
            minWidth: 150,
            field: 'createdAt',
            headerName: 'TANGGAL DIBAYAR',
            renderCell: params => <DateCell date={params.row.dateCreated} timestamp={params.row.createdAt} />
          },
          {
            flex: 0.18,
            minWidth: 150,
            field: 'createdBy',
            headerName: 'DIBUAT OLEH',
            sortable: false,
            renderCell: params => <PersonCell person={params.row.createdBy} />
          },
          {
            flex: 0.1,
            minWidth: 90,
            sortable: false,
            field: 'actions',
            headerName: 'ACTION',
            renderCell: ({ row }) => <RowOptions handleView={() => handleRowClick(row)} />
          }
        ]}
        pageSizeOptions={[25, 50, 100]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        rows={filteredData}
        sx={{ '& .MuiDataGrid-row': { cursor: 'pointer' } }}
      />
    </>
  )
}
