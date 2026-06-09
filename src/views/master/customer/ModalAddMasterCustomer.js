// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'
import BaseModal from 'src/views/common/BaseModal'

// ** Icon Imports
import { useDispatch, useSelector } from 'react-redux'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { addMasterDataCustomer, editMasterDataCustomer } from 'src/store/apps/master/customer'
import { useEffect } from 'react'
import { fetchMasterDataRank } from 'src/store/apps/master/rank'
import FormSelectSimple from 'src/views/common/Form/FormSelectSimple'

export default function ModalAddMasterCustomer({ open, setOpen, typeModal, id }) {
  const dispatch = useDispatch()
  const { defaultValue, detail: detailCustomer, loadingAdd, loadingEdit } = useSelector(state => state.masterCustomer)
  const { data: dataRank } = useSelector(state => state.masterRank)
  // SCHEMA YUP VALIDATION
  const schema = yup.object().shape({
    name: yup.string().required('Nama customer harus diisi'),
    phoneNumber: yup.string().required('Nomor telepon harus diisi'),
    address: yup.string().optional(),
    rankId: yup.number().required('Rank harus dipilih'),
    email: yup.string().email('Masukkan email yang valid').required('Email harus diisi'),
    description: yup.string().optional(),
    notes: yup.string().optional()
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
    values: typeModal === 'ADD' ? defaultValue : detailCustomer,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  // ON SUBMIT
  const onSubmit = data => {
    console.log(data)
    if (typeModal === 'ADD') {
      dispatch(addMasterDataCustomer({ data, setOpen }))
    } else {
      dispatch(editMasterDataCustomer({ id, data, setOpen }))
    }
    setOpen(false)
  }
  console.log(detailCustomer)

  return (
    <BaseModal
      open={open}
      onClose={() => setOpen(false)}
      onSubmit={handleSubmit(onSubmit)}
      title={
        typeModal === 'ADD' ? 'Tambahkan Customer Baru' : typeModal === 'VIEW' ? 'Detail Customer' : 'Ubah Customer'
      }
      size='sm'
      showActions={typeModal !== 'VIEW'}
      loading={typeModal === 'ADD' ? loadingAdd : loadingEdit}
    >
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
                    label='Nama Customer'
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
                name='phoneNumber'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
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
            <Grid item xs={12} sm={12}>
              <Controller
                name='email'
                control={control}
                rules={{ required: false }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    type='email'
                    value={value}
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
                    value={value}
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
              <Controller
                name='address'
                control={control}
                rules={{ required: false }}
                render={({ field: { value, onChange } }) => (
                  <FormSelectSimple
                    label={'Pilih Rank'}
                    control={control}
                    errors={errors}
                    value={value}
                    onChange={onChange}
                    disabled={typeModal === 'VIEW'}
                    data={dataRank}
                    name={'rankId'}
                    optionsValue={'id'}
                    optionsLabel={'name'}
                  />
                )}
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
                    value={value}
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
        </Grid>
      </Grid>
    </BaseModal>
  )
}
