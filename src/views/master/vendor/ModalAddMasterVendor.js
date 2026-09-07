import { useEffect } from 'react'

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
import { addMasterDataVendor, editMasterDataVendor } from 'src/store/apps/master/vendor'
import { fetchMasterDataRank } from 'src/store/apps/master/rank'

// ** Shared Components
import AppModal from 'src/views/common/AppModal'
import FormSelectSimple from 'src/views/common/Form/FormSelectSimple'

export default function ModalAddMasterVendor({ open, setOpen, typeModal, id }) {
  const dispatch = useDispatch()
  const { defaultValue, detail: detailVendor, loadingAdd, loadingEdit } = useSelector(state => state.masterVendor)
  const { data: dataRank } = useSelector(state => state.masterRank)

  // SCHEMA YUP VALIDATION
  const schema = yup.object().shape({
    name: yup.string().required('Nama vendor harus diisi'),
    phoneNumber: yup.string().required('Nomor telepon harus diisi'),
    address: yup.string().optional(),
    email: yup.string().email('Masukkan email yang valid').optional(),
    description: yup.string().optional(),
    gender: yup.string().required('Jenis kelamin harus diisi'),
    notes: yup.string().optional(),
    rankId: yup.number().required('Rank harus dipilih')
  })

  useEffect(() => {
    dispatch(fetchMasterDataRank())
  }, [dispatch])

  // REACT FORM
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    values: typeModal === 'ADD' ? defaultValue : detailVendor,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  // ON SUBMIT
  const onSubmit = data => {
    if (typeModal === 'ADD') {
      dispatch(addMasterDataVendor({ data, setOpen }))
    } else {
      dispatch(editMasterDataVendor({ id, data, setOpen }))
    }
  }

  return (
    <AppModal
      open={open}
      onClose={() => setOpen(false)}
      onSubmit={handleSubmit(onSubmit)}
      title={typeModal === 'ADD' ? 'Tambah Vendor Baru' : typeModal === 'VIEW' ? 'Detail Vendor' : 'Ubah Vendor'}
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
                value={value || ''}
                label='Nama Vendor'
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
            name='phoneNumber'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                value={value || ''}
                label='Nomor Telepon'
                placeholder=''
                onChange={onChange}
                disabled={typeModal === 'VIEW'}
                error={Boolean(errors.phoneNumber)}
                aria-describedby='validation-schema-phone'
                {...(errors.phoneNumber && { helperText: errors.phoneNumber.message })}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name='email'
            control={control}
            rules={{ required: false }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                type='email'
                value={value || ''}
                label='Email'
                placeholder=''
                onChange={onChange}
                disabled={typeModal === 'VIEW'}
                error={Boolean(errors.email)}
                aria-describedby='validation-schema-email'
                {...(errors.email && { helperText: errors.email.message })}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name='address'
            control={control}
            rules={{ required: false }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                rows={4}
                value={value || ''}
                fullWidth
                multiline
                onChange={onChange}
                disabled={typeModal === 'VIEW'}
                label='Alamat'
                error={Boolean(errors.address)}
                aria-describedby='validation-schema-address'
                {...(errors.address && { helperText: errors.address.message })}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <FormSelectSimple
            label='Pilih Jenis Kelamin'
            control={control}
            errors={errors}
            disabled={typeModal === 'VIEW'}
            data={[
              { value: 'Laki-laki', name: 'Laki-laki' },
              { value: 'Perempuan', name: 'Perempuan' },
              { value: 'Lainnya', name: 'Lainnya' }
            ]}
            name='gender'
            optionsValue='value'
            optionsLabel='name'
          />
        </Grid>
        <Grid item xs={12}>
          <FormSelectSimple
            label='Pilih Rank'
            control={control}
            errors={errors}
            disabled={typeModal === 'VIEW'}
            data={dataRank}
            name='rankId'
            optionsValue='id'
            optionsLabel='name'
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name='notes'
            control={control}
            rules={{ required: false }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                rows={4}
                value={value || ''}
                fullWidth
                multiline
                onChange={onChange}
                disabled={typeModal === 'VIEW'}
                label='Catatan'
                error={Boolean(errors.notes)}
                aria-describedby='validation-schema-notes'
              />
            )}
          />
        </Grid>
      </Grid>
    </AppModal>
  )
}
