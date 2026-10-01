// ** React Imports
import { useState, useEffect, useMemo } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'

import Icon from 'src/@core/components/icon'
import { priceFormatWIthCurrency } from 'src/helpers/priceFormatter'

// ** Shared Components
import AppModal from 'src/views/common/AppModal'
import DataTable from 'src/views/common/DataTable'
import HeaderedCard from 'src/views/common/HeaderedCard'
import StatusChip from 'src/views/common/StatusChip'

// ** Design Tokens
import { colors, radii, shadows, status as statusTokens } from 'src/configs/designTokens'

/**
 * ModalPriceValidation
 *
 * Ditampilkan setelah backend memvalidasi harga produk yang memiliki MasterProductPriceId.
 *
 * Props:
 *  - open: boolean
 *  - onClose: () => void
 *  - onConfirm: (appliedItems: Array<{warehouseProductId, backendPrice}>) => void
 *  - validationResult: Array<{
 *      productName: string,
 *      unitName: string,
 *      warehouseProductId: string|number,
 *      MasterProductPriceId: string|number,
 *      quantity: number,
 *      cartPrice: number,
 *      backendPrice: number,
 *      cartSubTotal: number,
 *      backendSubTotal: number,
 *      isPriceDifferent: boolean
 *    }>
 */
export default function ModalPriceValidation({ open, onClose, onConfirm, validationResult = [] }) {
  // key = cartIndex (index posisi item di cart), value = boolean (apply backend price)
  // Menggunakan cartIndex (bukan warehouseProductId) agar item duplikat tidak saling override
  const [applyMap, setApplyMap] = useState({})
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 })

  // Default: centang semua item yang harganya berbeda (isPriceDifferent)
  useEffect(() => {
    if (open && validationResult.length > 0) {
      const initial = {}
      validationResult.forEach(item => {
        initial[item.cartIndex] = !!item.isPriceDifferent
      })
      setApplyMap(initial)
    }
  }, [open, validationResult])

  const toggleApply = cartIndex => setApplyMap(prev => ({ ...prev, [cartIndex]: !prev[cartIndex] }))

  const toggleAll = checked => {
    const next = {}
    validationResult.forEach(item => {
      // Hanya item yang harganya berbeda yang bisa di-toggle
      if (item.isPriceDifferent) next[item.cartIndex] = checked
    })
    setApplyMap(prev => ({ ...prev, ...next }))
  }

  const diffItems = validationResult.filter(i => i.isPriceDifferent)
  const allDiffChecked = diffItems.length > 0 && diffItems.every(i => applyMap[i.cartIndex])
  const someDiffChecked = diffItems.some(i => applyMap[i.cartIndex])

  // Hitung impact: selisih subTotal untuk item yang akan di-apply
  const impact = useMemo(() => {
    let cartTotal = 0
    let afterApplyTotal = 0
    validationResult.forEach(item => {
      cartTotal += Number(item.cartSubTotal ?? item.cartPrice * item.quantity)
      if (applyMap[item.cartIndex]) {
        afterApplyTotal += Number(item.backendSubTotal ?? item.backendPrice * item.quantity)
      } else {
        afterApplyTotal += Number(item.cartSubTotal ?? item.cartPrice * item.quantity)
      }
    })
    return { cartTotal, afterApplyTotal, delta: afterApplyTotal - cartTotal }
  }, [applyMap, validationResult])

  const handleConfirm = () => {
    const appliedItems = validationResult
      .filter(item => applyMap[item.cartIndex])
      .map(item => ({
        cartIndex: item.cartIndex,
        warehouseProductId: item.warehouseProductId,
        backendPrice: item.backendPrice
      }))
    onConfirm(appliedItems)
  }

  if (validationResult.length === 0) return null

  const summaryRows = [
    { label: 'Sub Total Keranjang', value: priceFormatWIthCurrency(impact.cartTotal) },
    { label: 'Subtotal Setelah Apply', value: priceFormatWIthCurrency(impact.afterApplyTotal) }
  ]

  const rows = validationResult.map((item, idx) => ({ ...item, id: item.cartIndex ?? idx }))

  const columns = [
    {
      field: 'select',
      width: 64,
      sortable: false,
      disableColumnMenu: true,
      renderHeader: () =>
        diffItems.length > 0 ? (
          <Checkbox
            size='small'
            sx={{ p: 0 }}
            checked={allDiffChecked}
            indeterminate={!allDiffChecked && someDiffChecked}
            onChange={e => toggleAll(e.target.checked)}
          />
        ) : null,
      renderCell: ({ row }) => (
        <Checkbox
          size='small'
          sx={{ p: 0 }}
          checked={!!applyMap[row.cartIndex]}
          disabled={!row.isPriceDifferent}
          onChange={() => toggleApply(row.cartIndex)}
        />
      )
    },
    {
      field: 'productName',
      headerName: 'Produk',
      flex: 1.3,
      minWidth: 170,
      renderCell: ({ row }) => (
        <Box sx={{ py: 1, lineHeight: 1.3, minWidth: 0 }}>
          <Typography sx={{ fontSize: '0.8125rem', fontWeight: 500, lineHeight: 1.3, color: colors.foreground }}>
            {row.productName || '-'}
          </Typography>
          <Typography sx={{ fontSize: '0.6875rem', color: colors.mutedForeground }}>
            {row.unitName || row.notes || '-'}
          </Typography>
        </Box>
      )
    },
    {
      field: 'quantity',
      headerName: 'Qty',
      width: 90,
      sortable: false,
      renderCell: ({ row }) => Number(row.quantity ?? 1)
    },
    {
      field: 'cartPrice',
      headerName: 'Harga Keranjang',
      flex: 1,
      minWidth: 150,
      sortable: false,
      align: 'right',
      headerAlign: 'right',
      renderCell: ({ row }) => {
        const isDiff = !!row.isPriceDifferent
        const isApplied = !!applyMap[row.cartIndex]
        const priceDelta = Number(row.backendPrice) - Number(row.cartPrice)
        const qty = Number(row.quantity ?? 1)
        const cartSubTotal = Number(row.cartSubTotal ?? row.cartPrice * qty)
        const struck = isDiff && isApplied

        return (
          <Box sx={{ textAlign: 'right', lineHeight: 1.3 }}>
            <Typography
              sx={{
                fontSize: '0.8125rem',
                fontWeight: 500,
                lineHeight: 1.3,
                textDecoration: struck ? 'line-through' : 'none',
                color: isDiff ? (priceDelta > 0 ? statusTokens.danger.fg : statusTokens.success.fg) : colors.foreground
              }}
            >
              {priceFormatWIthCurrency(row.cartPrice)}
            </Typography>
            <Typography
              sx={{
                fontSize: '0.6875rem',
                color: colors.mutedForeground,
                textDecoration: struck ? 'line-through' : 'none'
              }}
            >
              ({priceFormatWIthCurrency(cartSubTotal)})
            </Typography>
          </Box>
        )
      }
    },
    {
      field: 'backendPrice',
      headerName: 'Harga Sistem',
      flex: 1,
      minWidth: 150,
      sortable: false,
      align: 'right',
      headerAlign: 'right',
      renderCell: ({ row }) => {
        const isDiff = !!row.isPriceDifferent
        const qty = Number(row.quantity ?? 1)
        const backendSubTotal = Number(row.backendSubTotal ?? row.backendPrice * qty)

        return (
          <Box sx={{ textAlign: 'right', lineHeight: 1.3 }}>
            <Typography
              sx={{
                fontSize: '0.8125rem',
                fontWeight: isDiff ? 700 : 500,
                lineHeight: 1.3,
                color: colors.foreground
              }}
            >
              {priceFormatWIthCurrency(row.backendPrice)}
            </Typography>
            <Typography sx={{ fontSize: '0.6875rem', color: colors.mutedForeground }}>
              ({priceFormatWIthCurrency(backendSubTotal)})
            </Typography>
          </Box>
        )
      }
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      sortable: false,
      renderCell: ({ row }) => {
        if (!row.isPriceDifferent) return <StatusChip label='Sesuai' tone='success' />
        if (applyMap[row.cartIndex]) return <StatusChip label='Diperbarui' tone='warning' />

        return <StatusChip isActive={false} inactiveLabel='Diabaikan' />
      }
    }
  ]

  return (
    <AppModal
      open={open}
      onClose={onClose}
      // Rows are checked inside AppModal's <form>; confirming goes through the footer button only.
      onSubmit={event => {
        event.preventDefault()
        handleConfirm()
      }}
      title='Validasi Harga Produk'
      subtitle='Berikut perbandingan harga keranjang vs harga terkini dari sistem. Centang produk yang ingin diperbarui, lalu klik "Terapkan" untuk kembali ke keranjang dan charge seperti biasa.'
      size='md'
      cancelLabel='Batal'
      submitLabel='Terapkan & Kembali ke Keranjang'
      submitIcon='tabler:check'
    >
      {/* ── Info note ── */}
      <Box
        sx={{
          mb: 4,
          px: 3,
          py: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          borderRadius: `${radii['3xl']}px`,
          border: `1px solid ${statusTokens.info.border}`,
          backgroundColor: statusTokens.info.bg
        }}
      >
        <Icon icon='tabler:info-circle' fontSize='1rem' style={{ color: statusTokens.info.fg, flexShrink: 0 }} />
        <Typography sx={{ fontSize: '0.75rem', lineHeight: '16px', color: statusTokens.info.fg }}>
          Produk yang <strong>dicentang</strong> akan diperbarui harganya di keranjang. Setelah klik{' '}
          <strong>"Terapkan"</strong>, Anda akan kembali ke keranjang untuk memeriksa ulang sebelum charge.
        </Typography>
      </Box>

      {/* ── Summary chips + table ── */}
      <Box sx={{ mb: 4 }}>
        <DataTable
          itemLabel='datas'
          toolbar={
            <Box sx={{ p: 4, pb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <SummaryChip tone='info' icon='tabler:package' label={`${validationResult.length} Produk dicek`} />
              <SummaryChip
                tone={diffItems.length > 0 ? 'warning' : 'success'}
                icon='tabler:alert-triangle'
                label={`${diffItems.length} Harga berbeda`}
              />
              <SummaryChip
                tone='success'
                icon='tabler:check'
                label={`${validationResult.length - diffItems.length} Harga sesuai`}
              />
            </Box>
          }
          columns={columns}
          rows={rows}
          rowHeight={64}
          disableColumnMenu
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5]}
          getRowClassName={({ row }) =>
            !row.isPriceDifferent ? 'row-same' : applyMap[row.cartIndex] ? 'row-applied' : ''
          }
          sx={{
            '&& .MuiDataGrid-row.row-same, && .MuiDataGrid-row.row-same:hover': {
              backgroundColor: statusTokens.success.bg
            },
            '&& .MuiDataGrid-row.row-applied, && .MuiDataGrid-row.row-applied:hover': {
              backgroundColor: statusTokens.warning.bg
            }
          }}
        />
      </Box>

      {/* ── Impact Summary ── */}
      <HeaderedCard title='Ringkasan'>
        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {summaryRows.map(row => (
            <Box key={row.label} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
              <Typography sx={{ fontSize: '0.8125rem', color: colors.mutedForeground }}>{row.label}</Typography>
              <Typography sx={{ fontSize: '0.8125rem', color: colors.foreground }}>{row.value}</Typography>
            </Box>
          ))}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
            <Typography sx={{ fontSize: '0.9375rem', fontWeight: 500, color: colors.foreground }}>Selisih</Typography>
            <Typography
              sx={{
                fontSize: '0.9375rem',
                fontWeight: 700,
                color: impact.delta > 0 ? colors.destructive : statusTokens.success.fg
              }}
            >
              {impact.delta === 0 ? '–' : `${impact.delta > 0 ? '+' : ''}${priceFormatWIthCurrency(impact.delta)}`}
            </Typography>
          </Box>
        </Box>
      </HeaderedCard>
    </AppModal>
  )
}

// ** Pill used in the summary row above the table
const SummaryChip = ({ tone, icon, label }) => (
  <Box
    sx={{
      px: 2.5,
      height: 24,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 1,
      borderRadius: `${radii.full}px`,
      border: `1px solid ${statusTokens[tone].border}`,
      backgroundColor: statusTokens[tone].bg,
      color: statusTokens[tone].fg
    }}
  >
    <Icon icon={icon} fontSize='0.8125rem' />
    <Typography sx={{ fontSize: '0.6875rem', fontWeight: 500, lineHeight: 1, color: 'inherit' }}>{label}</Typography>
  </Box>
)
