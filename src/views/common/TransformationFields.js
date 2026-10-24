// ** React Imports
import { useCallback, useEffect, useMemo, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import ButtonBase from '@mui/material/ButtonBase'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import Radio from '@mui/material/Radio'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Shared Components
import { stockTone } from 'src/views/common/ProductInfoHeader'

// ** Design Tokens
import { colors, radii, shadows, status, stone } from 'src/configs/designTokens'

const numberFormat = new Intl.NumberFormat('id-ID')

const formatNumber = value => numberFormat.format(Number(value) || 0)

// ** "gudang utama" -> "Gudang Utama": only the first letter of each word changes.
const capitalizeWords = text => (text ? String(text).replace(/(^|\s)\S/g, letter => letter.toUpperCase()) : '')

/**
 * Works out what a transformation would do, without touching the API.
 *
 *   to    -> quantity of the destination unit that `qty` of the origin unit becomes
 *   error -> the first rule `qty` breaks (the API enforces the same three)
 */
export const getTransformationResult = ({ product, formula, qty }) => {
  const stock = Number(product?.quantity) || 0
  const amountFrom = Number(formula?.amountFrom) || 0
  const amountTo = Number(formula?.amountTo) || 0
  const from = Number(qty) || 0
  const result = { from, to: 0, stock, amountFrom, amountTo, error: null }

  if (!formula) return result
  if (from <= 0) return { ...result, error: 'Jumlah harus diisi' }
  if (from > stock) return { ...result, error: 'Jumlah melebihi stok tersedia' }
  if (amountFrom && from % amountFrom !== 0) {
    return { ...result, error: `Jumlah harus kelipatan ${amountFrom}` }
  }

  return { ...result, to: amountFrom ? (from / amountFrom) * amountTo : 0 }
}

/**
 * State shared by every transformation dialog: which formula is picked and how
 * many units go through it. The first formula is picked as soon as the list
 * arrives, and the quantity follows its `amountFrom` until the user (or the
 * calling row) has chosen one.
 */
export const useTransformation = ({ formulas, product, initialQty }) => {
  const list = useMemo(() => (Array.isArray(formulas) ? formulas : []), [formulas])
  const [formulaId, setFormulaId] = useState(null)
  const [qty, setQty] = useState(Number(initialQty) > 0 ? Number(initialQty) : '')
  const [qtyChosen, setQtyChosen] = useState(Number(initialQty) > 0)

  const formula = list.find(item => item.id === formulaId) || null

  // ** The list is replaced on every open, so a leftover pick from a previous
  // product is dropped here rather than trusted.
  useEffect(() => {
    if (!list.length || list.some(item => item.id === formulaId)) return

    setFormulaId(list[0].id)
    if (!qtyChosen) setQty(Number(list[0].amountFrom) || 1)
  }, [list, formulaId, qtyChosen])

  const selectFormula = useCallback(
    next => {
      setFormulaId(next.id)
      if (!qtyChosen) setQty(Number(next.amountFrom) || 1)
    },
    [qtyChosen]
  )

  const changeQty = useCallback(next => {
    setQtyChosen(true)
    setQty(next)
  }, [])

  const result = useMemo(() => getTransformationResult({ product, formula, qty }), [product, formula, qty])

  return { formula, formulaId, selectFormula, qty, changeQty, result }
}

const surfaceSx = {
  borderRadius: `${radii['3xl']}px`,
  border: `1px solid ${colors.border}`
}

const SectionLabel = ({ children }) => (
  <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: colors.foreground, mb: 2 }}>{children}</Typography>
)

const StatPill = ({ label, value, tone }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      px: 4,
      height: 40,
      borderRadius: `${radii.full}px`,
      border: `1px solid ${tone ? tone.border : colors.border}`,
      backgroundColor: tone ? tone.bg : 'transparent'
    }}
  >
    <Typography noWrap sx={{ fontSize: '0.75rem', color: tone ? tone.fg : colors.mutedForeground }}>
      {label}
    </Typography>
    <Typography noWrap sx={{ fontSize: '0.875rem', fontWeight: 600, color: tone ? tone.fg : colors.foreground }}>
      {value}
    </Typography>
  </Box>
)

const DeltaPill = ({ value }) => {
  const tone = value < 0 ? status.danger : status.success

  return (
    <Box
      component='span'
      sx={{
        minWidth: 44,
        px: 2,
        height: 24,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: `${radii.full}px`,
        border: `1px solid ${tone.border}`,
        backgroundColor: tone.bg,
        color: tone.fg,
        fontSize: '0.75rem',
        fontWeight: 500
      }}
    >
      {value > 0 ? `+${formatNumber(value)}` : `-${formatNumber(Math.abs(value))}`}
    </Box>
  )
}

// ** Cells of one stock row. They sit in a shared grid (`display: contents`), so the
// before / arrow / after / delta columns line up across rows whatever the digits.
const StockRow = ({ unit, before, after, delta }) => (
  <Box sx={{ display: 'contents' }}>
    <Typography noWrap sx={{ minWidth: 0, fontSize: '0.875rem', color: colors.foreground }}>
      {unit}
    </Typography>
    <Typography sx={{ fontSize: '0.9375rem', color: colors.foreground, textAlign: 'right' }}>
      {formatNumber(before)}
    </Typography>
    <Icon icon='tabler:arrow-right' fontSize='1rem' />
    <Typography sx={{ fontSize: '0.9375rem', color: colors.foreground }}>{formatNumber(after)}</Typography>
    <Box sx={{ minWidth: 56, display: 'flex', justifyContent: 'flex-end' }}>{delta ? <DeltaPill value={delta} /> : null}</Box>
  </Box>
)

/**
 * TransformationFields
 * -------------------------------------------------------------------------------------
 * The body of every "Transformasi Produk" dialog (Figma): product header and stock
 * chips, the formula picker, the quantity stepper and the before/after summary.
 *
 * It is controlled — pair it with `useTransformation` and let the dialog own the
 * submit. `rowLabel` ('SO', 'PO', 'POS') names the document line that takes the
 * transformed product; leave it out where there is no line (the stock list).
 */
export default function TransformationFields({
  product,
  formulas,
  formula,
  onSelectFormula,
  qty,
  onQtyChange,
  result,
  qtyReadOnly = false,
  rowLabel,
  priceKey = 'targetBasePrice',
  formulaError
}) {
  const list = Array.isArray(formulas) ? formulas : []
  const unitFrom = formula?.unitFrom?.name || product?.unitName
  const unitTo = formula?.unitTo?.name
  const step = Number(formula?.amountFrom) || 1
  const stock = Number(product?.quantity) || 0
  // ** Most the origin unit can give: whole multiples of `amountFrom` only
  // (41 Slop at 20 Slop = 1 Karton -> 40).
  const maxTransformable = Math.floor(stock / step) * step
  const maxQty = Math.max(maxTransformable, step)
  const currentQty = Number(qty) || 0
  const splits = formula ? Number(formula.amountFrom) <= Number(formula.amountTo) : true
  const price = formula?.[priceKey]
  const hasResult = Boolean(formula) && !result.error
  const tone = product?.quantity !== undefined && product?.quantity !== null ? stockTone(stock, product?.minimumStock) : null
  const warehouseLabel = capitalizeWords(product?.warehouseName)
  const subtitle = [warehouseLabel, product?.rackName && `Rak ${product.rackName}`].filter(Boolean).join(' ')

  const decrease = () => onQtyChange(Math.max(step, (Math.ceil(currentQty / step) - 1) * step))
  const increase = () => onQtyChange(Math.min((Math.floor(currentQty / step) + 1) * step, maxQty))

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      {/* Product */}
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
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontSize: '1rem', fontWeight: 500, lineHeight: '24px', color: colors.foreground }}>
            {product?.productName || '-'}
          </Typography>
          {subtitle && (
            <Typography sx={{ fontSize: '0.75rem', lineHeight: '16px', color: colors.mutedForeground }}>
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Stock */}
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' } }}>
        <StatPill label='Stok Tersedia' value={formatNumber(stock)} tone={tone} />
        <StatPill label='Stok Minimal' value={formatNumber(product?.minimumStock)} />
        <StatPill label='Unit' value={product?.unitName || '-'} />
      </Box>

      {/* Formula */}
      <Box>
        <SectionLabel>Pilih Rumus</SectionLabel>
        {list.length === 0 ? (
          <Typography sx={{ fontSize: '0.8125rem', color: colors.mutedForeground }}>
            Belum ada rumus transformasi untuk produk ini
          </Typography>
        ) : (
          <>
            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' } }}>
              {list.map(item => {
                const selected = item.id === formula?.id

                return (
                  <ButtonBase
                    key={item.id}
                    role='radio'
                    aria-checked={selected}
                    onClick={() => onSelectFormula(item)}
                    sx={{
                      ...surfaceSx,
                      px: 4,
                      py: 2.5,
                      gap: 2,
                      justifyContent: 'space-between',
                      textAlign: 'left',
                      backgroundColor: selected ? stone[100] : colors.background,
                      borderColor: selected ? colors.border3 : colors.border,
                      boxShadow: shadows.xs,
                      '&:hover': { borderColor: colors.border3 }
                    }}
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Typography noWrap sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.foreground }}>
                        {item.unitTo?.name}
                      </Typography>
                      <Typography noWrap sx={{ fontSize: '0.75rem', color: colors.mutedForeground }}>
                        Stok {formatNumber(item.targetQuantity)}
                      </Typography>
                    </Box>
                    <Radio checked={selected} disableRipple tabIndex={-1} sx={{ p: 0, pointerEvents: 'none' }} />
                  </ButtonBase>
                )
              })}
            </Box>
            {formulaError && (
              <Typography sx={{ mt: 2, fontSize: '0.75rem', color: status.danger.fg }}>{formulaError}</Typography>
            )}
            {formula && (
              <Box
                sx={{
                  mt: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1.5,
                  fontSize: '0.8125rem',
                  color: colors.mutedForeground
                }}
              >
                <Icon icon={splits ? 'tabler:arrow-down' : 'tabler:arrow-up'} fontSize='1rem' />
                <span>{splits ? 'Dipecah ke kemasan lebih kecil' : 'Digabung ke kemasan lebih besar'}</span>
                <Typography component='span' sx={{ fontSize: 'inherit', fontWeight: 600, color: colors.foreground }}>
                  {formatNumber(formula.amountFrom)} {unitFrom} = {formatNumber(formula.amountTo)} {unitTo}
                </Typography>
              </Box>
            )}
          </>
        )}
      </Box>

      {/* Quantity */}
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 2, mb: 2 }}>
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: colors.foreground }}>
            Jumlah yang ditransformasi
          </Typography>
          {formula && (
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: colors.foreground }}>
              Max ({formatNumber(maxTransformable)})
            </Typography>
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          {!qtyReadOnly && (
            <IconButton
              aria-label='Kurangi jumlah'
              onClick={decrease}
              disabled={!formula || currentQty <= step}
              sx={stepperButtonSx}
            >
              <Icon icon='tabler:minus' fontSize='1.125rem' />
            </IconButton>
          )}
          <Box
            sx={{
              ...surfaceSx,
              flex: 1,
              minWidth: 0,
              height: 40,
              px: 4,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              borderRadius: `${radii.full}px`,
              borderColor: result.error && formula ? status.danger.fg : colors.border
            }}
          >
            <InputBase
              fullWidth
              readOnly={qtyReadOnly}
              value={qty}
              onChange={event => {
                const digits = event.target.value.replace(/\D/g, '')
                onQtyChange(digits === '' ? '' : Number(digits))
              }}
              inputProps={{ inputMode: 'numeric', 'aria-label': 'Jumlah', style: { textAlign: 'center' } }}
              sx={{ fontSize: '0.9375rem', color: colors.foreground }}
            />
            <Typography sx={{ fontSize: '0.875rem', color: colors.mutedForeground }}>{unitFrom}</Typography>
          </Box>
          {!qtyReadOnly && (
            <IconButton
              aria-label='Tambah jumlah'
              onClick={increase}
              disabled={!formula || currentQty >= maxQty}
              sx={stepperButtonSx}
            >
              <Icon icon='tabler:plus' fontSize='1.125rem' />
            </IconButton>
          )}
        </Box>
        {formula && result.error && (
          <Typography sx={{ mt: 2, fontSize: '0.75rem', color: status.danger.fg }}>{result.error}</Typography>
        )}
      </Box>

      {/* Result */}
      <Box sx={{ ...surfaceSx, p: 4, boxShadow: shadows.xs, backgroundColor: stone[50] }}>
        <Typography sx={{ fontSize: '0.875rem', color: colors.foreground, mb: 3 }}>Hasil Transformasi</Typography>
        {formula ? (
          <>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) auto auto auto auto',
                alignItems: 'center',
                columnGap: 3,
                rowGap: 2.5
              }}
            >
              <StockRow
                unit={unitFrom}
                before={stock}
                after={hasResult ? stock - result.from : stock}
                delta={hasResult ? -result.from : 0}
              />
              <StockRow
                unit={unitTo}
                before={formula.targetQuantity}
                after={hasResult ? (Number(formula.targetQuantity) || 0) + result.to : formula.targetQuantity}
                delta={hasResult ? result.to : 0}
              />
            </Box>
            {hasResult && (
              <Box sx={{ mt: 3, pt: 3, borderTop: `1px solid ${colors.border3}` }}>
                <Typography sx={{ fontSize: '0.8125rem', color: colors.foreground }}>
                  <b>
                    {formatNumber(result.from)} {unitFrom}
                  </b>{' '}
                  jadi{' '}
                  <Box component='b' sx={{ color: status.success.fg }}>
                    {formatNumber(result.to)} {unitTo}
                  </Box>
                </Typography>
                {rowLabel && (
                  <Typography sx={{ mt: 1, fontSize: '0.8125rem', color: colors.mutedForeground }}>
                    Baris {rowLabel} berubah menjadi {formatNumber(result.to)} {unitTo}
                    {price !== null && price !== undefined ? ` @ Rp ${formatNumber(price)}` : ''}.
                  </Typography>
                )}
              </Box>
            )}
          </>
        ) : (
          <Typography sx={{ fontSize: '0.8125rem', color: colors.mutedForeground }}>
            Pilih rumus untuk melihat hasil transformasi
          </Typography>
        )}
      </Box>
    </Box>
  )
}

export const stepperButtonSx = {
  width: 40,
  height: 40,
  flexShrink: 0,
  backgroundColor: 'primary.main',
  color: 'primary.contrastText',
  '&:hover': { backgroundColor: 'primary.dark' },
  '&.Mui-disabled': { backgroundColor: colors.border, color: colors.mutedForeground }
}
