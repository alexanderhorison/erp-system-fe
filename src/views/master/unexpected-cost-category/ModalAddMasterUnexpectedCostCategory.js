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
import {
  addMasterDataUnexpectedCostCategory,
  editMasterDataUnexpectedCostCategory
} from 'src/store/apps/master/unexpected-cost-category'

// ** Shared Components
import AppModal from 'src/views/common/AppModal'

export default function ModalAddMasterUnexpectedCostCategory({ open, setOpen, typeModal, id }) {
  const dispatch = useDispatch()
  const {
    defaultValue,
    detail: detailCategory,
    loadingAdd,
    loadingEdit
  } = useSelector(state => state.masterUnexpectedCostCategory)

  // SCHEMA YUP VALIDATION
  const schema = yup.object().shape({
    name: yup.string().required('Nama kategori harus diisi')
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
      dispatch(addMasterDataUnexpectedCostCategory(data))
    } else {
      dispatch(editMasterDataUnexpectedCostCategory({ id, data }))
    }
    setOpen(false)
  }

  return (
    <AppModal
      open={open}
      onClose={() => setOpen(false)}
      onSubmit={handleSubmit(onSubmit)}
      title={
        typeModal === 'ADD'
          ? 'Tambah Kategori Baru'
          : typeModal === 'VIEW'
          ? 'Detail Kategori Biaya Tak Terduga'
          : 'Ubah Kategori Biaya Tak Terduga'
      }
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
                label='Nama Kategori'
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
                label='Deskripsi'
                error={Boolean(errors.description)}
                aria-describedby='validation-basic-description'
                {...(errors.description && { helperText: errors.description.message })}
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
