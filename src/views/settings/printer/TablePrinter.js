import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import Swal from 'sweetalert2'
import Icon from 'src/@core/components/icon'
import axios from 'src/configs/axios'
import HandleSearch from 'src/helpers/handleSearch'
import { swalConfirmationOnly } from 'src/helpers/swalFunctionPos'
import {
  fetchAllPrinter,
  fetchDeletePrinter,
  fetchDetailPrinter,
  fetchPrinterHealthCheck
} from 'src/store/apps/config/configPrinter'

import ModalAddPrinter from './ModalAddPrinter'
import ModalViewPrinter from './ModalViewPrinter'

// ** Shared Components
import DataTable from 'src/views/common/DataTable'
import TableToolbar from 'src/views/common/TableToolbar'
import StatusChip from 'src/views/common/StatusChip'
import ConfirmDialog from 'src/views/common/ConfirmDialog'

const RowOptions = ({ id, name, printer, handleTestPrint, isTesting, onEdit, onView }) => {
  const dispatch = useDispatch()
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false)
  const { loadingDeletePrinter } = useSelector(state => state.printer)

  // ** Confirmation is owned by `ConfirmDialog`; the thunk performs the request
  // without prompting again (see docs/REVAMP_BASELINE.md §4).
  const handleDelete = () => {
    dispatch(fetchDeletePrinter({ id, name }))
    setOpenConfirmDelete(false)
  }

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        <Tooltip title='Test Print'>
          <IconButton onClick={() => handleTestPrint(printer)} disabled={isTesting} size='small'>
            {isTesting ? <CircularProgress size={16} /> : <Icon icon='tabler:printer' fontSize='1.125rem' />}
          </IconButton>
        </Tooltip>
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
        <Tooltip title='Hapus'>
          <IconButton onClick={() => setOpenConfirmDelete(true)} size='small' sx={{ color: 'error.main' }}>
            <Icon icon='tabler:trash' fontSize='1.125rem' />
          </IconButton>
        </Tooltip>
      </Box>

      <ConfirmDialog
        open={openConfirmDelete}
        onClose={() => setOpenConfirmDelete(false)}
        onConfirm={handleDelete}
        title='Hapus Printer'
        itemName={name}
        loading={loadingDeletePrinter}
      />
    </>
  )
}

export default function TablePrinter() {
  const dispatch = useDispatch()
  const { listPrinter, printerHealthStatus, loadingListPrinter, loadingPrinterHealth, printerDetail } = useSelector(
    state => state.printer
  )

  const [testingPrinter, setTestingPrinter] = useState({})
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 50 })

  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState([])

  const [openModalAdd, setOpenModalAdd] = useState(false)
  const [openModalEdit, setOpenModalEdit] = useState(false)
  const [openModalView, setOpenModalView] = useState(false)

  const handleSearch = searchValue => {
    setSearchText(searchValue)
    HandleSearch({ data: listPrinter, keys: ['value'], searchValue, setData: setFilteredData })
  }

  const handleCheckPrinter = () => {
    dispatch(fetchPrinterHealthCheck())
  }

  const getHealthStatus = printerIp => {
    return printerHealthStatus?.find(status => status.ip === printerIp)
  }

  const handleTestPrint = async printer => {
    const printerIp = printer?.value_json.ip || printer?.value_json.printerHost
    const printerName = printer?.value || printer?.description

    swalConfirmationOnly({
      title: 'Test Print',
      text: `Apakah anda ingin melakukan test print pada ${printerName}?`,
      autoSuccess: false,
      confirmButtonText: 'Ya, Test Print',
      showCancelButton: true,
      cancelButtonText: 'Tidak',
      onClickYes: async () => {
        setTestingPrinter(prev => ({ ...prev, [printer.id]: true }))
        try {
          await axios({
            method: 'POST',
            url: '/health-check/printer/test-print',
            data: {
              ip: printerIp,
              name: printerName
            }
          })

          Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: 'Test print berhasil dikirim ke printer',
            timer: 2000,
            showConfirmButton: false
          })
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Gagal!',
            text: error?.response?.data?.message || 'Gagal melakukan test print',
            confirmButtonText: 'OK'
          })
        } finally {
          setTestingPrinter(prev => ({ ...prev, [printer.id]: false }))
        }
      }
    })
  }

  const handleEdit = id => {
    dispatch(fetchDetailPrinter({ id }))
    setOpenModalEdit(true)
  }

  const handleView = id => {
    dispatch(fetchDetailPrinter({ id }))
    setOpenModalView(true)
  }

  useEffect(() => {
    dispatch(fetchAllPrinter({ query: { category: 'PRINTER' } }))
    // Fetch printer health check only if not already fetched
    if (!printerHealthStatus || printerHealthStatus.length === 0) {
      dispatch(fetchPrinterHealthCheck())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])

  useEffect(() => {
    setFilteredData(listPrinter)
  }, [listPrinter])

  const printerIp = printerDetail?.value_json?.ip || printerDetail?.value_json?.printerHost
  const isPrinterOnline = getHealthStatus(printerIp)?.status === 'ONLINE'

  return (
    <>
      <DataTable
        itemLabel='printer'
        loading={loadingListPrinter}
        getRowId={row => row.id}
        toolbar={
          <TableToolbar
            value={searchText}
            placeholder='Cari nama printer'
            onChange={event => handleSearch(event.target.value)}
            clearSearch={() => handleSearch('')}
            actions={
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant='outlined'
                  color='secondary'
                  onClick={handleCheckPrinter}
                  disabled={loadingPrinterHealth}
                  startIcon={<Icon icon='tabler:refresh' fontSize='1rem' />}
                >
                  {loadingPrinterHealth ? 'Mengecek...' : 'Cek Printer'}
                </Button>
                <Button
                  variant='contained'
                  onClick={() => setOpenModalAdd(true)}
                  startIcon={<Icon icon='tabler:plus' fontSize='1rem' />}
                >
                  Tambah Printer
                </Button>
              </Box>
            }
          />
        }
        columns={[
          {
            flex: 0.2,
            minWidth: 140,
            field: 'name',
            headerName: 'NAMA PRINTER',
            renderCell: ({ row }) => (
              <Typography variant='body2' sx={{ color: 'text.primary' }}>
                {row?.value}
              </Typography>
            )
          },
          {
            flex: 0.3,
            minWidth: 180,
            field: 'description',
            headerName: 'DESKRIPSI',
            renderCell: ({ row }) => (
              <Typography variant='body2' sx={{ color: 'text.primary' }}>
                {row?.description || '-'}
              </Typography>
            )
          },
          {
            flex: 0.15,
            minWidth: 130,
            field: 'ip',
            headerName: 'IP',
            renderCell: ({ row }) => (
              <Typography variant='body2' sx={{ color: 'text.primary' }}>
                {row?.value_json.ip || row?.value_json.printerHost}
              </Typography>
            )
          },
          {
            flex: 0.15,
            minWidth: 110,
            field: 'status',
            headerName: 'STATUS',
            sortable: false,
            renderCell: ({ row }) => {
              const printerIp = row?.value_json.ip || row?.value_json.printerHost
              const healthStatus = getHealthStatus(printerIp)
              const isOnline = healthStatus?.status === 'ONLINE'

              return loadingPrinterHealth ? (
                <CircularProgress size={18} />
              ) : (
                <StatusChip isActive={isOnline} activeLabel='Online' inactiveLabel='Offline' />
              )
            }
          },
          {
            flex: 0.2,
            minWidth: 160,
            sortable: false,
            field: 'actions',
            headerName: 'ACTION',
            renderCell: ({ row }) => (
              <RowOptions
                id={row.id}
                name={row?.value}
                printer={row}
                handleTestPrint={handleTestPrint}
                isTesting={testingPrinter[row.id]}
                onEdit={() => handleEdit(row.id)}
                onView={() => handleView(row.id)}
              />
            )
          }
        ]}
        pageSizeOptions={[25, 50, 100]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        rows={filteredData}
      />

      {openModalAdd && <ModalAddPrinter open={openModalAdd} setOpen={setOpenModalAdd} typeModal='ADD' />}
      {openModalEdit && <ModalAddPrinter open={openModalEdit} setOpen={setOpenModalEdit} typeModal='EDIT' />}
      <ModalViewPrinter
        open={openModalView}
        setOpen={setOpenModalView}
        selectedRow={printerDetail}
        isOnline={isPrinterOnline}
      />
    </>
  )
}
