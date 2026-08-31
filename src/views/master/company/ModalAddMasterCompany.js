// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Styles Import
import 'react-credit-cards/es/styles-compiled.css'

// ** Icon Imports
import { useDispatch, useSelector } from 'react-redux'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { addMasterDataCompany, editMasterDataCompany } from 'src/store/apps/master/company'
import AppModal from 'src/views/common/AppModal'

export default function ModalAddMasterCompany({ open, setOpen, typeModal, id }) {
  const dispatch = useDispatch()
  const { defaultValue, detail: detailCategory, loadingAdd, loadingEdit } = useSelector(state => state.company)

  // SHCEMA YUP VALIDATION
  const schema = yup.object().shape({
    name: yup.string().required('Company name is required')
  })

  // REACT FORM
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    values: typeModal === 'ADD' ? defaultValue : detailCategory,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  // ON SUBMIT
  const onSubmit = data => {
    if (typeModal === 'ADD') {
      dispatch(addMasterDataCompany(data))
    } else {
      dispatch(editMasterDataCompany({ id, data }))
    }
    setOpen(false)
  }

  return (
    <AppModal
      open={open}
      onClose={() => setOpen(false)}
      onSubmit={handleSubmit(onSubmit)}
      title={typeModal === 'ADD' ? 'Add New Company' : typeModal === 'VIEW' ? 'Company Detail' : 'Edit Company'}
      size='sm'
      showActions={typeModal !== 'VIEW'}
      loading={typeModal === 'ADD' ? loadingAdd : loadingEdit}
    >
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={12}>
              <Controller
                name='name'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    label='Company Name'
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
                    {...(errors.description && { helperText: 'This field is required' })}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </AppModal>
  )
}
