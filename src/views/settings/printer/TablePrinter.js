import { IconButton, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch } from "react-redux";
import Icon from 'src/@core/components/icon'
import { swalConfirmationOnly } from "src/helpers/swalFunctionPos";
import { fetchDeletePrinter, fetchDetailPrinter } from "src/store/apps/config/configPrinter";

const RowOptions = ({ id, name, setOpenModalEdit, setOpenModalView }) => {
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
    </>
  )
}

export default function TablePrinter({
  filterData,
  setOpenModalEdit,
  setOpenModalView,
}) {

  return (
    <DataGrid
      autoHeight
      rows={filterData}
      columns={[
        {
          flex: 0.1,
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
          renderCell: ({ row }) => <Typography sx={{ color: 'text.secondary' }}>{row?.value_json.ip}</Typography>
        },
        {
          flex: 0.1,
          field: 'hostname',
          minWidth: 100,
          headerName: 'Host Name',
          renderCell: ({ row }) => <Typography sx={{ color: 'text.secondary' }}>{row?.value_json.hostname}</Typography>
        },
        {
          flex: 0.1,
          // minWidth: 120,
          sortable: false,
          field: 'actions',
          headerName: 'Actions',
          renderCell: ({ row }) => <RowOptions id={row.id} name={row?.value} setOpenModalEdit={setOpenModalEdit} setOpenModalView={setOpenModalView} />
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