// ** MUI Imports
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Local Components
import BoxCode from './BoxCode'

// ** Design Tokens
import { colors, radii, shadows, status, stone } from 'src/configs/designTokens'

/**
 * Visual treatment per entry kind. A deletion always reads as destructive,
 * otherwise the adjustment direction decides: PLUS adds stock, MINUS removes it,
 * and anything else (INITIATE) is neutral.
 */
const entryTone = ({ deleted, adjustmentType }) => {
  if (deleted) return { ...status.danger, icon: 'tabler:trash', sign: '' }
  if (adjustmentType === 'PLUS') return { ...status.success, icon: 'tabler:plus', sign: '+' }
  if (adjustmentType === 'MINUS') return { ...status.danger, icon: 'tabler:minus', sign: '-' }

  return { fg: stone[600], bg: stone[100], border: colors.border, icon: 'tabler:check', sign: '' }
}

/**
 * TimelineItemHistory
 * -------------------------------------------------------------------------------------
 * One entry in a product's stock history: a coloured marker on a vertical rail,
 * the event title with its quantity delta, and a details panel beside the note.
 *
 * Replaces the MUI Lab `TimelineItem` layout, which stacked labels without a
 * clear grouping and rendered every reference as plain text.
 */
export default function TimelineItemHistory(props) {
  const { index, length, deleted, adjustmentType, quantity, product, notes } = props
  const tone = entryTone({ deleted, adjustmentType })
  const isLast = index === length - 1
  const unit = product?.unitName ? product.unitName.toLowerCase() : ''

  // ** The API pre-formats each reference as "<label>: <code>"; only the ones
  // present on this entry render.
  const references = [
    { value: props.outstanding, url: `/receipt-order-outstanding/${props.outstandingCode}`, clickable: true },
    { value: props.formula },
    { value: props.goodsIn },
    { value: props.deliveryOrder, url: `/delivery-order/${props.deliveryOrderCode}`, clickable: true },
    { value: props.stockOpname, url: `/stock-opname/${props.stockOpnameCode}`, clickable: true },
    {
      value: props.deliveryOrderReceipt,
      url: `/receive-order/${props.deliveryOrderReceiptCode}`,
      clickable: true
    },
    { value: props.goodsOut, url: `/adjustment/goods-out/${props.goodsOutCode}`, clickable: true },
    { value: props.salesOrder, url: `/sales-order/${props.salesOrderCode}`, clickable: true },
    { value: props.purchaseOrder, url: `/purchase-order/${props.purchaseOrderCode}`, clickable: true },
    { value: props.pointOfSale }
  ].filter(reference => reference.value)

  return (
    <Box sx={{ display: 'flex', gap: 3, position: 'relative', pb: isLast ? 0 : 4 }}>
      {/* Rail: marker plus the connector down to the next entry */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
        <Box
          sx={{
            width: 28,
            height: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: `${radii.full}px`,
            backgroundColor: tone.bg,
            border: `1px solid ${tone.border}`,
            color: tone.fg
          }}
        >
          <Icon icon={tone.icon} fontSize='0.875rem' />
        </Box>
        {!isLast && <Box sx={{ flex: 1, width: '1px', backgroundColor: colors.border, mt: 1 }} />}
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        {/* Title row: what happened, the delta, and when */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            mb: 2
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 0 }}>
            <Typography
              sx={{ fontSize: '0.875rem', fontWeight: 600, lineHeight: '20px', color: colors.foreground }}
            >
              {props.title || '-'}
            </Typography>
            {!deleted && quantity !== undefined && quantity !== null && (
              <Chip
                size='small'
                label={`${tone.sign}${quantity}`}
                sx={{
                  height: 20,
                  borderRadius: `${radii.full}px`,
                  backgroundColor: tone.bg,
                  border: `1px solid ${tone.border}`,
                  '& .MuiChip-label': {
                    px: 1.5,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    lineHeight: '16px',
                    color: tone.fg
                  }
                }}
              />
            )}
          </Box>
          <Typography
            sx={{ fontSize: '0.75rem', lineHeight: '16px', color: colors.mutedForeground, whiteSpace: 'nowrap' }}
          >
            {props.date} {props.time}
          </Typography>
        </Box>

        {/* Details panel, with the note alongside it on a wide screen */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: notes ? '1.4fr 1fr' : '1fr' },
            gap: 3,
            alignItems: 'stretch'
          }}
        >
          <Box
            sx={{
              p: 3,
              borderRadius: `${radii.md}px`,
              border: `1px solid ${colors.border}`,
              backgroundColor: stone[50]
            }}
          >
            <Typography
              sx={{ fontSize: '0.75rem', lineHeight: '16px', color: colors.mutedForeground, mb: 1 }}
            >
              {props.createdBy || '-'}
            </Typography>

            <Typography
              sx={{ fontSize: '0.8125rem', lineHeight: '20px', color: colors.foreground }}
            >
              {deleted
                ? props.infoType || '-'
                : `${props.infoType || '-'}${unit ? ` ${unit}` : ''}${
                    props.titleInfo ? ` dari ${props.titleInfo}` : ''
                  }`}
            </Typography>

            {props.description && (
              <Typography sx={{ fontSize: '0.8125rem', lineHeight: '20px', color: colors.foreground, mt: 0.5 }}>
                Deskripsi: {props.description}
              </Typography>
            )}

            <Box sx={{ display: 'flex', gap: 1, alignItems: 'baseline', mt: 0.5, flexWrap: 'wrap' }}>
              <Typography sx={{ fontSize: '0.8125rem', lineHeight: '20px', color: colors.mutedForeground }}>
                Stock Akhir:
              </Typography>
              <Typography
                sx={{ fontSize: '0.8125rem', lineHeight: '20px', fontWeight: 600, color: colors.foreground }}
              >
                {props.lastQuantity} {unit}
              </Typography>
            </Box>

            {references.length > 0 && (
              <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                {references.map((reference, referenceIndex) => (
                  <BoxCode
                    key={referenceIndex}
                    value={reference.value}
                    isClickable={reference.clickable}
                    url={reference.url}
                  />
                ))}
              </Box>
            )}
          </Box>

          {/* Notes were behind an accordion; they are short enough to show inline. */}
          {notes && (
            <Box
              sx={{
                p: 3,
                borderRadius: `${radii.md}px`,
                border: `1px solid ${colors.border}`,
                backgroundColor: colors.background,
                boxShadow: shadows.xs
              }}
            >
              <Typography
                sx={{ fontSize: '0.75rem', lineHeight: '16px', color: colors.mutedForeground, mb: 1 }}
              >
                Catatan
              </Typography>
              <Typography sx={{ fontSize: '0.8125rem', lineHeight: '20px', color: colors.foreground }}>
                {notes}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}
