// ** MUI Imports
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import TableContainer from '@mui/material/TableContainer'

// ** Configs & Helpers
import Logo from 'src/icons/logo'
import { LinkStyled } from 'src/pages/components/swiper'
import { returnFormatDate, returnFormatTime } from 'src/helpers/formatDate'

// ** Shared Components
import HeaderedCard from 'src/views/common/HeaderedCard'

// ** Design Tokens
import { colors, radii, shadows, stone } from 'src/configs/designTokens'

/**
 * OrderDocumentParts
 * -------------------------------------------------------------------------------------
 * The building blocks of the Sales Order / Purchase Order document, shared so both
 * detail pages keep one layout. The backend PDF (`erp-system-be/template/export/
 * TemplatePdfOrderDocument.js`) draws the same structure — keep the two in step:
 *
 *   Letterhead → info boxes → item tables → Catatan / Informasi Pembayaran / totals → signatures
 */

export const mutedSx = {
  fontSize: '0.8125rem',
  lineHeight: '20px',
  color: colors.mutedForeground
}

const bodyTextSx = { fontSize: '0.875rem', lineHeight: '20px', color: colors.foreground }

/** Company logo + name and address on the left, document title + code on the right. */
export const OrderLetterhead = ({ company, title, code, note, reference }) => {
  const addressLine = [company?.address, company?.city].filter(Boolean).join(' ')

  return (
    <Box
      sx={{
        gap: 4,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexWrap: 'wrap'
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Logo width={28} />
          <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: colors.foreground }}>
            {company?.companyName?.toUpperCase()}
          </Typography>
        </Box>
        {addressLine && <Typography sx={mutedSx}>{addressLine}</Typography>}
        {company?.phoneNumber && <Typography sx={mutedSx}>{company.phoneNumber}</Typography>}
      </Box>

      <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
        <Typography sx={{ fontSize: '1.25rem', lineHeight: '28px', fontWeight: 600, color: colors.foreground }}>
          {title}
        </Typography>
        <Typography sx={{ ...mutedSx, fontSize: '0.875rem' }}>{code}</Typography>
        {note && <Typography sx={{ ...mutedSx, fontStyle: 'italic' }}>{note}</Typography>}
        {/* `reference` links to the document this one came from: { label, href, code } */}
        {reference?.code && (
          <Box sx={{ mt: 1 }}>
            <Typography sx={mutedSx}>{reference.label}</Typography>
            <LinkStyled href={reference.href} target='_blank'>
              {reference.code}
            </LinkStyled>
          </Box>
        )}
      </Box>
    </Box>
  )
}

/**
 * Row of headered boxes (billing party, dates). `boxes` is `[{ title, flex, content }]`;
 * `flex` is the relative width on tablet and up (the boxes stack on phones).
 */
export const OrderInfoBoxes = ({ boxes }) => (
  <Box
    sx={{
      gap: 4,
      display: 'grid',
      gridTemplateColumns: {
        xs: 'minmax(0, 1fr)',
        sm: boxes.map(box => `minmax(0, ${box.flex || 1}fr)`).join(' ')
      }
    }}
  >
    {boxes.map(box => (
      <HeaderedCard key={box.title} title={box.title} contentSx={{ p: 4 }}>
        {box.content}
      </HeaderedCard>
    ))}
  </Box>
)

const cellSx = { fontSize: '0.875rem', color: colors.foreground, borderColor: colors.border, verticalAlign: 'middle' }
const headCellSx = { fontSize: '0.875rem', fontWeight: 600, color: colors.foreground, borderColor: colors.border }

/** Product cell: name, then "Rak: x • Unit: y" on one muted line. */
export const productCell = item => (
  <>
    <Typography sx={{ ...bodyTextSx, overflowWrap: 'anywhere' }}>{item?.productName}</Typography>
    <Typography sx={{ ...mutedSx, fontSize: '0.75rem', lineHeight: '16px', mt: 0.5 }}>
      Rak: {item?.rackName || '-'} • Unit: {item?.unitName || '-'}
    </Typography>
  </>
)

// Indonesian grouping (Rp 24.000.000), same as the backend PDF.
export const money = value => `Rp ${new Intl.NumberFormat('id-ID').format(Number(value) || 0)}`

/**
 * Titled item table with an "N Items" counter.
 * `columns`: `[{ header, render(item, index), align?, nowrap?, strong? }]`.
 */
export const OrderItemsTable = ({ title, items = [], columns }) => (
  <Box>
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 3 }}>
      <Typography sx={{ fontSize: '1rem', fontWeight: 600, lineHeight: '24px', color: colors.foreground }}>
        {title}
      </Typography>
      <Typography sx={{ ...mutedSx, whiteSpace: 'nowrap' }}>{items.length} Items</Typography>
    </Box>

    <TableContainer
      sx={{
        '&&': { borderRadius: `${radii['3xl']}px` },
        border: `1px solid ${colors.border}`,
        boxShadow: shadows.xs,
        overflowX: 'auto'
      }}
    >
      <Table size='small'>
        <TableHead sx={{ backgroundColor: stone[100], textTransform: 'none' }}>
          <TableRow>
            {columns.map(column => (
              <TableCell key={column.header} align={column.align} sx={headCellSx}>
                {column.header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={index} sx={{ '&:last-of-type td': { borderBottom: 0 } }}>
              {columns.map(column => (
                <TableCell
                  key={column.header}
                  align={column.align}
                  sx={{
                    ...cellSx,
                    fontWeight: column.strong ? 500 : 400,
                    whiteSpace: column.nowrap ? 'nowrap' : 'normal'
                  }}
                >
                  {column.render(item, index)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
)

/**
 * Catatan, Informasi Pembayaran and the totals card, side by side.
 * `payment` is the lines under Informasi Pembayaran; `totals` is `[{ label, value }]`
 * above the Grand Total footer strip.
 */
export const OrderSummaryRow = ({ notes, payment = [], totals = [], grandTotal }) => (
  <Box
    sx={{
      gap: 4,
      display: 'grid',
      alignItems: 'stretch',
      gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'repeat(3, minmax(0, 1fr))' }
    }}
  >
    <HeaderedCard title='Catatan' sx={{ display: 'flex', flexDirection: 'column' }} contentSx={{ p: 4, flex: 1 }}>
      <Typography sx={{ ...mutedSx, whiteSpace: 'pre-wrap' }}>{notes || '-'}</Typography>
    </HeaderedCard>

    <HeaderedCard
      title='Informasi Pembayaran'
      sx={{ display: 'flex', flexDirection: 'column' }}
      contentSx={{ p: 4, flex: 1 }}
    >
      {payment.length > 0 ? (
        payment.map((line, index) => (
          <Typography key={index} sx={mutedSx}>
            {line}
          </Typography>
        ))
      ) : (
        <Typography sx={mutedSx}>-</Typography>
      )}
    </HeaderedCard>

    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        borderRadius: `${radii['3xl']}px`,
        border: `1px solid ${colors.border}`,
        backgroundColor: colors.background,
        boxShadow: shadows.xs
      }}
    >
      <Box sx={{ p: 4, flex: 1 }}>
        {totals.map(row => (
          <Box key={row.label} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, py: 0.5 }}>
            <Typography sx={bodyTextSx}>{row.label}</Typography>
            <Typography sx={{ fontSize: '0.9375rem', fontWeight: 500, color: colors.foreground }}>
              {row.value}
            </Typography>
          </Box>
        ))}
      </Box>
      <Box
        sx={{
          px: 4,
          py: 3,
          gap: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: stone[100],
          borderTop: `1px solid ${colors.border}`
        }}
      >
        <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: colors.foreground }}>Grand Total</Typography>
        <Typography
          sx={{
            fontSize: '1rem',
            fontWeight: 600,
            color: grandTotal < 0 ? colors.destructive : colors.foreground
          }}
        >
          {money(grandTotal)}
        </Typography>
      </Box>
    </Box>
  </Box>
)

// ** No name = the counterparty's block: an empty gap to sign in, then a centred ( ) with room to write a name by hand.
const SignatureBlock = ({ label, name, title }) => (
  <Box sx={{ textAlign: 'center', width: '100%', maxWidth: 220 }}>
    <Typography sx={{ fontSize: '1rem', fontWeight: 500, color: colors.foreground, mb: 14 }}>{label}</Typography>
    <Box sx={{ borderTop: `1px solid ${colors.border3}`, pt: 1 }}>
      {name ? (
        <Typography sx={{ ...bodyTextSx, fontWeight: 500 }}>{name}</Typography>
      ) : (
        // Centred brackets with room between them to write a name by hand.
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: 120, mx: 'auto' }}>
          <Typography sx={bodyTextSx}>(</Typography>
          <Typography sx={bodyTextSx}>)</Typography>
        </Box>
      )}
      {title && <Typography sx={mutedSx}>{title}</Typography>}
    </Box>
  </Box>
)

/** Two signature blocks: the counterparty on the left, the company signatory on the right. */
export const OrderSignatures = ({ leftLabel, company }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-around', gap: 4, flexWrap: 'wrap', pt: 6, pb: 2 }}>
    <SignatureBlock label={leftLabel} />
    <SignatureBlock label='Dengan Hormat,' name={company?.ownerName} title={company?.ownerTitle} />
  </Box>
)

/** The outer card every order-style document sits in: sections stacked with an even gap. */
export const OrderDocumentCard = ({ children }) => (
  <Card
    elevation={0}
    sx={{
      p: 5,
      gap: 6,
      display: 'flex',
      flexDirection: 'column',
      borderRadius: `${radii['3xl']}px`,
      border: `1px solid ${colors.border}`,
      boxShadow: shadows.xs
    }}
  >
    {children}
  </Card>
)

/** Name + location of a warehouse, for an info box body. */
export const WarehouseInfo = ({ name, location }) => (
  <>
    <Typography sx={mutedSx}>{name || '-'}</Typography>
    {location && <Typography sx={mutedSx}>{location}</Typography>}
  </>
)

/** Full-width Catatan card. Pass `children` for custom content (e.g. an editable field). */
export const OrderNotes = ({ notes, children }) => (
  <HeaderedCard title='Catatan' contentSx={{ p: 4 }}>
    {children || <Typography sx={{ ...mutedSx, whiteSpace: 'pre-wrap' }}>{notes || '-'}</Typography>}
  </HeaderedCard>
)

const StampedSignature = ({ label, name, timestamp }) => (
  <Box sx={{ textAlign: 'center', width: '100%', maxWidth: 220 }}>
    <Typography sx={{ fontSize: '1rem', fontWeight: 500, color: colors.foreground, mb: 14 }}>{label}</Typography>
    <Box sx={{ borderTop: `1px solid ${colors.border3}`, pt: 1 }}>
      <Typography sx={{ ...bodyTextSx, fontWeight: 500 }}>{name || '-'}</Typography>
      <Typography sx={mutedSx}>
        {timestamp ? `${returnFormatDate(timestamp)}, ${returnFormatTime(timestamp)}` : '-'}
      </Typography>
    </Box>
  </Box>
)

/**
 * Signature blocks for documents signed by named users: `[{ label, name, timestamp }]`.
 * A lone block sits in the right-hand column, where the second signer would be.
 */
export const OrderSignatureRow = ({ blocks }) =>
  blocks.length === 1 ? (
    <Box
      sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, justifyItems: 'center', pt: 6, pb: 2 }}
    >
      <Box sx={{ gridColumn: { xs: 'auto', sm: 2 }, width: '100%', display: 'flex', justifyContent: 'center' }}>
        <StampedSignature {...blocks[0]} />
      </Box>
    </Box>
  ) : (
    <Box sx={{ display: 'flex', justifyContent: 'space-around', gap: 4, flexWrap: 'wrap', pt: 6, pb: 2 }}>
      {blocks.map(block => (
        <StampedSignature key={block.label} {...block} />
      ))}
    </Box>
  )
