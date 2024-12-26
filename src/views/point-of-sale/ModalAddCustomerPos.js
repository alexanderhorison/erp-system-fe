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
import { addMasterDataCustomerPos } from "src/store/apps/pos";
import HandleSearch from "src/helpers/handleSearch";
import { fetchMasterDataCustomer } from "src/store/apps/master/customer";

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

export default function ModalAddCustomerPos({ open, setOpen, data, setSelectedCustomerPos }) {

  const dispatch = useDispatch()

  const { defaultValue, detail: detailCustomer } = useSelector(state => state.masterCustomer)
  const { data: listDataCustomer } = useSelector(state => state.masterCustomer)

  const [listDataCustomerPos, setListDataCustomerPos] = useState([])
  const [searchText, setSearchText] = useState('')


  const [newCustomerField, setNewCustomerField] = useState(false)

  const handleClose = () => {
    setOpen(false)
  }

  const handleAddNewCustomer = () => {
    setNewCustomerField(true)
  }

  const handleSearch = searchValue => {
    setSearchText(searchValue)
    HandleSearch({ data: listDataCustomer, keys: ["name"], searchValue, setData: setListDataCustomerPos })
  }

  // SHCEMA YUP VALIDATION
  const schema = yup.object().shape({
    // name: yup.string().required('Nama company harus diisi'),
    // phoneNumber: yup.string().required('Nomor telepon harus diisi'),
    // address: yup.string().optional(),
    // email: yup.string().email('Masukkan email yang valid').optional(),
    // description: yup.string().optional(),
    // gender: yup.string().required('Jenis kelamin harus diisi'),
    // notes: yup.string().optional(),
    // rankId: yup.number().required('Rank harus dipilih'),
  })

  // FORM FOR CUSTOMER
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    values: defaultValue,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const handleSaveNewCustomerPos = (data) => {
    dispatch(addMasterDataCustomerPos({ data, setOpen, setSelectedCustomerPos }))
  }

  useEffect(() => {
    dispatch(fetchMasterDataCustomer({}))
  }, [])

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
        onClose={handleClose}
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
            <Grid item xs={newCustomerField ? 6 : 8}>
              {
                newCustomerField ? (
                  <Button fullWidth variant='outlined' onClick={() => setNewCustomerField(false)}>Cancel</Button>
                ) : (
                  <CustomTextField
                    fullWidth
                    value={searchText}
                    placeholder={"Cari ..."}
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
                )
              }
            </Grid>
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
              <TableCustomerPos dataCustomer={listDataCustomerPos} setSelectedCustomerPos={setSelectedCustomerPos} setOpen={setOpen} />
            )
          }
        </DialogContent>
      </Dialog>
    </Card>
  )
}