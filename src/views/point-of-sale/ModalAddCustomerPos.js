import { Button, Card, Dialog, DialogContent, Grid, IconButton, Typography } from "@mui/material";
import { Box } from "@mui/system";
import Icon from 'src/@core/components/icon'
import { styled } from '@mui/material/styles'
import TableCustomerPos from "./TableCustomerPos";
import CustomTextField from "src/@core/components/mui/text-field";
import { useEffect, useState } from "react";
import FormAddCustomerPos from "./FormAddCustomerPos";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup'
import { addMasterDataCustomerPos, fetchCustomerPos } from "src/store/apps/pos";
import { useDebounce } from "src/hooks/useDebounce";

const CustomCloseButton = styled(IconButton)(({ theme }) => ({
  top: 0,
  right: 0,
  color: 'grey.500',
  position: 'absolute',
  boxShadow: theme.shadows[2],
  transform: 'translate(10px, -10px)',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: `${theme.palette.background.paper} !important`,
  transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
  '&:hover': {
    transform: 'translate(7px, -5px)'
  }
}))

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
    rankId: yup.number().required('Rank harus dipilih'),
  })

  // FORM FOR CUSTOMER
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    values: {
      name: '',
      rankId: 1, // default value at prod is Level 1
    },
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const handleSaveNewCustomerPos = (data) => {
    dispatch(addMasterDataCustomerPos({ data, setOpen, setSelectedCustomerPos }))
  }

  const handleRemoveCustomer = () => {
    setSelectedCustomerPos({})
    handleClose()
  }

  useEffect(() => {
    dispatch(fetchCustomerPos({
      page: paginationModel.page + 1,
      pageSize: paginationModel.pageSize,
      name: debouncedSearch
    }))
  }, [paginationModel, debouncedSearch])

  useEffect(() => {
    setListDataCustomerPos(listDataCustomer)
  }, [listDataCustomer])

  return (
    <Card>
      <Dialog
        fullWidth
        open={open}
        maxWidth='md'
        scroll='body'
        // Prevent closing modal when clicking outside (backdrop) or pressing Escape
        onClose={(event, reason) => {
          if (reason === 'backdropClick' || reason === 'escapeKeyDown') return
          handleClose()
        }}
        disableEscapeKeyDown
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' }, zoom: 1 }}
      >
        <DialogContent
          sx={{
            height: "85vh"
          }}
        >
          <CustomCloseButton onClick={handleClose}>
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </CustomCloseButton>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant='h4' sx={{}}>
              {
                newCustomerField ? 'Add New Customer' : 'Please Choose Customer'
              }
            </Typography>
          </Box>
          <Grid container py={3} spacing={4}>
            <Grid item xs={newCustomerField ? 6 : !selectedCustomer?.id ? 8 : 4}>
              {newCustomerField ? (
                <Button fullWidth variant='outlined' onClick={() => setNewCustomerField(false)}>
                  Cancel
                </Button>
              ) : (
                <CustomTextField
                  fullWidth
                  value={searchText}
                  placeholder={'Cari ...'}
                  onChange={e => handleSearch(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <Box sx={{ mr: 4, display: 'flex' }}>
                        <Icon fontSize='1.25rem' icon='tabler:search' />
                      </Box>
                    ),
                    endAdornment: (
                      <IconButton size='small' title='Clear' aria-label='Clear' onClick={() => { }}>
                        <Icon fontSize='1.25rem' icon='tabler:x' />
                      </IconButton>
                    )
                  }}
                  sx={{
                    '& .MuiInputBase-root > svg': {
                      mr: 2
                    }
                  }}
                />
              )}
            </Grid>
            {selectedCustomer?.id && !newCustomerField && (
              <Grid item xs={4}>
                {
                  <Button fullWidth variant='contained' onClick={handleRemoveCustomer}>
                    Remove Customer
                  </Button>
                }
              </Grid>
            )}
            <Grid item xs={newCustomerField ? 6 : 4}>
              {
                newCustomerField ? (
                  <Button fullWidth variant='contained' onClick={handleSubmit(handleSaveNewCustomerPos)}>Save</Button>
                ) : (
                  <Button fullWidth variant='contained' onClick={() => handleAddNewCustomer()}>Add New Customer</Button>
                )
              }
            </Grid>
          </Grid>
          {
            newCustomerField ? (
              <FormAddCustomerPos
                open={newCustomerField}
                setOpen={setNewCustomerField}
                control={control}
                errors={errors}
              />
            ) : (
              <TableCustomerPos
                dataCustomer={listDataCustomerPos}
                setSelectedCustomerPos={setSelectedCustomerPos}
                setOpen={setOpen}
                paginationModel={paginationModel}
                setPaginationModel={setPaginationModel}
                loading={loadingListCustomerPos}
              />
            )
          }
        </DialogContent>
      </Dialog>
    </Card>
  )
}