// ** MUI Imports
import Grid from '@mui/material/Grid'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Third Party Imports
import { useDispatch, useSelector } from 'react-redux'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

// ** Store
import { addMasterDataCar, editMasterDataCar } from 'src/store/apps/master/car'

// ** Shared Components
import AppModal from 'src/views/common/AppModal'

export default function ModalAddMasterCar({ open, setOpen, typeModal, id }) {
  const dispatch = useDispatch()
  const { defaultValue, detail: detailCar, loadingAdd, loadingEdit } = useSelector(state => state.masterCar)

  // SCHEMA YUP VALIDATION
  const schema = yup.object().shape({
    name: yup.string().required('Nama mobil harus diisi'),
    plate_number: yup.string().required('Plat nomor harus diisi'),
    emoneyBalance: yup.string().default('0')
  })

  // REACT FORM
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    values: typeModal === 'ADD' ? defaultValue : detailCar,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  // ON SUBMIT
  const onSubmit = data => {
    if (typeModal === 'ADD') {
      dispatch(addMasterDataCar({ data: data, setOpen }))
    } else {
      dispatch(editMasterDataCar({ id, data, setOpen }))
    }
  }

  return (
    <AppModal
      open={open}
      onClose={() => setOpen(false)}
      onSubmit={handleSubmit(onSubmit)}
      title={typeModal === 'ADD' ? 'Tambah Mobil Baru' : typeModal === 'VIEW' ? 'Detail Mobil' : 'Ubah Mobil'}
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
                label='Nama Mobil'
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
        <Grid item xs={12}>
          <Controller
            name='plate_number'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                value={value}
                label='Plat Nomor'
                placeholder=''
                onChange={onChange}
                disabled={typeModal === 'VIEW'}
                error={Boolean(errors.plate_number)}
                aria-describedby='validation-schema-plate_number'
                {...(errors.plate_number && { helperText: errors.plate_number.message })}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name='emoneyBalance'
            control={control}
            rules={{ required: false }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                type='text'
                value={value || ''}
                label='E-money Balance'
                placeholder='0'
                onChange={e => {
                  // Only allow digits
                  const val = e.target.value.replace(/[^\d]/g, '')
                  onChange(val)
                }}
                inputProps={{
                  inputMode: 'numeric',
                  pattern: '[0-9]*'
                }}
                disabled={typeModal === 'VIEW'}
                error={Boolean(errors.emoneyBalance)}
                aria-describedby='validation-schema-emoneyBalance'
                {...(errors.emoneyBalance && { helperText: errors.emoneyBalance.message })}
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
                rows={4}
                value={value}
                fullWidth
                multiline
                onChange={onChange}
                disabled={typeModal === 'VIEW'}
                label='Deskripsi'
                error={Boolean(errors.description)}
                aria-describedby='validation-basic-description'
                {...(errors.description && { helperText: 'Kolom ini harus diisi' })}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name='is_active'
            control={control}
            rules={{ required: false }}
            render={({ field: { value, onChange } }) => (
              <FormControlLabel
                label='Active'
                control={
                  <Switch
                    checked={!!value}
                    onChange={e => onChange(e.target.checked)}
                    disabled={typeModal === 'VIEW'}
                  />
                }
              />
            )}
          />
        </Grid>
      </Grid>
    </AppModal>
  )
}
