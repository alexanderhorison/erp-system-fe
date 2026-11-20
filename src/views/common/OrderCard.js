// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Shared Components
import StatusChip from 'src/views/common/StatusChip'
import { Status } from 'src/@core/components/common'

// ** Design Tokens
import { colors, orderCard, radii, shadows, status as statusTokens } from 'src/configs/designTokens'

// ** Statuses that carry a payment state. Pending / rejected documents have not
// produced a receivable or payable yet, so they get no payment outline or chip.
const PAYMENT_STATUSES = ['APPROVED', 'SHIPPED']

/**
 * Payment state of a Sales / Purchase Order list row, or `null` when it has none.
 * `LUNAS` = nothing owed, `BELUM_LUNAS` = nothing paid yet, `SEBAGIAN` = partly paid.
 */
export const getPaymentState = row => {
  if (!PAYMENT_STATUSES.includes(row?.status)) return null
  if (row?.amountDebt == null) return null
  if (Number(row.amountDebt) === 0) return 'LUNAS'
  if (Number(row.grandTotal) === Number(row.amountDebt)) return 'BELUM_LUNAS'

  return 'SEBAGIAN'
}

const PAYMENT_CHIP = {
  LUNAS: { label: 'Lunas', tone: 'success' },
  BELUM_LUNAS: { label: 'Belum Lunas', tone: 'danger' },
  SEBAGIAN: { label: 'Sebagian Lunas', tone: 'warning' }
}

export const isCreatedToday = createdAt => {
  if (!createdAt) return false
  const created = new Date(createdAt)
  if (isNaN(created)) return false

  return created.toDateString() === new Date().toDateString()
}

/** dd/MM/yyyy from a timestamp or date string; falls back to the raw text, or '-' when empty. */
export const formatShortDate = value => {
  if (!value) return '-'
  const date = new Date(value)
  if (isNaN(date)) return String(value)

  return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date)
}

const formatRupiah = value => `Rp ${new Intl.NumberFormat('id-ID').format(Number(value) || 0)}`

const labelSx = { fontSize: '0.8125rem', lineHeight: '20px', color: colors.mutedForeground }
const valueSx = { fontSize: '0.875rem', lineHeight: '20px', fontWeight: 500, color: colors.foreground }

const actionSx = {
  flex: 1,
  minWidth: 0,
  color: colors.foreground,
  borderColor: colors.border3,
  boxShadow: shadows.xs,
  '&:hover': { borderColor: colors.border3 }
}

/**
 * OrderCard
 * -------------------------------------------------------------------------------------
 * One Sales / Purchase Order in the card layout of its list page.
 *
 * Outline follows the payment state (green = Lunas, red = not fully paid; no
 * payment state = neutral border). A document created today carries a "Dibuat hari ini"
 * pill sitting on the top edge of the card.
 *
 * Props
 *  - name, phone, code, status          header content
 *  - subtitle                           optional italic note under the code (e.g. Loan Stock SO)
 *  - dates                              [{ label, value }] shown in one row
 *  - totalLabel / total, barter, grandTotal   the Orders block; `barter` hides when falsy
 *  - payment                            result of `getPaymentState(row)`
 *  - isToday                            show the "Dibuat hari ini" pill
 *  - onView / onEdit                    `onEdit` omitted → only "Lihat Detail", full width
 */
export default function OrderCard({
  name,
  phone,
  code,
  status,
  subtitle,
  dates = [],
  totalLabel,
  total,
  barter,
  grandTotal,
  payment,
  isToday,
  onView,
  onEdit
}) {
  const borderColor = payment === 'LUNAS' ? orderCard.paid : payment ? orderCard.unpaid : colors.border
  const chip = payment ? PAYMENT_CHIP[payment] : null

  return (
    <Box
      onClick={onView}
      sx={{
        p: 4,
        gap: 3,
        flex: 1,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        borderRadius: `${radii['3xl']}px`,
        border: `1px solid ${borderColor}`,
        boxShadow: shadows.xs,
        position: 'relative',
        backgroundColor: colors.background
      }}
    >
      {isToday && (
        <Box
          sx={{
            top: -12,
            left: 16,
            px: 2,
            gap: 1,
            height: 24,
            display: 'flex',
            position: 'absolute',
            alignItems: 'center',
            borderRadius: `${radii.full}px`,
            border: `1px solid ${statusTokens.info.border}`,
            // Opaque, so the card's outline does not show through behind the pill.
            backgroundColor: statusTokens.info.bg,
            color: statusTokens.info.fg
          }}
        >
          <Icon icon='tabler:circle-check' fontSize='0.875rem' />
          <Typography sx={{ fontSize: '0.75rem', lineHeight: '16px', color: 'inherit' }}>Dibuat hari ini</Typography>
        </Box>
      )}

      {/* Name + code, phone + statuses */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box
          sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}
        >
          <Typography
            sx={{
              minWidth: 0,
              fontSize: '1rem',
              lineHeight: '24px',
              fontWeight: 600,
              color: colors.foreground,
              overflowWrap: 'anywhere'
            }}
          >
            {name || '-'}
          </Typography>
          <Box sx={{ textAlign: 'right' }}>
            <Typography sx={{ ...labelSx, fontSize: '0.875rem' }}>{code}</Typography>
            {subtitle && (
              <Typography sx={{ fontSize: '0.75rem', fontStyle: 'italic', color: colors.mutedForeground }}>
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
          <Typography sx={labelSx}>{phone || '-'}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            {status && <Status status={status} />}
            {chip && <StatusChip label={chip.label} tone={chip.tone} />}
          </Box>
        </Box>
      </Box>

      {/* Dates */}
      <Box sx={{ display: 'grid', gridTemplateColumns: `repeat(${dates.length || 1}, minmax(0, 1fr))`, gap: 3 }}>
        {dates.map(item => (
          <Box key={item.label} sx={{ minWidth: 0 }}>
            <Typography sx={{ ...valueSx, fontSize: '0.8125rem' }}>{item.label}</Typography>
            <Typography sx={labelSx}>{item.value || '-'}</Typography>
          </Box>
        ))}
      </Box>

      <Divider sx={{ borderColor: colors.border }} />

      {/* Orders */}
      <Box>
        <Typography sx={{ ...valueSx, mb: 1 }}>Orders</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, py: 0.5 }}>
          <Typography sx={labelSx}>{totalLabel}</Typography>
          <Typography sx={valueSx}>{formatRupiah(total)}</Typography>
        </Box>
        {Number(barter) > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, py: 0.5 }}>
            <Typography sx={labelSx}>Total Barter</Typography>
            <Typography sx={valueSx}>- {formatRupiah(barter)}</Typography>
          </Box>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, pt: 1 }}>
          <Typography sx={{ fontSize: '1rem', lineHeight: '24px', fontWeight: 600, color: colors.foreground }}>
            Grand Total
          </Typography>
          <Typography
            sx={{
              fontSize: '1rem',
              lineHeight: '24px',
              fontWeight: 600,
              color: Number(grandTotal) < 0 ? colors.destructive : colors.foreground
            }}
          >
            {formatRupiah(grandTotal)}
          </Typography>
        </Box>
      </Box>

      {/* Actions */}
      <Box onClick={event => event.stopPropagation()} sx={{ display: 'flex', gap: 2, mt: 'auto' }}>
        <Button
          variant='outlined'
          color='secondary'
          onClick={onView}
          startIcon={<Icon icon='tabler:eye' fontSize='1rem' />}
          sx={actionSx}
        >
          Lihat Detail
        </Button>
        {onEdit && (
          <Button
            variant='outlined'
            color='secondary'
            onClick={onEdit}
            startIcon={<Icon icon='tabler:edit' fontSize='1rem' />}
            sx={actionSx}
          >
            Ubah
          </Button>
        )}
      </Box>
    </Box>
  )
}
