import Grid from '@mui/material/Grid'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'

import CustomTextField from 'src/@core/components/mui/text-field'
import { createConfigDailyCost, fetchConfigDailyCost } from 'src/store/apps/config/configDailyCost'
import { formatNumber, parseNumber } from 'src/utils/formatNumber'

// ** Shared Components
import AppModal from 'src/views/common/AppModal'

export default function SettingDailyCost({ open, onClose }) {
  const dispatch = useDispatch()
  const { configDailyCost, loading } = useSelector(state => state.configDailyCost)

  const schema = yup.object().shape({
    DC_TRANSPORT_ALLOWANCE: yup.number().required('Transport allowance harus diisi'),
    DC_DEPOSIT: yup.number().required('Deposit harus diisi')
  })

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      DC_TRANSPORT_ALLOWANCE: '',
      DC_DEPOSIT: ''
    }
  })

  // Fetch config data when component mounts
  useEffect(() => {
    dispatch(fetchConfigDailyCost())
  }, [dispatch])

  // Update form values when config data is loaded
  useEffect(() => {
    if (configDailyCost && configDailyCost.length > 0) {
      // Map through the array to find our specific config keys
      configDailyCost.forEach(config => {
        if (config.key === 'DC_TRANSPORT_ALLOWANCE') {
          setValue('DC_TRANSPORT_ALLOWANCE', config.value)
        }
        if (config.key === 'DC_DEPOSIT') {
          setValue('DC_DEPOSIT', config.value)
        }
      })
    }
  }, [configDailyCost, setValue])

  const onSubmit = payload => {
    // Prepare payload for API request
    const data = [
      { key: 'DC_TRANSPORT_ALLOWANCE', value: payload.DC_TRANSPORT_ALLOWANCE },
      { key: 'DC_DEPOSIT', value: payload.DC_DEPOSIT }
    ]
    dispatch(createConfigDailyCost({ data, onClose }))
  }

  return (
    <AppModal
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
      title='Pengaturan Biaya Harian'
      size='sm'
      loading={loading}
    >
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Controller
            name='DC_DEPOSIT'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                value={formatNumber(value)}
                label='Deposit'
                placeholder='Masukkan nilai deposit'
                onChange={e => {
                  const numericValue = parseNumber(e.target.value)
                  onChange(numericValue)
                }}
                error={Boolean(errors.DC_DEPOSIT)}
                inputProps={{
                  inputMode: 'numeric'
                }}
                disabled={loading}
                aria-describedby='validation-deposit'
                {...(errors.DC_DEPOSIT && { helperText: errors.DC_DEPOSIT.message })}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name='DC_TRANSPORT_ALLOWANCE'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                value={formatNumber(value)}
                label='Uang Jalan'
                placeholder='Masukkan nilai transport allowance'
                onChange={e => {
                  const numericValue = parseNumber(e.target.value)
                  onChange(numericValue)
                }}
                error={Boolean(errors.DC_TRANSPORT_ALLOWANCE)}
                inputProps={{
                  inputMode: 'numeric'
                }}
                disabled={loading}
                aria-describedby='validation-transport-allowance'
                {...(errors.DC_TRANSPORT_ALLOWANCE && { helperText: errors.DC_TRANSPORT_ALLOWANCE.message })}
              />
            )}
          />
        </Grid>
      </Grid>
    </AppModal>
  )
}
