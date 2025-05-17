import { Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent, Grid, Typography } from '@mui/material'
import ModalConfirmation from '../common/ModalConfirmation'
import { useForm, Controller } from 'react-hook-form'
import { CustomCloseButton } from '../pages/dialog-examples/DialogEditUserInfo'
import Icon from 'src/@core/components/icon'
import { useDispatch, useSelector } from 'react-redux'
import CustomTextField from 'src/@core/components/mui/text-field'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { createConfigDailyCost, fetchConfigDailyCost } from 'src/store/apps/config/configDailyCost'
import { useEffect } from 'react'
import { formatNumber, parseNumber } from 'src/utils/formatNumber'

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
    <Card>
      <Dialog
        fullWidth
        open={open}
        maxWidth='sm'
        scroll='body'
        onClose={onClose}
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent
            sx={{
              pb: theme => `${theme.spacing(8)} !important`,
              px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
              pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
            }}
          >
            <CustomCloseButton onClick={onClose}>
              <Icon icon='tabler:x' fontSize='1.25rem' />
            </CustomCloseButton>

            <Typography variant='h5' sx={{ mb: 4, textAlign: 'center' }}>
              Pengaturan Biaya Harian
            </Typography>
            <Grid container spacing={6}>
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
          </DialogContent>
          <DialogActions
            sx={{
              px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
              pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
            }}
          >
            <>
              <Button variant='tonal' color='secondary' onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button type='submit' variant='contained' disabled={loading}>
                {loading ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </>
          </DialogActions>
        </form>
      </Dialog>
    </Card>
  )
}
