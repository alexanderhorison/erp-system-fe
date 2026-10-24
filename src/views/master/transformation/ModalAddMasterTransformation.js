// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { useDispatch, useSelector } from 'react-redux'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { addMasterDataTransformation, editMasterDataTransformation } from 'src/store/apps/master/transformation'
import AppModal from 'src/views/common/AppModal'
import { stepperButtonSx } from 'src/views/common/TransformationFields'

// ** Design Tokens
import { colors, radii, shadows, status, stone } from 'src/configs/designTokens'

// ** One direction of the conversion, laid out like a stock row in the Transformasi Produk dialog.
const ResultRow = ({ from, to }) => (
  // ** Equal outer columns keep the arrow on the centre line whatever the text widths.
  <Box sx={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto minmax(0, 1fr)', alignItems: 'center', columnGap: 3 }}>
    <Typography sx={{ fontSize: '0.9375rem', color: colors.foreground }}>{from}</Typography>
    <Icon icon='tabler:arrow-right' fontSize='1rem' />
    <Typography sx={{ fontSize: '0.9375rem', fontWeight: 600, color: colors.foreground, textAlign: 'right' }}>
      {to}
    </Typography>
  </Box>
)

export default function ModalAddMasterTransformation({ open, setOpen, typeModal, product, id }) {
  const dispatch = useDispatch()
  const { data: masterDataUnit } = useSelector(state => state.unit)
  const {
    defaultValue,
    detail: detailTransformation,
    loadingDetail,
    loadingAdd,
    loadingEdit
  } = useSelector(data => data.masterTransformation)

  // SHCEMA YUP VALIDATION
  const schema = yup.object().shape({
    unitFromId: yup.string().required('Asal satuan produk harus ada'),
    unitToId: yup.string().required('Tujuan satuan produk harus ada'),
    amountTo: yup.string().required('Jumlah tujuan konversi produk harus ada')
  })

  // REACT FORM
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    values: typeModal === 'ADD' ? defaultValue : detailTransformation,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const unitName = unitId => masterDataUnit?.find(unit => unit.id == unitId)?.name || ''

  // ** The reading follows the form, so there is no second copy of the units to keep in sync.
  const [unitFromId, unitToId, amountTo] = watch(['unitFromId', 'unitToId', 'amountTo'])
  const fromName = unitName(unitFromId)
  const toName = unitName(unitToId)
  const hasResult = Boolean(fromName && toName && Number(amountTo) > 0)
  const splits = Number(amountTo) >= 1

  // ON SUBMIT
  const onSubmit = data => {
    const from = unitName(data.unitFromId)
    const to = unitName(data.unitToId)
    const info = {
      info1: `1 ${from} = ${data.amountTo} ${to}`,
      info2: `${data.amountTo} ${to} = 1 ${from}`
    }
    let input
    if (typeModal === 'ADD') {
      input = {
        unitFromId: +data.unitFromId,
        unitToId: +data.unitToId,
        masterProductId: product.id,
        amountFrom: 1,
        amountTo: +data.amountTo,
        ...info
      }
      dispatch(addMasterDataTransformation(input))
    } else {
      input = {
        masterProductId: data.masterProductId,
        unitFromId: +data.unitFromId,
        unitToId: +data.unitToId,
        amountFrom: 1,
        amountTo: +data.amountTo,
        code: data.code,
        ...info
      }
      dispatch(editMasterDataTransformation({ id, data: input }))
    }
    setOpen(false)
  }

  // CLOSE MODAL AND RESET FORM
  const handleClose = () => {
    setOpen(false)
  }

  const productName = product?.name

  return (
    <AppModal
      open={open}
      onClose={handleClose}
      onSubmit={handleSubmit(onSubmit)}
      title={typeModal === 'ADD' ? 'Tambah Transformasi' : typeModal === 'VIEW' ? 'Detail Transformasi' : 'Ubah Transformasi'}
      size='sm'
      showActions={typeModal !== 'VIEW'}
      loading={typeModal === 'ADD' ? loadingAdd : loadingEdit}
      loadingPage={typeModal === 'EDIT' && loadingDetail}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {/* Product */}
        {productName && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                flexShrink: 0,
                borderRadius: '50%',
                border: `1px solid ${colors.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: colors.mutedForeground
              }}
            >
              <Icon icon='tabler:packages' fontSize='1.5rem' />
            </Box>
            <Typography sx={{ fontSize: '1rem', fontWeight: 500, lineHeight: '24px', color: colors.foreground }}>
              {productName}
            </Typography>
          </Box>
        )}

        {/* Formula */}
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            <Controller
              name='unitFromId'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  select
                  fullWidth
                  label='Unit Awal'
                  value={value || ''}
                  onChange={onChange}
                  disabled={typeModal === 'VIEW'}
                  error={Boolean(errors.unitFromId)}
                  aria-describedby='validation-schema-unitFromId'
                  {...(errors.unitFromId && { helperText: errors.unitFromId.message })}
                >
                  {masterDataUnit.map(item => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </CustomTextField>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name='unitToId'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  select
                  fullWidth
                  label='Unit Tujuan'
                  value={value || ''}
                  onChange={onChange}
                  disabled={typeModal === 'VIEW'}
                  error={Boolean(errors.unitToId)}
                  aria-describedby='validation-schema-unitToId'
                  {...(errors.unitToId && { helperText: errors.unitToId.message })}
                >
                  {masterDataUnit.map(item => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </CustomTextField>
              )}
            />
          </Grid>
        </Grid>

        {/* Direction */}
        {hasResult && (
          <Box
            sx={{
              mt: -1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: 1.5,
              fontSize: '0.8125rem',
              color: colors.mutedForeground
            }}
          >
            <Icon icon={splits ? 'tabler:arrow-down' : 'tabler:arrow-up'} fontSize='1rem' />
            <span>{splits ? 'Dipecah ke kemasan lebih kecil' : 'Digabung ke kemasan lebih besar'}</span>
            <Typography component='span' sx={{ fontSize: 'inherit', fontWeight: 600, color: colors.foreground }}>
              1 {fromName} = {amountTo} {toName}
            </Typography>
          </Box>
        )}

        {/* Quantity */}
        <Controller
          name='amountTo'
          control={control}
          rules={{ required: true }}
          render={({ field: { value, onChange } }) => {
            const current = Number(value) || 0
            const readOnly = typeModal === 'VIEW'

            return (
              <Box>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: colors.foreground, mb: 2 }}>
                  Quantity
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  {!readOnly && (
                    <IconButton
                      aria-label='Kurangi quantity'
                      onClick={() => onChange(String(Math.max(1, current - 1)))}
                      disabled={current <= 1}
                      sx={stepperButtonSx}
                    >
                      <Icon icon='tabler:minus' fontSize='1.125rem' />
                    </IconButton>
                  )}
                  <Box
                    sx={{
                      flex: 1,
                      minWidth: 0,
                      height: 40,
                      px: 4,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      borderRadius: `${radii.full}px`,
                      border: `1px solid ${errors.amountTo ? colors.destructive : colors.border}`
                    }}
                  >
                    <InputBase
                      fullWidth
                      readOnly={readOnly}
                      value={value ?? ''}
                      onChange={event => onChange(event.target.value.replace(/\D/g, ''))}
                      inputProps={{
                        inputMode: 'numeric',
                        'aria-label': 'Quantity',
                        'aria-describedby': 'validation-schema-amountTo',
                        style: { textAlign: 'center' }
                      }}
                      sx={{ fontSize: '0.9375rem', color: colors.foreground }}
                    />
                    <Typography sx={{ fontSize: '0.875rem', color: colors.mutedForeground }}>{toName}</Typography>
                  </Box>
                  {!readOnly && (
                    <IconButton
                      aria-label='Tambah quantity'
                      onClick={() => onChange(String(current + 1))}
                      sx={stepperButtonSx}
                    >
                      <Icon icon='tabler:plus' fontSize='1.125rem' />
                    </IconButton>
                  )}
                </Box>
                {errors.amountTo && (
                  <Typography sx={{ mt: 2, fontSize: '0.75rem', color: colors.destructive }}>
                    {errors.amountTo.message}
                  </Typography>
                )}
              </Box>
            )
          }}
        />

        {/* Result */}
        <Box
          sx={{
            p: 4,
            borderRadius: `${radii['3xl']}px`,
            border: `1px solid ${colors.border}`,
            boxShadow: shadows.xs,
            backgroundColor: stone[50]
          }}
        >
          <Typography sx={{ fontSize: '0.875rem', color: colors.foreground, mb: 3 }}>Hasil Transformasi</Typography>
          {hasResult ? (
            <>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <ResultRow from={`1 ${fromName}`} to={`${amountTo} ${toName}`} />
                <ResultRow from={`${amountTo} ${toName}`} to={`1 ${fromName}`} />
              </Box>
              <Box sx={{ mt: 3, pt: 3, borderTop: `1px solid ${colors.border3}` }}>
                <Typography sx={{ fontSize: '0.8125rem', color: colors.foreground }}>
                  <b>1 {fromName}</b> jadi{' '}
                  <Box component='b' sx={{ color: status.success.fg }}>
                    {amountTo} {toName}
                  </Box>
                </Typography>
              </Box>
            </>
          ) : (
            <Typography sx={{ fontSize: '0.8125rem', color: colors.mutedForeground }}>
              Pilih unit awal, unit tujuan, dan isi quantity untuk melihat hasil transformasi
            </Typography>
          )}
        </Box>
      </Box>
    </AppModal>
  )
}
