import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'

import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import Icon from 'src/@core/components/icon'
import { fetchEmployeeDebt } from 'src/store/apps/master/employee'
import { priceFormatWIthCurrency } from 'src/helpers/priceFormatter'
import ModalFormDebt from './ModalFormDebt'

// ** Shared Components
import DataTable from 'src/views/common/DataTable'
import TableToolbar from 'src/views/common/TableToolbar'

export default function TableDebtEmployee() {
  const dispatch = useDispatch()
  const router = useRouter()
  const { id } = router.query

  const [openModal, setOpenModal] = useState(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 })
  const [type, setType] = useState('')

  const { employeeDebt, loadingEmployeeDebt } = useSelector(state => state.masterEmployee)

  const handleClick = nextType => {
    setType(nextType)
    setOpenModal(true)
  }

  useEffect(() => {
    dispatch(
      fetchEmployeeDebt({
        id: +id,
        params: {
          page: paginationModel.page + 1,
          pageSize: paginationModel.pageSize
        }
      })
    )
  }, [id, paginationModel, dispatch])

  return (
    <>
      <DataTable
        itemLabel='kasbon'
        loading={loadingEmployeeDebt}
        getRowId={row => row.id}
        showActions={false}
        toolbar={
          <TableToolbar
            actions={
              <>
                <Button
                  size='small'
                  variant='contained'
                  startIcon={<Icon icon='tabler:coins' fontSize='1rem' />}
                  onClick={() => handleClick('PEMINJAMAN')}
                >
                  Tambah Kasbon
                </Button>
                <Button
                  size='small'
                  variant='contained'
                  startIcon={<Icon icon='tabler:cash-banknote' fontSize='1rem' />}
                  onClick={() => handleClick('PEMBAYARAN')}
                >
                  Bayar Kasbon
                </Button>
              </>
            }
          />
        }
        columns={[
          {
            flex: 0.16,
            minWidth: 120,
            field: 'category',
            headerName: 'KATEGORI',
            renderCell: params => (
              <Typography variant='body2' sx={{ color: 'text.primary' }}>
                {params.row.category || '-'}
              </Typography>
            )
          },
          {
            flex: 0.16,
            minWidth: 120,
            field: 'date',
            headerName: 'TANGGAL',
            renderCell: params => (
              <Typography variant='body2' sx={{ color: 'text.primary' }}>
                {params.row.date ? new Date(params.row.date).toLocaleDateString('id-ID') : '-'}
              </Typography>
            )
          },
          {
            flex: 0.18,
            minWidth: 130,
            field: 'amount',
            headerName: 'JUMLAH',
            renderCell: params => (
              <Typography variant='body2' sx={{ color: 'text.primary' }}>
                {params.row.amount ? priceFormatWIthCurrency(params.row.amount) : '-'}
              </Typography>
            )
          },
          {
            flex: 0.18,
            minWidth: 120,
            field: 'type',
            headerName: 'TIPE',
            renderCell: params => (
              <Typography variant='body2' sx={{ color: 'text.primary' }}>
                {params.row.type}
              </Typography>
            )
          },
          {
            flex: 0.32,
            minWidth: 140,
            field: 'notes',
            headerName: 'NOTES',
            renderCell: params => (
              <Typography variant='body2' sx={{ color: 'text.primary' }}>
                {params.row.notes || '-'}
              </Typography>
            )
          }
        ]}
        pageSizeOptions={[5, 10]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        paginationMode='server'
        // ** Server-paginated: only the current page's rows are loaded, so the
        // footer's total must come from the API, not `rows.length`.
        rowCount={employeeDebt?.pagination?.total || 0}
        rows={employeeDebt?.data || []}
      />

      {openModal && (
        <ModalFormDebt
          open={openModal}
          setOpen={setOpenModal}
          type={type}
          handleClose={() => setOpenModal(false)}
          employeeId={id}
        />
      )}
    </>
  )
}
