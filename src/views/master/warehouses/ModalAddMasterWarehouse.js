// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Styles Import
import 'react-credit-cards/es/styles-compiled.css'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { IconButton } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { addMasterDataWarehouse, editMasterDataWarehouse } from 'src/store/apps/master/warehouse'

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

export default function ModalAddMasterWarehouse({ open, setOpen, typeModal, id }) {
  const dispatch = useDispatch()
  const { defaultValue, detail: detailType } = useSelector(state => state.warehouse)

  // SHCEMA YUP VALIDATION
  const schema = yup.object().shape({
    name: yup.string().required('Nama gudang harus diisi')
  })
  // REACT FORM
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    values: typeModal === 'ADD' ? defaultValue : detailType,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  // ON SUBMIT
  const onSubmit = data => {
    if (typeModal === 'ADD') {
      dispatch(addMasterDataWarehouse(data))
    } else {
      dispatch(editMasterDataWarehouse({ id, data }))
    }
    setOpen(false)
  }

  // CLOSE MODAL AND RESET FORM
  const handleClose = () => {
    setOpen(false)
  }

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
                {typeModal === 'ADD' ? 'Tambahkan Gudang Baru' : typeModal === 'VIEW' ? 'Detail Gudang' : 'Ubah Gudang'}
              </Typography>
            </Box>
            <Grid container spacing={6}>
              <Grid item xs={12}>
                <Grid container spacing={6}>
                  <Grid item xs={12} sm={12}>
                    <Controller
                      name='name'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          value={value}
                          label='Nama Gudang'
                          placeholder=''
                          onChange={onChange}
                          disabled={typeModal === 'VIEW'}
                          error={Boolean(errors.name)}
                          aria-describedby='validation-schema-name'
                          {...(errors.name && { helperText: errors.name.message })}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <Controller
                      name='location'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          value={value}
                          label='Lokasi'
                          placeholder=''
                          onChange={onChange}
                          disabled={typeModal === 'VIEW'}
                          error={Boolean(errors.location)}
                          aria-describedby='validation-schema-location'
                          {...(errors.location && { helperText: errors.location.message })}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions
            sx={{
              // justifyContent: 'center',
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
