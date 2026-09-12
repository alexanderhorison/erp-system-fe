import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import { subMonths, endOfMonth } from 'date-fns'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useTheme } from '@mui/material'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// ** Custom Component Imports
import CustomTextField from 'src/@core/components/mui/text-field'
import PickersComponent from 'src/views/forms/form-elements/pickers/PickersCustomInput'

// ** Shared Components
import AppModal from 'src/views/common/AppModal'
import DatePickerHighZIndexStyles from 'src/views/common/DatePickerHighZIndexStyles'

// ** Store
import { addAsset, editAsset, getPiutangUsaha, resetAssetCurrentState } from 'src/store/apps/asset/current'

// ** Helpers
import { priceFormat } from 'src/helpers/priceFormatter'
import parsePeriodString from 'src/helpers/parsePeriodString'

// ** Design Tokens
import { colors, radii, shadows, status as statusTokens } from 'src/configs/designTokens'

const schema = yup.object().shape({
  period: yup.string().required('Periode wajib diisi'), // e.g., 2025-02
  cashAndBank: yup.string().required('Kas dan Bank wajib diisi'),
  accountsReceivable: yup.string().required('Piutang Usaha wajib diisi'),
  thirdPartyReceivable: yup.string().required('Piutang Pihak Ketiga wajib diisi'),
  otherReceivables: yup.string().required('Piutang Lainnya wajib diisi'),
  inventory: yup.string().required('Persediaan wajib diisi'),
  advancePayments: yup.string().required('Uang Muka wajib diisi'),
  tax: yup.string().required('Pajak wajib diisi'),
  grandTotal: yup.string().required('Total Keseluruhan wajib diisi'),
  notes: yup.string().optional().default('')
})

function getPeriodValue(value) {
  if (!value) return ''
  const year = value.getFullYear()
  const month = (value.getMonth() + 1).toString().padStart(2, '0') // add 1 since JS months are 0-based
  return `${year}-${month}` // => "2025-06"
}

function transformDetailAsset(asset) {
  if (!asset) return null

  return {
    ...asset,
    period: parsePeriodString(asset.period),
    cashAndBank: asset.cashAndBank || '',
    accountsReceivable: asset.accountsReceivable || '',
    thirdPartyReceivable: asset.thirdPartyReceivable || '',
    otherReceivables: asset.otherReceivables || '',
    inventory: asset.inventory || '',
    advancePayments: asset.advancePayments || '',
    tax: asset.tax || '',
    grandTotal: asset.grandTotal || '',
    notes: asset.notes || ''
  }
}

/**
 * ModalFormCurrentAsset
 * -------------------------------------------------------------------------------------
 * Add/Edit dialog for a monthly current-asset entry (Figma: "Ubah Aset Lancar").
 * Uses the shared `AppModal` shell; Grand Total is read-only and highlighted in a
 * success-toned box, matching the target design.
 */
export default function ModalFormCurrentAsset({ open, setOpen, typeModal, id }) {
  const dispatch = useDispatch()

  const theme = useTheme()
  const { direction } = theme
  const popperPlacement = direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  const { loadingAction, detailAssetCurrent, loadingDetailAssetCurrent } = useSelector(state => state.assetCurrent)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    setValue
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  // Fetch Data Value
  useEffect(() => {
    if (!loadingDetailAssetCurrent && typeModal === 'EDIT') {
      const transformedData = transformDetailAsset(detailAssetCurrent)
      reset(transformedData)
    }
  }, [detailAssetCurrent, loadingDetailAssetCurrent, typeModal])

  const period = watch('period')

  const values = watch([
    'cashAndBank',
    'accountsReceivable',
    'thirdPartyReceivable',
    'otherReceivables',
    'inventory',
    'advancePayments',
    'tax'
  ])

  // CLOSE MODAL AND RESET FORM
  const handleClose = () => {
    dispatch(resetAssetCurrentState()) // reset piutangUsaha & detailAssetCurrent
    reset()
    setOpen(false)
  }

  const onSubmit = data => {
    const transformedData = {
      ...data,
      period: getPeriodValue(new Date(data.period)) // Transform date to "YYYY-MM" format
    }

    if (typeModal === 'ADD') {
      dispatch(addAsset(transformedData))
    } else {
      dispatch(editAsset({ id, data: transformedData }))
    }
    dispatch(resetAssetCurrentState()) // reset piutangUsaha & detailAssetCurrent
    reset()
    setOpen(false)
  }

  const handlePriceFieldChange = ({ event, onChange }) => {
    const input = event.target
    const cursorPosition = input.selectionStart
    const rawValue = input.value.replace(/\D/g, '')
    const formattedValue = priceFormat(+rawValue)

    const unformattedBeforeCursor = input.value.slice(0, cursorPosition).replace(/\D/g, '')
    const newCursorIndex = unformattedBeforeCursor.length

    // Update form state with raw numeric value
    onChange(rawValue)
    // Set formatted value and maintain cursor
    input.value = formattedValue

    let cursorIndexInFormatted = 0
    for (let i = 0, digitsCount = 0; i < formattedValue.length; i++) {
      if (/\d/.test(formattedValue[i])) {
        digitsCount++
      }
      if (digitsCount === newCursorIndex) {
        cursorIndexInFormatted = i + 1
        break
      }
    }

    input.setSelectionRange(cursorIndexInFormatted, cursorIndexInFormatted)
  }

  useEffect(() => {
    if (period && ['ADD', 'EDIT'].includes(typeModal)) {
      const formatted = getPeriodValue(period) // => "2025-06"
      dispatch(getPiutangUsaha(formatted)).then(res => {
        const total = res?.payload?.data || 0
        setValue('accountsReceivable', total)
      })
    }
  }, [dispatch, period])

  useEffect(() => {
    const total = values.reduce((sum, val) => {
      const numericVal = parseInt(val?.toString().replace(/\D/g, ''), 10)
      return sum + (isNaN(numericVal) ? 0 : numericVal)
    }, 0)

    setValue('grandTotal', total)
  }, [values, setValue])

  return (
    <AppModal
      open={open}
      onClose={handleClose}
      onSubmit={handleSubmit(onSubmit)}
      title={typeModal === 'ADD' ? 'Tambah Aset Lancar' : 'Ubah Aset Lancar'}
      size='sm'
      loading={loadingAction}
      loadingPage={loadingDetailAssetCurrent && typeModal === 'EDIT'}
    >
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6}>
          <Controller
            name='period'
            control={control}
            rules={{ required: true }}
            render={({ field: { ref, value, ...rest }, fieldState }) => (
              <DatePicker
                {...rest}
                selected={value}
                onChange={rest.onChange}
                dateFormat='MMM yyyy'
                showMonthYearPicker
                popperPlacement={popperPlacement}
                popperProps={{ strategy: 'fixed' }}
                popperClassName='high-z-index-popper'
                placeholderText='Pilih Periode'
                maxDate={endOfMonth(subMonths(new Date(), 1))}
                disabled={typeModal === 'EDIT'}
                customInput={
                  <PickersComponent
                    fullWidth
                    label='Periode'
                    error={Boolean(fieldState.error)}
                    helperText={fieldState.error?.message}
                    inputRef={ref}
                  />
                }
              />
            )}
          />
          <DatePickerHighZIndexStyles />
          <Typography sx={{ fontSize: '0.75rem', color: colors.mutedForeground, mt: 1 }}>
            Perhatian: Jika input bulan maka data yang diambil pada piutang usaha adalah bulan tersebut.
          </Typography>
        </Grid>

        {[
          { name: 'accountsReceivable', label: 'Piutang Usaha', disabled: true },
          { name: 'cashAndBank', label: 'Kas dan Bank' },
          { name: 'thirdPartyReceivable', label: 'Pihak Ketiga' },
          { name: 'otherReceivables', label: 'Piutang Lain' },
          { name: 'inventory', label: 'Persediaan' },
          { name: 'advancePayments', label: 'Uang Muka' },
          { name: 'tax', label: 'Pajak' }
        ].map(fieldItem => (
          <Grid item xs={12} sm={6} key={fieldItem.name}>
            <Controller
              name={fieldItem.name}
              control={control}
              render={({ field }) => (
                <CustomTextField
                  fullWidth
                  type='text'
                  sx={{ zIndex: 0, display: 'block' }}
                  value={field.value ? priceFormat(field.value) : ''}
                  label={fieldItem.label}
                  onChange={e => {
                    handlePriceFieldChange({
                      event: e,
                      onChange: field.onChange
                    })
                  }}
                  disabled={fieldItem.disabled}
                  error={Boolean(errors[fieldItem?.name])}
                  {...(errors[fieldItem?.name] && {
                    helperText: errors[fieldItem?.name]?.message
                  })}
                />
              )}
            />
          </Grid>
        ))}

        <Grid item xs={12}>
          <Box
            sx={{
              p: 4,
              borderRadius: `${radii['3xl']}px`,
              border: `1px solid ${colors.border}`,
              backgroundColor: colors.background,
            }}
          >
            <Typography sx={{ fontSize: '0.8125rem', color: colors.foreground, mb: 1 }}>Grand Total</Typography>
            <Controller
              name='grandTotal'
              control={control}
              render={({ field }) => (
                <Typography sx={{ fontSize: '1.375rem', fontWeight: 700, color: statusTokens.success.fg }}>
                  {field.value ? priceFormat(field.value) : 'Rp 0'}
                </Typography>
              )}
            />
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Controller
            name='notes'
            control={control}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                multiline
                rows={3}
                value={value || ''}
                label='Catatan'
                onChange={onChange}
                placeholder='Type your message here...'
                error={Boolean(errors?.notes)}
                {...(errors?.notes && {
                  helperText: errors.notes?.message
                })}
              />
            )}
          />
        </Grid>
      </Grid>
    </AppModal>
  )
}
