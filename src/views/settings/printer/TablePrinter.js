import { IconButton, Typography, Chip, CircularProgress, Button } from '@mui/material'
import { Box } from '@mui/system'
import { DataGrid } from '@mui/x-data-grid'
import { useDispatch, useSelector } from 'react-redux'
import Icon from 'src/@core/components/icon'
import { swalConfirmationOnly } from 'src/helpers/swalFunctionPos'
import { fetchDeletePrinter, fetchDetailPrinter } from 'src/store/apps/config/configPrinter'
import axios from 'src/configs/axios'
import { useState } from 'react'
import Swal from 'sweetalert2'

const RowOptions = ({ id, name, printer, handleTestPrint, isTesting, setOpenModalEdit, setOpenModalView }) => {
  const dispatch = useDispatch()

  const handleDelete = () => {
    dispatch(fetchDeletePrinter({ id: id, name: name }))
  }

  const handleEdit = () => {
    dispatch(fetchDetailPrinter({ id: id }))
    setOpenModalEdit(true)
  }

  const handleView = () => {
    dispatch(fetchDetailPrinter({ id: id }))
    setOpenModalView(true)
  }

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={() => handleTestPrint(printer)} disabled={isTesting} title='Test Print'>
          {isTesting ? <CircularProgress size={20} /> : <Icon icon='tabler:printer' />}
        </IconButton>
        <IconButton onClick={handleView} title='View'>
          <Icon icon='tabler:eye' />
        </IconButton>
        <IconButton onClick={handleEdit} title='Edit'>
          <Icon icon='tabler:edit' />
        </IconButton>
        <IconButton onClick={handleDelete} title='Delete'>
          <Icon icon='tabler:trash' />
        </IconButton>
      </Box>
    </>
  )
}

export default function TablePrinter({ filterData, printerHealthStatus, setOpenModalEdit, setOpenModalView }) {
  const { loadingPrinterHealth } = useSelector(state => state.printer)
  const [testingPrinter, setTestingPrinter] = useState({})

  const getHealthStatus = printerIp => {
    const healthStatus = printerHealthStatus?.find(status => status.ip === printerIp)
    return healthStatus
  }

  const handleTestPrint = async printer => {
    const printerIp = printer?.value_json.ip || printer?.value_json.printerHost
    const printerName = printer?.value || printer?.description

    swalConfirmationOnly({
      title: 'Test Print',
      text: `Apakah anda ingin melakukan test print pada ${printerName}?`,
      confirmButtonText: 'Ya, Test Print',
      showCancelButton: true,
      cancelButtonText: 'Tidak',
      onClickYes: async () => {
        setTestingPrinter(prev => ({ ...prev, [printer.id]: true }))
        try {
          const response = await axios({
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

  return (
    <DataGrid
      autoHeight
      rows={filterData}
      columns={[
        {
          flex: 0.15,
          field: 'name',
          minWidth: 100,
          headerName: 'Nama Printer',
          renderCell: ({ row }) => <Typography sx={{ color: 'text.secondary' }}>{row?.value}</Typography>
        },
        {
          flex: 0.25,
          field: 'desctiption',
          minWidth: 100,
          headerName: 'Deskripsi',
          renderCell: ({ row }) => <Typography sx={{ color: 'text.secondary' }}>{row?.description}</Typography>
        },
        {
          flex: 0.1,
          field: 'ip',
          minWidth: 100,
          headerName: 'IP',
          renderCell: ({ row }) => (
            <Typography sx={{ color: 'text.secondary' }}>
              {row?.value_json.ip || row?.value_json.printerHost}
            </Typography>
          )
        },
        {
          flex: 0.1,
          field: 'status',
          minWidth: 120,
          headerName: 'Status',
          renderCell: ({ row }) => {
            const printerIp = row?.value_json.ip || row?.value_json.printerHost
            const healthStatus = getHealthStatus(printerIp)
            const isOnline = healthStatus?.status === 'ONLINE'
            const statusLabel = healthStatus?.status === 'ONLINE' ? 'Online' : 'Offline'
            const statusColor = isOnline ? 'success' : 'error'

            return loadingPrinterHealth ? (
              <CircularProgress size={20} />
            ) : (
              <Chip label={statusLabel} color={statusColor} size='small' />
            )
          }
        },
        {
          flex: 0.15,
          // minWidth: 120,
          sortable: false,
          field: 'actions',
          headerName: 'Actions',
          renderCell: ({ row }) => (
            <RowOptions
              id={row.id}
              name={row?.value}
              printer={row}
              handleTestPrint={handleTestPrint}
              isTesting={testingPrinter[row.id]}
              setOpenModalEdit={setOpenModalEdit}
              setOpenModalView={setOpenModalView}
            />
          )
        }
      ]}
      disableRowSelectionOnClick
      pageSizeOptions={[10, 25, 50]}
      sx={{
        '& .MuiSvgIcon-root': {
          fontSize: '1.125rem'
        }
      }}
    />
  )
}
