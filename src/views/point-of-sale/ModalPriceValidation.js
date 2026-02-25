// ** React Imports
import { useState, useEffect, useMemo } from 'react'

// ** MUI Imports
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper
} from '@mui/material'
import Icon from 'src/@core/components/icon'
import { priceFormatWIthCurrency } from 'src/helpers/priceFormatter'

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

  return (
    <Dialog
      open={open}
      maxWidth='md'
      fullWidth
      scroll='paper'
      onClose={onClose}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 2,
          maxHeight: '90vh'
        }
      }}
    >
      {/* ── Header ── */}
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 1.5,
          pb: 1.5,
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Icon icon='tabler:alert-triangle' fontSize='1.5rem' style={{ color: '#FF9800', marginTop: 2, flexShrink: 0 }} />
        <Box>
          <Typography variant='h6' sx={{ fontWeight: 700, lineHeight: 1.3 }}>
            Validasi Harga Produk
          </Typography>
          <Typography variant='caption' sx={{ color: 'text.secondary' }}>
            Berikut perbandingan harga keranjang vs harga terkini dari sistem. Centang produk yang ingin diperbarui,
            lalu klik <strong>"Terapkan"</strong> untuk kembali ke keranjang dan charge seperti biasa.
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pt: '12px !important', pb: 0 }}>
        {/* ── Summary chips ── */}
        <Box sx={{ display: 'flex', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
          <Chip
            size='small'
            icon={<Icon icon='tabler:package' fontSize='0.85rem' />}
            label={`${validationResult.length} produk dicek`}
            variant='outlined'
            color='primary'
          />
          <Chip
            size='small'
            icon={<Icon icon='tabler:alert-circle' fontSize='0.85rem' />}
            label={`${diffItems.length} harga berbeda`}
            variant='outlined'
            color={diffItems.length > 0 ? 'warning' : 'success'}
          />
          <Chip
            size='small'
            icon={<Icon icon='tabler:circle-check' fontSize='0.85rem' />}
            label={`${validationResult.length - diffItems.length} harga sesuai`}
            variant='outlined'
            color='success'
          />
        </Box>

        {/* ── Table ── */}
        <TableContainer
          component={Paper}
          variant='outlined'
          sx={{
            borderRadius: 1,
            mb: 2,
            maxHeight: 272,
            overflowY: 'auto',
            overflowX: 'hidden',
            '&::-webkit-scrollbar': { width: 6 },
            '&::-webkit-scrollbar-track': { background: 'transparent' },
            '&::-webkit-scrollbar-thumb': { background: '#bdbdbd', borderRadius: 3 },
            '&::-webkit-scrollbar-thumb:hover': { background: '#9e9e9e' }
          }}
        >
          <Table size='small' stickyHeader sx={{ tableLayout: 'fixed', width: '100%' }}>
            <TableHead>
              <TableRow>
                <TableCell padding='checkbox' sx={{ bgcolor: 'grey.100', width: 40 }}>
                  {diffItems.length > 0 && (
                    <Checkbox
                      size='small'
                      checked={allDiffChecked}
                      indeterminate={!allDiffChecked && someDiffChecked}
                      onChange={e => toggleAll(e.target.checked)}
                    />
                  )}
                </TableCell>
                <TableCell sx={{ bgcolor: 'grey.100', fontWeight: 700, fontSize: '0.75rem', width: '27%' }}>Produk</TableCell>
                <TableCell align='center' sx={{ bgcolor: 'grey.100', fontWeight: 700, fontSize: '0.75rem', width: 36 }}>Qty</TableCell>
                <TableCell align='right' sx={{ bgcolor: 'grey.100', fontWeight: 700, fontSize: '0.75rem', width: '22%' }}>
                  Harga Keranjang
                </TableCell>
                <TableCell align='center' sx={{ bgcolor: 'grey.100', width: 24, px: 0 }}></TableCell>
                <TableCell align='right' sx={{ bgcolor: 'grey.100', fontWeight: 700, fontSize: '0.75rem', width: '22%' }}>
                  Harga Sistem
                </TableCell>
                <TableCell align='center' sx={{ bgcolor: 'grey.100', fontWeight: 700, fontSize: '0.75rem', width: 100 }}>
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {validationResult.map((item, idx) => {
                const isDiff = !!item.isPriceDifferent
                const isApplied = !!applyMap[item.cartIndex]
                const priceDelta = Number(item.backendPrice) - Number(item.cartPrice)
                const qty = Number(item.quantity ?? 1)
                const cartSubTotal = Number(item.cartSubTotal ?? item.cartPrice * qty)
                const backendSubTotal = Number(item.backendSubTotal ?? item.backendPrice * qty)

                return (
                  <TableRow
                    key={item.warehouseProductId ?? idx}
                    sx={{
                      bgcolor: !isDiff
                        ? 'rgba(76, 175, 80, 0.04)'
                        : isApplied
                          ? 'rgba(255, 152, 0, 0.07)'
                          : 'transparent',
                      '&:hover': {
                        bgcolor: !isDiff ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 152, 0, 0.12)'
                      }
                    }}
                  >
                    {/* Checkbox */}
                    <TableCell padding='checkbox'>
                      <Checkbox
                        size='small'
                        checked={isApplied}
                        disabled={!isDiff}
                        onChange={() => toggleApply(item.cartIndex)}
                      />
                    </TableCell>

                    {/* Product Name + Unit */}
                    <TableCell sx={{ fontSize: '0.75rem', py: 0.75, overflow: 'hidden' }}>
                      <Typography
                        variant='body2'
                        sx={{ fontWeight: 600, lineHeight: 1.2, fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                        title={item.productName}
                      >
                        {item.productName || '-'}
                      </Typography>
                      <Typography variant='caption' sx={{ color: 'text.secondary', fontSize: '0.68rem' }}>
                        {item.unitName || '-'}
                      </Typography>
                    </TableCell>

                    {/* Qty */}
                    <TableCell align='center' sx={{ fontSize: '0.75rem', color: 'text.secondary', py: 0.75 }}>
                      {qty}
                    </TableCell>

                    {/* Cart Price + SubTotal */}
                    <TableCell align='right' sx={{ py: 0.75 }}>
                      <Typography
                        variant='body2'
                        sx={{
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          textDecoration: isDiff && isApplied ? 'line-through' : 'none',
                          opacity: isDiff && isApplied ? 0.5 : 1,
                          color: isDiff
                            ? priceDelta > 0 ? 'error.main' : 'success.main'
                            : 'text.primary'
                        }}
                      >
                        {priceFormatWIthCurrency(item.cartPrice)}
                      </Typography>
                      <Typography
                        variant='caption'
                        sx={{
                          display: 'block',
                          fontSize: '0.68rem',
                          color: 'text.secondary',
                          textDecoration: isDiff && isApplied ? 'line-through' : 'none',
                          opacity: isDiff && isApplied ? 0.5 : 1
                        }}
                      >
                        ({priceFormatWIthCurrency(cartSubTotal)})
                      </Typography>
                    </TableCell>

                    {/* Arrow */}
                    <TableCell align='center' sx={{ px: 0, py: 0.75 }}>
                      {isDiff && (
                        <Icon
                          icon='tabler:arrow-right'
                          fontSize='0.8rem'
                          style={{ color: '#9E9E9E', verticalAlign: 'middle' }}
                        />
                      )}
                    </TableCell>

                    {/* Backend Price + SubTotal */}
                    <TableCell align='right' sx={{ py: 0.75 }}>
                      <Typography
                        variant='body2'
                        sx={{
                          fontSize: '0.75rem',
                          fontWeight: isDiff ? 700 : 400,
                          color: isDiff ? 'primary.main' : 'text.secondary'
                        }}
                      >
                        {priceFormatWIthCurrency(item.backendPrice)}
                      </Typography>
                      <Typography
                        variant='caption'
                        sx={{
                          display: 'block',
                          fontSize: '0.68rem',
                          fontWeight: isDiff && isApplied ? 700 : 400,
                          color: isDiff && isApplied ? 'primary.main' : 'text.secondary'
                        }}
                      >
                        ({priceFormatWIthCurrency(backendSubTotal)})
                      </Typography>
                    </TableCell>

                    {/* Status Chip */}
                    <TableCell align='center' sx={{ py: 0.75 }}>
                      {!isDiff ? (
                        <Chip size='small' label='Sesuai' color='success' variant='outlined'
                          sx={{ fontSize: '0.65rem', height: 20 }} />
                      ) : isApplied ? (
                        <Chip size='small' label='Diperbarui' color='warning'
                          sx={{ fontSize: '0.65rem', height: 20 }} />
                      ) : (
                        <Chip size='small' label='Diabaikan' variant='outlined'
                          sx={{ fontSize: '0.65rem', height: 20, color: 'text.disabled' }} />
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {/* ── Impact Summary ── */}
        <Box
          sx={{
            p: 1.5,
            borderRadius: 1,
            border: '1px solid',
            borderColor: impact.delta !== 0 ? 'warning.main' : 'success.main',
            bgcolor: impact.delta !== 0 ? 'rgba(255,152,0,0.05)' : 'rgba(76,175,80,0.05)',
            mb: 1.5
          }}
        >
          <Typography variant='subtitle2' sx={{ fontWeight: 700, mb: 0.75, color: 'text.primary', fontSize: '0.8rem' }}>
            Ringkasan Dampak Perubahan Harga
          </Typography>
          <Grid container spacing={1}>
            <Grid item xs={4}>
              <Typography variant='caption' sx={{ color: 'text.secondary', display: 'block' }}>
                SubTotal Keranjang
              </Typography>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                {priceFormatWIthCurrency(impact.cartTotal)}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant='caption' sx={{ color: 'text.secondary', display: 'block' }}>
                SubTotal Setelah Apply
              </Typography>
              <Typography variant='body2' sx={{ fontWeight: 700, color: 'primary.main' }}>
                {priceFormatWIthCurrency(impact.afterApplyTotal)}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant='caption' sx={{ color: 'text.secondary', display: 'block' }}>
                Selisih
              </Typography>
              <Typography
                variant='body2'
                sx={{
                  fontWeight: 700,
                  color: impact.delta === 0 ? 'success.main' : impact.delta > 0 ? 'error.main' : 'success.main'
                }}
              >
                {impact.delta === 0 ? '–' : `${impact.delta > 0 ? '+' : ''}${priceFormatWIthCurrency(impact.delta)}`}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {/* ── Info note ── */}
        <Box
          sx={{
            p: 1.25,
            borderRadius: 1,
            bgcolor: 'rgba(33,150,243,0.06)',
            border: '1px solid rgba(33,150,243,0.2)',
            display: 'flex',
            gap: 1,
            alignItems: 'flex-start',
            mb: 1
          }}
        >
          <Icon icon='tabler:info-circle' fontSize='1rem' style={{ color: '#2196F3', marginTop: 2, flexShrink: 0 }} />
          <Typography variant='caption' sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
            Produk yang <strong>dicentang</strong> akan diperbarui harganya di keranjang. Setelah klik{' '}
            <strong>"Terapkan"</strong>, Anda akan kembali ke keranjang untuk memeriksa ulang sebelum charge.
          </Typography>
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 1.5, gap: 1 }}>
        <Button variant='outlined' color='inherit' onClick={onClose} startIcon={<Icon icon='tabler:x' />}>
          Batal
        </Button>
        <Button variant='contained' color='primary' onClick={handleConfirm} startIcon={<Icon icon='tabler:check' />}>
          Terapkan &amp; Kembali ke Keranjang
        </Button>
      </DialogActions>
    </Dialog>
  )
}
