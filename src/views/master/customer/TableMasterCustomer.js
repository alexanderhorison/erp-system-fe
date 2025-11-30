import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Box, Card, IconButton, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import Icon from 'src/@core/components/icon'

import HandleSearh from 'src/helpers/handleSearch'

import {
  deleteMasterDataCustomer,
  fetchMasterDataCustomer,
  fetchMasterDataCustomerDetail
} from 'src/store/apps/master/customer'
import ModalAddMasterCustomer from './ModalAddMasterCustomer'
import TableHeaderMasterCustomer from './TableHeaderMasterCustomer'
import { useRouter } from 'next/router'

const RowOptions = ({ id, name, router }) => {
  const dispatch = useDispatch()
  const [openModalEdit, setOpenModalEdit] = useState(false)
  const [openModalView, setOpenModalView] = useState(false)

  const handleDelete = () => {
    dispatch(deleteMasterDataCustomer({ id, name }))
  }

  const handleEdit = () => {
    dispatch(fetchMasterDataCustomerDetail(id))
    setOpenModalEdit(true)
  }

  const handleView = () => {
    router.push(`/master/customer/${id}`)
  }

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={handleView}>
          <Icon icon='tabler:eye' />
        </IconButton>
        <IconButton onClick={handleEdit}>
          <Icon icon='tabler:edit' />
        </IconButton>
        <IconButton onClick={handleDelete}>
          <Icon icon='tabler:trash' />
        </IconButton>
      </Box>
      {openModalEdit && (
        <ModalAddMasterCustomer open={openModalEdit} setOpen={setOpenModalEdit} typeModal={'EDIT'} id={id} />
      )}
      {openModalView && (
        <ModalAddMasterCustomer open={openModalView} setOpen={setOpenModalView} typeModal={'VIEW'} id={id} />
      )}
    </>
  )
}

export default function TableMasterCustomer({}) {
  const dispatch = useDispatch()
  const router = useRouter()
  const [openModalAdd, setOpenModalAdd] = useState(false)

  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 100 })

  const { data } = useSelector(state => state.masterCustomer)

  const handleSearch = searchValue => {
    setSearchText(searchValue)
    HandleSearh({ data, keys: ['name'], searchValue, setData: setFilteredData })
  }

  useEffect(() => {
    dispatch(fetchMasterDataCustomer())
  }, [dispatch])

  useEffect(() => {
    setFilteredData(data)
  }, [data])

  return (
    <Card>
      {openModalAdd && <ModalAddMasterCustomer open={openModalAdd} setOpen={setOpenModalAdd} typeModal={'ADD'} />}
      <DataGrid
        autoHeight
        columns={[
          {
            flex: 0.02,
            minWidth: 50,
            field: 'id',
            headerName: 'Id',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.id}
                </Typography>
              )
            }
          },
          {
            flex: 0.12,
            minWidth: 100,
            field: 'name',
            headerName: 'Nama Customer',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.name}
                </Typography>
              )
            }
          },
          {
            flex: 0.15,
            minWidth: 140,
            field: 'contact',
            headerName: 'Email / Nomor Telepon',
            renderCell: params => {
              const email = params?.row?.email || ''
              const phoneNumber = params?.row?.phoneNumber || ''

              // Jika keduanya kosong, tampilkan -
              if (!email && !phoneNumber) {
                return (
                  <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                    -
                  </Typography>
                )
              }

              // Jika hanya salah satu yang ada, tampilkan yang ada saja
              if (email && !phoneNumber) {
                return (
                  <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {email}
                  </Typography>
                )
              }

              if (!email && phoneNumber) {
                return (
                  <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {phoneNumber}
                  </Typography>
                )
              }

              // Jika keduanya ada, tampilkan email di atas dan nomor telepon di bawah
              return (
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant='body2' sx={{ color: 'text.primary', fontSize: '0.8rem', opacity: 0.9 }}>
                    {email}
                  </Typography>
                  <Typography variant='body2' sx={{ color: 'text.secondary', fontSize: '0.8rem', opacity: 0.8 }}>
                    {phoneNumber}
                  </Typography>
                </Box>
              )
            }
          },
          {
            flex: 0.05,
            minWidth: 80,
            field: 'isPosCustomer',
            headerName: 'Tipe',
            renderCell: params => {
              const isPosCustomer = params?.row?.isPosCustomer
              return (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                  {isPosCustomer && (
                    <Typography variant='body2' sx={{ color: 'text.primary' }}>
                      POS
                    </Typography>
                  )}
                </Box>
              )
            }
          },
          {
            flex: 0.07,
            minWidth: 100,
            field: 'rankName',
            headerName: 'Rank',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.rankName}
                </Typography>
              )
            }
          },
          {
            flex: 0.15,
            minWidth: 120,
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
            field: 'actions',
            headerName: 'Actions',
            renderCell: ({ row }) => (
              <div onClick={e => e.stopPropagation()}>
                <RowOptions id={row.id} name={row.name} router={router} />
              </div>
            )
          }
        ]}
        pageSizeOptions={[5, 10, 25, 50]}
        paginationModel={paginationModel}
        onRowClick={params => {
          router.push(`/master/customer/${params.id}`)
        }}
        slots={{ toolbar: TableHeaderMasterCustomer }}
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
            placeholder: 'Cari nama customer',
            clearSearch: () => handleSearch(''),
            onChange: event => handleSearch(event.target.value),
            openModalAdd: setOpenModalAdd
          }
        }}
      />
    </Card>
  )
}
