import { Dialog, DialogContent, Box, Typography, Button, Grid, MenuItem, DialogActions } from '@mui/material'
import CustomTextField from 'src/@core/components/mui/text-field'
import { Transition } from '../user/modalUserEdit'
import { useDispatch, useSelector } from 'react-redux'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { CustomCloseButton } from 'src/views/pages/dialog-examples/DialogEditUserInfo'
import Icon from 'src/@core/components/icon'
import { editRole } from 'src/store/apps/role'
import { showErrors } from '../user/modalUserAdd'
import { useEffect, useState } from 'react'
import CustomChip from 'src/@core/components/mui/chip'

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
  description: '',
  menuId: []
}

const schema = yup.object().shape({
  name: yup
    .string()
    .min(3, obj => showErrors('Nama Role', obj.value.length, obj.min))
    .required(),
  description: yup.string().optional(),
  menuId: yup.array().of(yup.number().integer()).min(1, 'Pilih minimal 1 menu').required('Pilih minimal 1 menu')
})

export default function ModalRoleEdit({ data, isOpen, closePress, isView }) {
  //   const [roles, setRoles] = useState([])
  const dispatch = useDispatch()
  const [inputMenu, setInputMenu] = useState([])

  const menus = useSelector(state => state.menu.dataMenus)

  const handleChange = event => {
    let menuId = event.target.value.map(data => data.menuId)
    setInputMenu(event.target.value)
    setValue('menuId', menuId, { shouldValidate: true, shouldDirty: true })
  }

  const {
    reset,
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: defaultValue,
    values: data,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const onSubmitEdit = (data, e) => {
    e.preventDefault()
    dispatch(editRole(data))
    closePress()
    reset()
  }

  useEffect(() => {
    if (data?.menuId) {
      let dataMenu = []
      let idMenu = []
      data?.menuId.forEach(menuId => {
        const menu = menus.find(menu => menu.menuId === menuId)
        if (menu) {
          dataMenu.push(menu)
          idMenu.push(menu.menuId)
        }
      })
      setValue('menuId', idMenu, { shouldValidate: true, shouldDirty: true })
      setInputMenu(dataMenu)
    }
  }, [menus, data, setValue])

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
            <Grid container spacing={3}>
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
                  name='menuId'
                  control={control}
                  rules={{ required: false }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      select
                      fullWidth
                      label='List Menu'
                      id='select-multiple-chip'
                      sx={{ mb: 2 }}
                      error={Boolean(errors.menuId)}
                      {...(errors.menuId && { helperText: errors.menuId.message })}
                      SelectProps={{
                        MenuProps,
                        multiple: true,
                        value: inputMenu,
                        onChange: e => handleChange(e),
                        renderValue: selected => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                            {selected.map(value => (
                              <CustomChip
                                key={value.id}
                                label={value.name}
                                sx={{ m: 0.75 }}
                                skin='light'
                                color='success'
                              />
                            ))}
                          </Box>
                        )
                      }}
                    >
                      {menus.map(menu => (
                        <MenuItem key={menu.id} value={menu}>
                          {menu.name}
                        </MenuItem>
                      ))}
                    </CustomTextField>
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
                      multiline
                      rows={3}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <DialogActions
              sx={{
                justifyContent: 'end',
                px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(0)} !important`],
                pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`],
                mt: theme => [`${theme.spacing(6)} !important`, `${theme.spacing(6)} !important`],
              }}
            >
              <Button variant='tonal' color='secondary' onClick={closePress}>
                Cancel
              </Button>
              {!isView && (
                <Button type='submit' variant='contained'>
                  Submit
                </Button>
              )}
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
