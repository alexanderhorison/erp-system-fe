// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CustomChip from 'src/@core/components/mui/chip'
import Grid from '@mui/material/Grid'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'
import { useDispatch, useSelector } from 'react-redux'
import { Controller, useForm } from 'react-hook-form'

import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { IconButton, MenuItem } from '@mui/material'
import { addRole } from 'src/store/apps/role'
import { Icon } from '@iconify/react'
import BaseModal from 'src/views/common/BaseModal'
import { showErrors } from '../user/TableHeader'

const schema = yup.object().shape({
  name: yup
    .string()
    .min(3, obj => showErrors('Nama Otoritas', obj.value.length, obj.min))
    .required(),
  description: yup.string().optional(),
  menuId: yup.array().of(yup.number().integer()).min(1, 'Pilih minimal 1 menu').required('Pilih minimal 1 menu')
})

const defaultValues = {
  name: '',
  description: '',
  menuId: []
}

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

const TableHeader = props => {
  // ** Props
  const { value, handleFilter, clearFilter } = props
  const dispatch = useDispatch()

  // ** State
  const [open, setOpen] = useState(false)
  const [inputMenu, setInputMenu] = useState([])

  const handleDialogToggle = () => {
    setOpen(!open)
    reset()
    setInputMenu([])
  }

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
    defaultValues: defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const onSubmit = (data, e) => {
    e.preventDefault()
    dispatch(addRole({ ...data }))
    setOpen(false)
    reset()
  }

  return (
    <>
      <Box
        sx={{ p: 5, pb: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center'
          }}
        >
          <CustomTextField
            value={value}
            // sx={{ mr: 4, mb: 2 }}
            placeholder='Cari Otoritas'
            onChange={e => handleFilter(e.target.value)}
            InputProps={{
              startAdornment: (
                <Box sx={{ mr: 4, display: 'flex' }}>
                  <Icon fontSize='1.25rem' icon='tabler:search' />
                </Box>
              ),
              endAdornment: (
                <IconButton size='small' title='Clear' aria-label='Clear' onClick={clearFilter}>
                  <Icon fontSize='1.25rem' icon='tabler:x' />
                </IconButton>
              )
            }}
            sx={{
              width: {
                xs: 1,
                sm: 'auto'
              },
              '& .MuiInputBase-root > svg': {
                mr: 2
              }
            }}
          />
        </Box>
        <Button sx={{ mb: 2, '& svg': { mr: 2 } }} variant='contained' onClick={handleDialogToggle}>
          <Icon icon='tabler:plus' fontSize='1.125rem' />
          Tambah Otoritas
        </Button>
      </Box>
      <BaseModal
        open={open}
        onClose={handleDialogToggle}
        onSubmit={handleSubmit(onSubmit)}
        title={'Tambah Otoritas Baru'}
        size="sm"
        showActions={true}
      >
        <Grid container spacing={6}>
          <Grid item xs={12}>
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
                  name='menuId'
                  control={control}
                  rules={{ required: false }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      select
                      fullWidth
                      label='List Menu'
                      id='select-multiple-chip'
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
                      sx={{ mb: 4 }}
                      label='Deskripsi Otoritas'
                      onChange={onChange}
                      rows={3}
                      multiline
                      placeholder='Otoritas untuk manage data user'
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </BaseModal>
    </>
  )
}

export default TableHeader
