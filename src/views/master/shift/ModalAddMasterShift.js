// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Third Party Imports
import { useDispatch, useSelector } from 'react-redux'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

// ** Store
import { addMasterDataShift, editMasterDataShift } from 'src/store/apps/master/shift'

// ** Shared Components
import AppModal from 'src/views/common/AppModal'

export default function ModalAddMasterShift({ open, setOpen, typeModal, id }) {
  const dispatch = useDispatch()
  const { defaultValue, detail: detailShift, loadingAdd, loadingEdit } = useSelector(state => state.shift)

  // SCHEMA YUP VALIDATION
  const schema = yup.object({
    name: yup.string().required('Nama shift harus diisi'),
    startShift: yup
      .string()
      .required('Jam mulai shift harus diisi')
      .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format jam mulai tidak valid (HH:MM)'),
    endShift: yup
      .string()
      .required('Jam selesai shift harus diisi')
      .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format jam selesai tidak valid (HH:MM)')
  })

  // REACT FORM
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    values: typeModal === 'ADD' ? defaultValue : detailShift,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  // ON SUBMIT
  const onSubmit = data => {
    if (typeModal === 'ADD') {
      dispatch(addMasterDataShift(data))
    } else {
      dispatch(editMasterDataShift({ id, data }))
    }
    setOpen(false)
  }

  return (
    <AppModal
      open={open}
      onClose={() => setOpen(false)}
      onSubmit={handleSubmit(onSubmit)}
      title={typeModal === 'ADD' ? 'Tambah Shift Baru' : typeModal === 'VIEW' ? 'Detail Shift' : 'Ubah Shift'}
      size='sm'
      showActions={typeModal !== 'VIEW'}
      loading={typeModal === 'ADD' ? loadingAdd : loadingEdit}
    >
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Controller
            name='name'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                value={value}
                label='Nama'
                placeholder='Contoh: Shift Pagi'
                onChange={onChange}
                disabled={typeModal === 'VIEW'}
                error={Boolean(errors.name)}
                aria-describedby='validation-schema-name'
                {...(errors.name && { helperText: errors.name.message })}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name='startShift'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                value={value}
                label='Jam Mulai'
                placeholder='08:00'
                onChange={onChange}
                disabled={typeModal === 'VIEW'}
                error={Boolean(errors.startShift)}
                aria-describedby='validation-schema-startShift'
                {...(errors.startShift && { helperText: errors.startShift.message })}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name='endShift'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                value={value}
                label='Jam Selesai'
                placeholder='17:00'
                onChange={onChange}
                disabled={typeModal === 'VIEW'}
                error={Boolean(errors.endShift)}
                aria-describedby='validation-schema-endShift'
                {...(errors.endShift && { helperText: errors.endShift.message })}
              />
            )}
          />
        </Grid>
      </Grid>
    </AppModal>
  )
}
