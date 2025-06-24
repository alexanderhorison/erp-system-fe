import { Card, Box, Grid, Button, Dialog, DialogContent, DialogActions, Typography, IconButton, MenuItem, CircularProgress } from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from "react-hook-form"
import { CustomCloseButton } from "src/views/pages/dialog-examples/DialogEditUserInfo"
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { priceFormat } from "src/helpers/priceFormatter"
import { useEffect } from "react"
import { addAsset, editAsset, getPiutangUsaha, resetAssetCurrentState } from "../../../store/apps/asset/current"
import { subMonths, endOfMonth } from 'date-fns';
import parsePeriodString from "src/helpers/parsePeriodString"

function getPeriodValue(value) {
  if (!value) return ''
  const year = value.getFullYear()
  const month = (value.getMonth() + 1).toString().padStart(2, '0') // add 1 since JS months are 0-based
  return `${year}-${month}` // => "2025-06"
}


export default function ModalFormCurrentAsset({ open, setOpen, typeModal, id }) {
  const dispatch = useDispatch()

  const schema = yup.object().shape({
    period: yup.string().required("Periode wajib diisi"), // e.g., 2025-02
    cashAndBank: yup.string().required("Kas dan Bank wajib diisi"),
    accountsReceivable: yup.string().required("Piutang Usaha wajib diisi"),
    thirdPartyReceivable: yup.string().required("Piutang Pihak Ketiga wajib diisi"),
    otherReceivables: yup.string().required("Piutang Lainnya wajib diisi"),
    inventory: yup.string().required("Persediaan wajib diisi"),
    advancePayments: yup.string().required("Uang Muka wajib diisi"),
    tax: yup.string().required("Pajak wajib diisi"),
    grandTotal: yup.string().required("Total Keseluruhan wajib diisi"),
  })

  const { loadingPiutangUsaha, detailAssetCurrent, loadingDetailAssetCurrent } = useSelector(state => state.assetCurrent)

  function transformDetailAsset(asset) {
    if (!asset) return null;

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
    };
  }

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  })

  // Fetch Data Value
  useEffect(() => {
    if (!loadingDetailAssetCurrent && ["EDIT", "VIEW"].includes(typeModal)) {
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
    dispatch(resetAssetCurrentState())   // reset piutangUsaha & detailAssetCurrent
    reset()
    setOpen(false)
  }

  const onSubmit = data => {
    const transformedData = {
      ...data,
      period: getPeriodValue(new Date(data.period)), // Transform date to "YYYY-MM" format
    }

    if (typeModal === 'ADD') {
      dispatch(addAsset(transformedData))
    } else {
      dispatch(editAsset({ id, data: transformedData }))
    }
    dispatch(resetAssetCurrentState())   // reset piutangUsaha & detailAssetCurrent
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
    if (period && ["ADD", "EDIT"].includes(typeModal)) {
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
    <Card>
      <Dialog
        fullWidth
        open={open}
        maxWidth='md'
        scroll='body'
        onClose={handleClose}
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
            <CustomCloseButton onClick={handleClose}>
              <Icon icon='tabler:x' fontSize='1.25rem' />
            </CustomCloseButton>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Typography variant='h3' sx={{ mb: 3 }}>
                {typeModal === 'ADD' ? 'Tambahkan Asset Baru' : typeModal === 'VIEW' ? 'Detail Asset' : 'Ubah Asset'}
              </Typography>
            </Box>
            {
              loadingDetailAssetCurrent && typeModal !== 'ADD' ? <CircularProgress /> :
                <Grid container spacing={6}>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="period"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { ref, value, ...rest }, fieldState }) => (
                        <DatePicker
                          {...rest}
                          selected={value}
                          onChange={rest.onChange}
                          dateFormat="yyyy-MM"
                          showMonthYearPicker
                          placeholderText="Pilih Periode"
                          maxDate={endOfMonth(subMonths(new Date(), 1))}
                          // disabled={["VIEW", "EDIT"].includes(typeModal)}
                          customInput={
                            <CustomTextField
                              fullWidth
                              label="Periode (Bulan & Tahun)"
                              error={Boolean(fieldState.error)}
                              helperText={fieldState.error?.message}
                              inputRef={ref}
                              inputProps={{ readOnly: true }}
                            />
                          }
                        />
                      )}
                    />
                    <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1 }}>
                      Perhatian: Jika input bulan maka data yang diambil pada piutang usaha adalah bulan tersebut.
                    </Typography>
                  </Grid>

                  {[
                    { name: "accountsReceivable", label: "Piutang Usaha", disabled: true },
                    { name: "cashAndBank", label: "Kas dan Bank" },
                    { name: "thirdPartyReceivable", label: "Pihak Ketiga" },
                    { name: "otherReceivables", label: "Piutang Lain" },
                    { name: "inventory", label: "Persediaan" },
                    { name: "advancePayments", label: "Uang Muka" },
                    { name: "tax", label: "Pajak" },
                    { name: "grandTotal", label: "Grand Total", disabled: true, md: 12 },
                  ].map((fieldItem) => (
                    <Grid item xs={12} md={fieldItem.md ? fieldItem.md : 6} key={fieldItem.name}>
                      <Controller
                        name={fieldItem.name}
                        control={control}
                        render={({ field }) => (
                          <CustomTextField
                            fullWidth
                            type="text"
                            sx={{ zIndex: 0, display: 'block' }}
                            value={field.value ? priceFormat(field.value) : ''}
                            label={fieldItem.label}
                            onChange={e => {
                              handlePriceFieldChange({
                                event: e,
                                onChange: field.onChange
                              })
                            }}
                            disabled={typeModal === 'VIEW' || fieldItem.disabled}
                            error={Boolean(errors[fieldItem?.name])}
                            {...(errors[fieldItem?.name] && {
                              helperText: errors[fieldItem?.name]?.message
                            })}
                          />
                        )}
                      />
                    </Grid>
                  ))}
                </Grid>
            }

          </DialogContent>
          <DialogActions
            sx={{
              px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
              pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
            }}
          >
            {typeModal !== 'VIEW' && (
              <>
                <Button variant='tonal' color='secondary' onClick={handleClose} hidden={typeModal === 'VIEW'}>
                  Cancel
                </Button>
                {
                  loadingPiutangUsaha ? <CircularProgress size={24} /> : <Button type='submit' variant='contained' hidden={typeModal === 'VIEW'}>
                    Submit
                  </Button>
                }
              </>
            )}
          </DialogActions>
        </form>
      </Dialog>
    </Card>
  )
}