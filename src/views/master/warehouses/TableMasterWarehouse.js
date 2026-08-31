import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'

import { Box, Button, Chip, IconButton, Tooltip, Typography } from '@mui/material'
import Icon from 'src/@core/components/icon'

import {
  deleteMasterDataWarehouse,
  fetchMasterDataWarehouse,
  fetchMasterDataWarehouseDetail
} from 'src/store/apps/master/warehouse'

import ModalAddMasterWarehouse from './ModalAddMasterWarehouse'
import HandleSearh from 'src/helpers/handleSearch'

// ** Shared Components
import DataTable from 'src/views/common/DataTable'
import TableToolbar from 'src/views/common/TableToolbar'
import ConfirmDialog from 'src/views/common/ConfirmDialog'

// ** Design Tokens
import { colors, radii } from 'src/configs/designTokens'

const RowOptions = ({ id, name }) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const [openModalEdit, setOpenModalEdit] = useState(false)
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false)
  const { loadingDelete } = useSelector(state => state.warehouse)

  // ** Confirmation is owned by `ConfirmDialog`; the thunk performs the request
  // without prompting again.
  const handleDelete = () => {
    dispatch(deleteMasterDataWarehouse({ name, id }))
    setOpenConfirmDelete(false)
  }

  const handleEdit = () => {
    dispatch(fetchMasterDataWarehouseDetail(id))
    setOpenModalEdit(true)
  }

  const handlePageWarehouseRack = () => {
    router.push(`/master/warehouses/${id}/warehouse-rack`)
  }

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        <Tooltip title='View Racks'>
          <IconButton onClick={handlePageWarehouseRack} size='small'>
            <Icon icon='tabler:eye' fontSize='1.125rem' />
          </IconButton>
        </Tooltip>
        <Tooltip title='Edit'>
          <IconButton onClick={handleEdit} size='small'>
            <Icon icon='tabler:edit' fontSize='1.125rem' />
          </IconButton>
        </Tooltip>
        <Tooltip title='Delete'>
          <IconButton onClick={() => setOpenConfirmDelete(true)} size='small' sx={{ color: 'error.main' }}>
            <Icon icon='tabler:trash' fontSize='1.125rem' />
          </IconButton>
        </Tooltip>
      </Box>

      <ConfirmDialog
        open={openConfirmDelete}
        onClose={() => setOpenConfirmDelete(false)}
        onConfirm={handleDelete}
        title='Delete Warehouse'
        itemName={name}
        loading={loadingDelete}
      />
      {openModalEdit && (
        <ModalAddMasterWarehouse open={openModalEdit} setOpen={setOpenModalEdit} typeModal={'EDIT'} id={id} />
      )}
    </>
  )
}

// ** Status reads as an outlined chip rather than raw text, matching the chip
// styling used elsewhere in the redesign.
const StatusChip = ({ status }) => {
  const isActive = status === 'active'

  return (
    <Chip
      size='small'
      label={isActive ? 'Active' : 'Not Active'}
      sx={{
        height: 24,
        borderRadius: `${radii.full}px`,
        border: `1px solid ${isActive ? colors.border3 : colors.border}`,
        backgroundColor: 'transparent',
        '& .MuiChip-label': {
          px: 2,
          fontSize: '0.75rem',
          lineHeight: '16px',
          color: isActive ? colors.foreground : colors.mutedForeground
        }
      }}
    />
  )
}

export default function TableMasterWarehouse({}) {
  const dispatch = useDispatch()
  const [openModalAdd, setOpenModalAdd] = useState(false)

  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 50 })

  const { data } = useSelector(state => state.warehouse)

  const handleSearch = searchValue => {
    setSearchText(searchValue)
    HandleSearh({ data, keys: ['name'], searchValue, setData: setFilteredData })
  }

  useEffect(() => {
    dispatch(fetchMasterDataWarehouse({ status: 'all' }))
  }, [dispatch])

  useEffect(() => {
    setFilteredData(data)
  }, [data])

  return (
    <>
      {openModalAdd && <ModalAddMasterWarehouse open={openModalAdd} setOpen={setOpenModalAdd} typeModal={'ADD'} />}
      <DataTable
        itemLabel='warehouses'
        toolbar={
          <TableToolbar
            value={searchText}
            placeholder='Search warehouse name'
            onChange={event => handleSearch(event.target.value)}
            clearSearch={() => handleSearch('')}
            actions={
              <Button
                variant='contained'
                onClick={() => setOpenModalAdd(true)}
                startIcon={<Icon icon='tabler:plus' fontSize='1rem' />}
              >
                Add Warehouse
              </Button>
            }
          />
        }
        columns={[
          {
            flex: 0.3,
            minWidth: 200,
            field: 'name',
            headerName: 'Warehouse Name',
            renderCell: params => (
              <Typography variant='body2' sx={{ color: 'text.primary' }}>
                {params.row.name}
              </Typography>
            )
          },
          {
            flex: 0.3,
            minWidth: 160,
            field: 'location',
            headerName: 'Location',
            renderCell: params => (
              <Typography variant='body2' sx={{ color: 'text.primary' }}>
                {params.row.location || '-'}
              </Typography>
            )
          },
          {
            flex: 0.2,
            minWidth: 120,
            field: 'status',
            headerName: 'Status',
            renderCell: params => <StatusChip status={params.row.status} />
          },
          {
            flex: 0.2,
            minWidth: 140,
            sortable: false,
            field: 'actions',
            headerName: 'Action',
            renderCell: ({ row }) => <RowOptions id={row.id} name={row.name} />
          }
        ]}
        pageSizeOptions={[25, 50, 100]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        rows={filteredData}
      />
    </>
  )
}
