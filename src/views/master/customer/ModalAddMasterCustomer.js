// ** MUI Imports
// import Box from '@mui/material/Box'
import {
  Box,
  Card,
  Grid,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
} from '@mui/material'
import { styled } from '@mui/material/styles'

// ** Styles Import
import 'react-credit-cards/es/styles-compiled.css'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { useEffect } from 'react'
import { fetchMasterDataRank } from 'src/store/apps/master/rank'
import FormSelectSimple from 'src/views/common/Form/FormSelectSimple'
import { addMasterDataCustomer, editMasterDataCustomer } from 'src/store/apps/master/customer'
import FormInputText from 'src/views/common/Form/FormInputText'

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

export default function ModalAddMasterCustomer({ open, setOpen, typeModal, id }) {
  const dispatch = useDispatch()
  const { defaultValue, detail: detailCustomer } = useSelector(state => state.masterCustomer)
  const { data: dataRank } = useSelector(state => state.masterRank)

  // SHCEMA YUP VALIDATION
  const schema = yup.object().shape({
    name: yup.string().required('Nama company harus diisi'),
    phoneNumber: yup.string().required('Nomor telepon harus diisi'),
    address: yup.string().optional(),
    email: yup.string().email('Masukkan email yang valid').optional(),
    description: yup.string().optional(),
    gender: yup.string().required('Jenis kelamin harus diisi'),
    notes: yup.string().optional(),
    rankId: yup.number().required('Rank harus dipilih'),
  })

  // REACT FORM
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    values: typeModal === 'ADD' ? defaultValue : detailCustomer,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  // ON SUBMIT
  const onSubmit = data => {
    if (typeModal === 'ADD') {
      dispatch(addMasterDataCustomer({ data, setOpen }))
    } else {
      dispatch(editMasterDataCustomer({ id, data, setOpen }))
    }
  }

  // CLOSE MODAL AND RESET FORM
  const handleClose = () => {
    setOpen(false)
  }

  useEffect(() => {
    dispatch(fetchMasterDataRank())
  }, [])

  return (
    <Card>
      <Dialog
        fullWidth
        open={open}
        maxWidth='sm'
        scroll='body'
        onClose={handleClose}
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent
            sx={{
              pb: theme => `${theme.spacing(8)} !important`,
              px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
              pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
            }}
          >
            <CustomCloseButton onClick={handleClose}>
              <Icon icon='tabler:x' fontSize='1.25rem' />
            </CustomCloseButton>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Typography variant='h3' sx={{ mb: 3 }}>
                {typeModal === 'ADD'
                  ? 'Tambahkan Customer Baru'
                  : typeModal === 'VIEW'
                    ? 'Detail Customer'
                    : 'Ubah Customer'}
              </Typography>
            </Box>
            <Grid container spacing={6}>
              <Grid item xs={12}>
                <Grid container spacing={6}>
                  <Grid item xs={12} sm={12}>
                    <FormInputText
                      label={'Name Customer'}
                      name={'name'}
                      control={control}
                      errors={errors}
                      disabled={typeModal === 'VIEW'}
                      placeholder='Masukkan Name Customer'
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <FormInputText
                      label={'Alamat Customer'}
                      name={'address'}
                      control={control}
                      errors={errors}
                      disabled={typeModal === 'VIEW'}
                      placeholder='Masukkan Alamat Customer'
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <FormInputText
                      label={'Nomor Telepon'}
                      name={'phoneNumber'}
                      control={control}
                      errors={errors}
                      disabled={typeModal === 'VIEW'}
                      placeholder='Masukkan Nomor Telepon'
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <FormInputText
                      label={'Email'}
                      name={'email'}
                      control={control}
                      errors={errors}
                      disabled={typeModal === 'VIEW'}
                      placeholder='Masukkan Email'
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <FormSelectSimple
                      label={'Pilih Jenis Kelamin'}
                      control={control}
                      errors={errors}
                      disabled={typeModal === 'VIEW'}
                      data={[
                        { value: "Laki-laki", name: 'Laki-laki' },
                        { value: "Perempuan", name: 'Perempuan' },
                        { value: "Lainnya", name: 'Lainnya' }
                      ]}
                      name={'gender'}
                      optionsValue={'value'}
                      optionsLabel={'name'}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <FormSelectSimple
                      label={'Pilih Rank'}
                      control={control}
                      errors={errors}
                      disabled={typeModal === 'VIEW'}
                      data={dataRank}
                      name={'rankId'}
                      optionsValue={'id'}
                      optionsLabel={'name'}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <FormInputText
                      label={'Catatan'}
                      name={'notes'}
                      control={control}
                      errors={errors}
                      disabled={typeModal === 'VIEW'}
                      placeholder='Masukkan Catatan'
                      multiline={true}
                      rows={4}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions
            sx={{
              justifyContent: 'end',
              px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
              pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
            }}
          >
            {typeModal !== 'VIEW' && (
              <>
                <Button variant='tonal' color='secondary' onClick={handleClose} hidden={typeModal === 'VIEW'}>
                  Cancel
                </Button>
                <Button type='submit' variant='contained' hidden={typeModal === 'VIEW'}>
                  Submit
                </Button>
              </>
            )}
          </DialogActions>
        </form>
      </Dialog>
    </Card>
  )
}
