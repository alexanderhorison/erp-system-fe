import { Box, Button, Card, Dialog, DialogActions, DialogContent, Grid, Typography } from '@mui/material'
import { CustomCloseButton } from '../pages/dialog-examples/DialogEditUserInfo'
import Icon from 'src/@core/components/icon'
import { useForm } from 'react-hook-form'
import FormInputText from '../common/Form/FormInputText'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Stack } from '@mui/system'
import { useDispatch } from 'react-redux'
import { sendEmailPos } from 'src/store/apps/pos'

export default function ModalSendEmailCustomer({ open, setOpen, customer, code }) {
  const dispatch = useDispatch()

  const schema = yup.object().shape({
    email: yup.string().email().required('Email harus diisi')
  })

  // REACT FORM
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    values: {
      email: customer.email || ''
    },
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  // ON SUBMIT
  const onSubmit = val => {
    // Send Email
    const formData = new FormData()
    formData.append('email', val.email)
    formData.append('module', 'Point of Sale')
    formData.append('filename', code)
    dispatch(sendEmailPos(formData))
    setOpen(false)
  }

  return (
    <>
      <Card>
        <Dialog
          fullWidth
          open={open}
          maxWidth='xs'
          scroll='body'
          onClose={() => setOpen(false)}
          disableEnforceFocus
          sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogContent>
              <CustomCloseButton onClick={() => setOpen(false)}>
                <Icon icon='tabler:x' fontSize='1.25rem' />
              </CustomCloseButton>
              <Grid container spacing={2} mt={0.5}>
                <Grid item xs={12}>
                  <FormInputText
                    label={'Email'}
                    name={'email'}
                    control={control}
                    errors={errors}
                    placeholder='Masukkan Email'
                  />
                </Grid>
                <Grid item xs={12}>
                  <Stack direction='row' spacing={1} alignItems={'center'} justifyContent={'right'}>
                    <Button variant='contained' onClick={() => setOpen(false)}>
                      Batal
                    </Button>
                    <Button variant='contained' type='submit'>
                      Kirim Email
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </DialogContent>
          </form>
        </Dialog>
      </Card>
    </>
  )
}
