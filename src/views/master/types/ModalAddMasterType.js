// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Third Party Imports
import * as yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Store
import { addMasterDataType, editMasterDataType } from 'src/store/apps/master/type'

// ** Shared Components
import AppModal from 'src/views/common/AppModal'

export default function ModalAddMasterType({ open, setOpen, typeModal, id }) {
  const dispatch = useDispatch()
  const { defaultValue, detail: detailType, loadingAdd, loadingEdit } = useSelector(state => state.type)

  // SHCEMA YUP VALIDATION
  const schema = yup.object().shape({
    name: yup.string().required('Nama tipe harus diisi')
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
      dispatch(addMasterDataType(data))
    } else {
      dispatch(editMasterDataType({ id, data }))
    }
    setOpen(false)
  }

  return (
    <AppModal
      open={open}
      onClose={() => setOpen(false)}
      onSubmit={handleSubmit(onSubmit)}
      title={typeModal === 'ADD' ? 'Add New Type' : typeModal === 'VIEW' ? 'Type Detail' : 'Edit Type'}
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
                label='Type Name'
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
            name='description'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                rows={4}
                value={value}
                fullWidth
                multiline
                onChange={onChange}
                disabled={typeModal === 'VIEW'}
                label='Description'
                error={Boolean(errors.description)}
                aria-describedby='validation-basic-description'
                {...(errors.description && { helperText: 'Kolom ini harus diisi' })}
              />
            )}
          />
        </Grid>
      </Grid>
    </AppModal>
  )
}
