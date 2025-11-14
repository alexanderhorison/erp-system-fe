import { Card, Grid, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import HandleSearch from 'src/helpers/handleSearch'
import { fetchAllPrinter, fetchPrinterHealthCheck } from 'src/store/apps/config/configPrinter'
import ModalAddPrinter from 'src/views/settings/printer/ModalAddPrinter'
import TableHeaderPrinter from 'src/views/settings/printer/TableHeaderPrinter'
import TablePrinter from 'src/views/settings/printer/TablePrinter'

export default function SettingPrinter({}) {
  // ** Hooks
  const dispatch = useDispatch()

  const { listPrinter, printerHealthStatus, loadingPrinterHealth } = useSelector(state => state.printer)

  const [filterData, setFilterData] = useState([])
  const [searchText, setSearchText] = useState('')

  const [openModalAdd, setOpenModalAdd] = useState(false)
  const [openModalEdit, setOpenModalEdit] = useState(false)
  const [openModalView, setOpenModalView] = useState(false)

  const handleAdd = () => {
    setOpenModalAdd(true)
  }

  const handleCheckPrinter = () => {
    // Force refresh health check
    dispatch(fetchPrinterHealthCheck())
  }

  const handleSearch = e => {
    setSearchText(e.target.value)
    HandleSearch({
      data: listPrinter,
      keys: ['value'],
      searchValue: e.target.value,
      setData: setFilterData
    })
  }

  const handleClear = () => {
    setSearchText('')
    setFilterData(listPrinter)
  }

  useEffect(() => {
    dispatch(
      fetchAllPrinter({
        query: {
          category: 'PRINTER'
        }
      })
    )
    // Fetch printer health check only if not already fetched
    if (!printerHealthStatus || printerHealthStatus.length === 0) {
      dispatch(fetchPrinterHealthCheck())
    }
  }, [dispatch])

  useEffect(() => {
    setFilterData(listPrinter)
  }, [listPrinter])

  return (
    <Grid container spacing={6}>
      {openModalAdd && <ModalAddPrinter open={openModalAdd} setOpen={setOpenModalAdd} typeModal='ADD' />}

      {openModalEdit && <ModalAddPrinter open={openModalEdit} setOpen={setOpenModalEdit} typeModal='EDIT' />}

      {openModalView && <ModalAddPrinter open={openModalView} setOpen={setOpenModalView} typeModal='VIEW' />}

      <Grid item xs={12}>
        <Typography paddingY={3} fontSize={20}>
          Daftar Printer
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <TableHeaderPrinter
            clearSearch={handleClear}
            value={searchText}
            onChange={handleSearch}
            handleAdd={handleAdd}
            handleCheckPrinter={handleCheckPrinter}
            loadingCheck={loadingPrinterHealth}
          />
          <TablePrinter
            filterData={filterData}
            printerHealthStatus={printerHealthStatus}
            setOpenModalAdd={setOpenModalAdd}
            setOpenModalEdit={setOpenModalEdit}
            setOpenModalView={setOpenModalView}
          />
        </Card>
      </Grid>
    </Grid>
  )
}
