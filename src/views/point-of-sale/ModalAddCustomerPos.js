import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

// ** Third Party Imports
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store & Hooks
import { addMasterDataCustomerPos, fetchCustomerPos } from 'src/store/apps/pos'
import { useDebounce } from 'src/hooks/useDebounce'

// ** Components
import AppModal from 'src/views/common/AppModal'
import TableToolbar from 'src/views/common/TableToolbar'
import { actionButtonSx } from 'src/views/common/actionButtonSx'
import TableCustomerPos from './TableCustomerPos'
import FormAddCustomerPos from './FormAddCustomerPos'

// ** Design Tokens
import { colors, shadows } from 'src/configs/designTokens'

export default function ModalAddCustomerPos({ open, setOpen, data, setSelectedCustomerPos, selectedCustomer }) {
  const dispatch = useDispatch()

  const { listCustomerPos: listDataCustomer, loadingListCustomerPos } = useSelector(state => state.pos)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 })

  const [listDataCustomerPos, setListDataCustomerPos] = useState([])
  const [searchText, setSearchText] = useState('')
  const debouncedSearch = useDebounce(searchText, 200)

  const [newCustomerField, setNewCustomerField] = useState(false)

  const handleClose = () => {
    setOpen(false)
  }

  const handleAddNewCustomer = () => {
    setNewCustomerField(true)
  }

  const handleSearch = searchValue => {
    setSearchText(searchValue)
  }

  // SHCEMA YUP VALIDATION
  const schema = yup.object().shape({
    name: yup.string().required('Nama customer harus diisi'),
    // phoneNumber: yup.string().required('Nomor telepon harus diisi'),
    // address: yup.string().optional(),
    // email: yup.string().email('Masukkan email yang valid').optional(),
    // description: yup.string().optional(),
    // gender: yup.string().required('Jenis kelamin harus diisi'),
    // notes: yup.string().optional(),
    rankId: yup.number().required('Rank harus dipilih')
  })

  // FORM FOR CUSTOMER
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    values: {
      name: '',
      rankId: 1 // default value at prod is Level 1
    },
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const handleSaveNewCustomerPos = data => {
    dispatch(addMasterDataCustomerPos({ data, setOpen, setSelectedCustomerPos }))
  }

  const handleRemoveCustomer = () => {
    setSelectedCustomerPos({})
    handleClose()
  }

  useEffect(() => {
    dispatch(
      fetchCustomerPos({
        page: paginationModel.page + 1,
        pageSize: paginationModel.pageSize,
        name: debouncedSearch
      })
    )
  }, [paginationModel, debouncedSearch])

  useEffect(() => {
    setListDataCustomerPos(listDataCustomer)
  }, [listDataCustomer])

  return (
    <AppModal
      open={open}
      // Closing stays explicit (X / buttons): a stray backdrop click or Escape must not drop the form.
      onClose={(event, reason) => {
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') return
        handleClose()
      }}
      // The search box lives inside AppModal's <form>; Enter must not submit it natively.
      onSubmit={event => event.preventDefault()}
      title={newCustomerField ? 'Add New Customer' : 'Please Choose Customer'}
      size='md'
      showActions={false}
    >
      {newCustomerField ? (
        <>
          <FormAddCustomerPos open={newCustomerField} setOpen={setNewCustomerField} control={control} errors={errors} />
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 4 }}>
            <Button
              variant='outlined'
              color='secondary'
              onClick={() => setNewCustomerField(false)}
              startIcon={<Icon icon='tabler:x' fontSize='1rem' />}
              sx={{ ...actionButtonSx, color: colors.foreground, borderColor: colors.border3, boxShadow: shadows.xs }}
            >
              Cancel
            </Button>
            <Button
              variant='contained'
              onClick={handleSubmit(handleSaveNewCustomerPos)}
              startIcon={<Icon icon='tabler:device-floppy' fontSize='1rem' />}
              sx={actionButtonSx}
            >
              Save
            </Button>
          </Box>
        </>
      ) : (
        <TableCustomerPos
          dataCustomer={listDataCustomerPos}
          setSelectedCustomerPos={setSelectedCustomerPos}
          setOpen={setOpen}
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
          loading={loadingListCustomerPos}
          toolbar={
            <TableToolbar
              value={searchText}
              placeholder='Cari customer'
              onChange={e => handleSearch(e.target.value)}
              clearSearch={() => handleSearch('')}
              actions={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                  {selectedCustomer?.id && (
                    <Button
                      variant='outlined'
                      color='secondary'
                      onClick={handleRemoveCustomer}
                      sx={{
                        color: colors.foreground,
                        borderColor: colors.border3,
                        boxShadow: shadows.xs,
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Remove Customer
                    </Button>
                  )}
                  <Button
                    variant='contained'
                    onClick={handleAddNewCustomer}
                    startIcon={<Icon icon='tabler:plus' fontSize='1rem' />}
                    sx={{ whiteSpace: 'nowrap' }}
                  >
                    Tambah Customer
                  </Button>
                </Box>
              }
            />
          }
        />
      )}
    </AppModal>
  )
}
