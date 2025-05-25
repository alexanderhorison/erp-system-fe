import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Box, IconButton, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import Icon from 'src/@core/components/icon'

import {
  deleteEmployeeDebt,
  fetchEmployeeDebt,
} from 'src/store/apps/master/employee'
import ModalAddMasterEmployee from './ModalAddMasterEmployee'
import { useRouter } from 'next/router'
import { priceFormatWIthCurrency } from 'src/helpers/priceFormatter'
import TableHeaderDebtEmployee from './TableHeaderDebtEmployee'
import ModalFormDebt from './ModalFormDebt'

const RowOptions = ({ id, employeeId, date, category }) => {
  const dispatch = useDispatch()
  const [openModalEdit, setOpenModalEdit] = useState(false)
  const [openModalView, setOpenModalView] = useState(false)

  const handleDelete = e => {
    e.stopPropagation()
    dispatch(deleteEmployeeDebt({ id, employeeId, date }))
  }

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {/* <IconButton onClick={handleView}>
          <Icon icon='tabler:eye' />
        </IconButton> */}
        {/* <IconButton onClick={handleEdit}>
          <Icon icon='tabler:edit' />
        </IconButton> */}
        {
          category !== 'DAILY COST' && (
            <IconButton onClick={handleDelete}>
              <Icon icon='tabler:trash' />
            </IconButton>
          )
        }
      </Box>
      {openModalEdit && (
        <ModalAddMasterEmployee open={openModalEdit} setOpen={setOpenModalEdit} typeModal={'EDIT'} id={id} />
      )}
      {openModalView && (
        <ModalAddMasterEmployee open={openModalView} setOpen={setOpenModalView} typeModal={'VIEW'} id={id} />
      )}
    </>
  )
}

export default function TableDebtEmployee() {
  const dispatch = useDispatch()
  const router = useRouter()
  const { id } = router.query

  const [openModal, setOpenModal] = useState(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 })
  const [type, setType] = useState('')

  const { employeeDebt, loadingEmployeeDebt } = useSelector(state => state.masterEmployee)

  const handleClick = type => {
    setType(type)
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
  }, [id, paginationModel])

  return (
    <>
      <DataGrid
        autoHeight
        loading={loadingEmployeeDebt}
        columns={[
          {
            flex: 0.08,
            minWidth: 50,
            field: 'category',
            headerName: 'Kategori',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.category || '-'}
                </Typography>
              )
            }
          },
          {
            flex: 0.08,
            minWidth: 120,
            field: 'date',
            headerName: 'Tanggal',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.date ? new Date(params.row.date).toLocaleDateString('id-ID') : '-'}
                </Typography>
              )
            }
          },
          {
            flex: 0.1,
            minWidth: 120,
            field: 'amount',
            headerName: 'Jumlah',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.amount ? priceFormatWIthCurrency(params.row.amount) : '-'}
                </Typography>
              )
            }
          },
          {
            flex: 0.1,
            minWidth: 120,
            field: 'type',
            headerName: 'Tipe',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.type}
                </Typography>
              )
            }
          },
          {
            flex: 0.1,
            minWidth: 120,
            field: 'notes',
            headerName: 'Notes',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.notes}
                </Typography>
              )
            }
          },
          {
            flex: 0.06,
            field: 'actions',
            headerName: 'Actions',
            renderCell: ({ row }) => <RowOptions id={row.id} employeeId={id} date={row.date} category={row.category} />
          }
        ]}
        pageSizeOptions={[5, 10]}
        paginationModel={paginationModel}
        paginationMode='server'
        rowCount={employeeDebt?.pagination?.total || 0}
        // onRowClick={handleRowClick}
        slots={{ toolbar: TableHeaderDebtEmployee }}
        onPaginationModelChange={setPaginationModel}
        rows={employeeDebt?.data || []}
        sx={{
          '& .MuiSvgIcon-root': {
            fontSize: '1.125rem'
          }
        }}
        slotProps={{
          baseButton: {
            size: 'small',
            variant: 'outlined'
          },
          toolbar: {
            handleClick: handleClick
          }
        }}
      />
      {openModal && (
        <ModalFormDebt open={openModal} setOpen={setOpenModal} type={type} handleClose={() => setOpenModal(false)} employeeId={id} />
      )}
    </>
  )
}
