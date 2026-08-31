// ** MUI Imports
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Third Party Imports
import * as yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Store
import { addMasterDataWarehouse, editMasterDataWarehouse } from 'src/store/apps/master/warehouse'

// ** Shared Components
import AppModal from 'src/views/common/AppModal'

const masterStatus = [
  { value: 'active', label: 'Active' },
  { value: 'not-active', label: 'Not Active' }
]

export default function ModalAddMasterWarehouse({ open, setOpen, typeModal, id }) {
  const dispatch = useDispatch()
  const { defaultValue, detail: detailType, loadingAdd, loadingEdit } = useSelector(state => state.warehouse)

  // SHCEMA YUP VALIDATION
  const schema = yup.object().shape({
    name: yup.string().required('Nama gudang harus diisi'),
    location: yup.string().required('Lokasi harus diisi')
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
      delete data.status
      dispatch(addMasterDataWarehouse(data))
    } else {
      dispatch(editMasterDataWarehouse({ id, data }))
    }
    setOpen(false)
  }

  return (
    <AppModal
      open={open}
      onClose={() => setOpen(false)}
      onSubmit={handleSubmit(onSubmit)}
      title={
        typeModal === 'ADD' ? 'Add New Warehouse' : typeModal === 'VIEW' ? 'Warehouse Detail' : 'Edit Warehouse'
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
                label='Warehouse Name'
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
            name='location'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                value={value}
                label='Location'
                placeholder=''
                onChange={onChange}
                disabled={typeModal === 'VIEW'}
                error={Boolean(errors.location)}
                aria-describedby='validation-schema-location'
                {...(errors.location && { helperText: errors.location.message })}
              />
            )}
          />
        </Grid>
        {/* Status is only editable on an existing warehouse — the create
            endpoint derives it, and `onSubmit` strips it on ADD. */}
        {typeModal === 'EDIT' && (
          <Grid item xs={12}>
            <Controller
              name='status'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  select
                  fullWidth
                  label='Status'
                  value={value || 'active'}
                  onChange={onChange}
                  disabled={typeModal === 'VIEW'}
                  error={Boolean(errors.status)}
                  aria-describedby='validation-schema-status'
                  {...(errors.status && { helperText: errors.status.message })}
                >
                  {masterStatus.map(item => (
                    <MenuItem key={item.value} value={item.value}>
                      {item.label}
                    </MenuItem>
                  ))}
                </CustomTextField>
              )}
            />
          </Grid>
        )}
      </Grid>
    </AppModal>
  )
}
