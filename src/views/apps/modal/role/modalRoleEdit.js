import { Dialog, DialogContent, Box, Typography, Button, Grid } from '@mui/material'
import CustomTextField from 'src/@core/components/mui/text-field'
import { Transition } from '../user/modalUserEdit'
import { useDispatch } from 'react-redux'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { showErrors } from '../../user/list/AddUserDrawer'
import { yupResolver } from '@hookform/resolvers/yup'
import { CustomCloseButton } from 'src/views/pages/dialog-examples/DialogEditUserInfo'
import Icon from 'src/@core/components/icon'
import { editRole } from 'src/store/apps/role'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8

const MenuProps = {
  PaperProps: {
    style: {
      width: 250,
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP
    }
  }
}

const defaultValue = {
  name: '',
  description: ''
}

const schema = yup.object().shape({
  name: yup
    .string()
    .min(3, obj => showErrors('Nama Role', obj.value.length, obj.min))
    .required(),
  description: yup.string().optional()
})

export default function ModalRoleEdit({ data, isOpen, closePress, isView }) {
  //   const [roles, setRoles] = useState([])
  const dispatch = useDispatch()

  //   const menus = useSelector(state => state.menu.dataMenus)

  //   const handleChange = event => {
  //     setRoles(event.target.value)
  //   }
  //   //   console.log(menus)

  //   const handleChangeMultipleNative = event => {
  //     const { options } = event.target
  //     const value = []
  //     for (let i = 0, l = options.length; i < l; i += 1) {
  //       if (options[i].selected) {
  //         value.push(options[i].value)
  //       }
  //     }
  //     setPersonNameNative(value)
  //   }

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: defaultValue,
    values: data,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const onSubmitEdit = (data, e) => {
    e.preventDefault()
    dispatch(editRole({ ...data, menuId: data.MenuId }))
    closePress()
    reset()
  }

  return (
    <>
      <Dialog
        fullWidth
        open={isOpen}
        onClose={closePress}
        maxWidth='sm'
        scroll='body'
        TransitionComponent={Transition}
        onBackdropClick={closePress}
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <DialogContent
          sx={{
            pb: theme => `${theme.spacing(8)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <CustomCloseButton onClick={closePress}>
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </CustomCloseButton>
          <Box sx={{ mb: 8, textAlign: 'center' }}>
            <Typography variant='h3' sx={{ mb: 3 }}>
              Sunting Informasi Otoritas
            </Typography>
          </Box>
          <form onSubmit={handleSubmit(onSubmitEdit)}>
            <Grid container spacing={6}>
              <Grid item xs={12}>
                <Controller
                  name='name'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      label='Nama Otoritas'
                      onChange={onChange}
                      placeholder='Administrator'
                      error={Boolean(errors.name)}
                      {...(errors.name && { helperText: errors.name.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name='description'
                  control={control}
                  rules={{ required: false }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      label='Deskripsi Otoritas'
                      onChange={onChange}
                      placeholder='akun administrator'
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', mt: 3 }}>
              <Button variant='tonal' color='secondary' onClick={closePress}>
                Cancel
              </Button>
              {!isView && (
                <Button type='submit' variant='contained' sx={{ mr: 3 }}>
                  Submit
                </Button>
              )}
            </Box>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
