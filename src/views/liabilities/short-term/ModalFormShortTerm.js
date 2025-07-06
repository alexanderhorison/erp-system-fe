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
import { subMonths, endOfMonth } from 'date-fns';
import parsePeriodString from "src/helpers/parsePeriodString"
import { addShortTerm, editShortTerm, getPiutangUsaha, resetShortTermState } from "src/store/apps/liabilities/short-term"
import { addLongTerm } from "src/store/apps/liabilities/long-term"

function getPeriodValue(value) {
  if (!value) return ''
  const year = value.getFullYear()
  const month = (value.getMonth() + 1).toString().padStart(2, '0') // add 1 since JS months are 0-based
  return `${year}-${month}-01` // => "2025-06"
}


export default function ModalFormShortTerm({ open, setOpen, typeModal, id }) {
  const dispatch = useDispatch()

  const schema = yup.object().shape({
    date: yup.date().required().typeError('Tanggal harus diisi'), // e.g., 2025-02-01
    tradePayables: yup.string().required("Hutang Usaha wajib diisi"),
    nonTradePayables: yup.string().required("Hutang Bukan Usaha wajib diisi"),
    accruedExpenses: yup.string().required("Biaya Masih Harus Dibayar wajib diisi"),
    taxPayables: yup.string().required("Hutang Pajak wajib diisi"),
    totalShortTermLiabilities: yup.string().required("Total Keseluruhan wajib diisi"),
    notes: yup.string().optional().default(''),
  })

  const { loadingPiutangUsaha, detailShortTerm, loadingDetailShortTerm } = useSelector(state => state.shortTerm)

  function transformDetailShortTerm(data) {
    if (!data) return null;

    return {
      ...data,
      date: parsePeriodString(data.date),
      tradePayables: data.tradePayables || '',
      nonTradePayables: data.nonTradePayables || '',
      accruedExpenses: data.accruedExpenses || '',
      taxPayables: data.taxPayables || '',
      inventory: data.inventory || '',
      totalShortTermLiabilities: data.totalShortTermLiabilities || '',
      notes: data.notes || '',
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
    if (!loadingDetailShortTerm && ["EDIT", "VIEW"].includes(typeModal)) {
      const transformedData = transformDetailShortTerm(detailShortTerm)
      reset(transformedData)
    }
  }, [detailShortTerm, loadingDetailShortTerm, typeModal])


  const date = watch('date')

  const values = watch([
    'tradePayables',
    'nonTradePayables',
    'accruedExpenses',
    'taxPayables',
  ])

  // CLOSE MODAL AND RESET FORM
  const handleClose = () => {
    dispatch(resetShortTermState())   // reset piutangUsaha & detailAssetCurrent
    reset()
    setOpen(false)
  }

  const onSubmit = data => {
    const transformedData = {
      ...data,
      date: getPeriodValue(new Date(data.date)), // Transform date to "YYYY-MM" format
    }

    if (typeModal === 'ADD') {
      dispatch(addShortTerm(transformedData))
    } else {
      dispatch(editShortTerm({ id, data: transformedData }))
    }
    dispatch(resetShortTermState())   // reset piutangUsaha & detailAssetCurrent
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
    if (date && ["ADD", "EDIT"].includes(typeModal)) {
      const formatted = getPeriodValue(date) // => "2025-06"
      dispatch(getPiutangUsaha(formatted)).then(res => {
        const total = res?.payload?.data || 0
        setValue('tradePayables', total)
      })
    }
  }, [dispatch, date])

  useEffect(() => {
    const total = values.reduce((sum, val) => {
      const numericVal = parseInt(val?.toString().replace(/\D/g, ''), 10)
      return sum + (isNaN(numericVal) ? 0 : numericVal)
    }, 0)

    setValue('totalShortTermLiabilities', total)
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
                {typeModal === 'ADD' ? 'Tambahkan Liabilitas Jangka Pendek' : typeModal === 'VIEW' ? 'Detail Liabilitas Jangka Pendek' : 'Ubah Liabilitas Jangka Pendek'}
              </Typography>
            </Box>
            {
              loadingDetailShortTerm && typeModal !== 'ADD' ? <CircularProgress /> :
                <>
                  <Grid container spacing={6}>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="date"
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { ref, value, ...rest }, fieldState }) => (
                          <DatePicker
                            {...rest}
                            selected={value}
                            onChange={rest.onChange}
                            dateFormat="MMM yyyy"
                            showMonthYearPicker
                            placeholderText="Pilih Bulan & Tahun"
                            maxDate={endOfMonth(subMonths(new Date(), 1))}
                            disabled={["VIEW", "EDIT"].includes(typeModal)}
                            customInput={
                              <CustomTextField
                                fullWidth
                                label="Date (Bulan & Tahun)"
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
                        Perhatian: Jika input bulan maka data yang diambil pada hutang usaha adalah bulan tersebut.
                      </Typography>
                    </Grid>

                    {[
                      { name: "tradePayables", label: "Hutang Usaha", disabled: true },
                      { name: "nonTradePayables", label: "Hutang Bukan Usaha" },
                      { name: "accruedExpenses", label: "Biaya Masih Harus Dibayar" },
                      { name: "taxPayables", label: "Hutang Pajak" },
                      { name: "totalShortTermLiabilities", label: "Grand Total", disabled: true, md: 12 },
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
                  <Grid item xs={12} sx={{ mt: 4 }}>
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
                          placeholder='Masukkan Catatan (Opsional)'
                          disabled={typeModal === 'VIEW'}
                          error={Boolean(errors?.notes)}
                          {...(errors?.notes && {
                            helperText: errors.notes?.message
                          })}
                        />
                      )}
                    />
                  </Grid>
                </>
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