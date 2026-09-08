import React, { useState, useEffect, useRef } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Divider from '@mui/material/Divider'
import Tooltip from '@mui/material/Tooltip'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import FormControl from '@mui/material/FormControl'
import DialogContent from '@mui/material/DialogContent'
import CircularProgress from '@mui/material/CircularProgress'

import { useSelector, useDispatch } from 'react-redux'
import Link from 'next/link'
import Icon from 'src/@core/components/icon'
import { fetchDataUsers } from 'src/store/apps/user'
import { voidPointOfSale } from 'src/store/apps/pos'
import { priceFormatWIthCurrency } from 'src/helpers/priceFormatter'
import { returnFormatDate, returnFormatTime } from 'src/helpers/formatDate'
import { Status } from 'src/@core/components/common'

// ** Shared Components
import DataTable from 'src/views/common/DataTable'
import SectionHeading from 'src/views/common/SectionHeading'

// ** Design Tokens
import { colors, radii, shadows, status as statusTokens, stone } from 'src/configs/designTokens'

const mutedSx = {
  fontSize: '0.8125rem',
  lineHeight: '20px',
  color: colors.mutedForeground
}

const InfoItem = ({ icon, label, value }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 0 }}>
    <Box
      sx={{
        width: 32,
        height: 32,
        flexShrink: 0,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: stone[100],
        color: colors.mutedForeground
      }}
    >
      <Icon icon={icon} fontSize='1.125rem' />
    </Box>
    <Box sx={{ minWidth: 0 }}>
      <Typography sx={mutedSx}>{label}</Typography>
      <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: colors.foreground, whiteSpace: 'nowrap' }} noWrap>
        {value || '-'}
      </Typography>
    </Box>
  </Box>
)

export default function ModalViewTransactionV4({ open, setOpen, disableActions = false }) {
  const dispatch = useDispatch()
  const { detailPointOfSale: data, errorDetailPointOfSale, loadingDetailPointOfSale } = useSelector(state => state.pos)
  const users = useSelector(state => state.user?.dataUsers || [])

  const [openVoid, setOpenVoid] = useState(false)
  const [selectedAdmin, setSelectedAdmin] = useState('')
  const [pin, setPin] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [pendingVoid, setPendingVoid] = useState(null)
  const pinInputNameRef = useRef(`pin_${Math.random().toString(36).slice(2)}`)

  useEffect(() => {
    if (openVoid) dispatch(fetchDataUsers({ roleId: 1 }))
  }, [openVoid])

  useEffect(() => {
    if (!pendingVoid) return
    let mounted = true
    const doVoid = async () => {
      try {
        setSubmitting(true)
        const result = await dispatch(voidPointOfSale(pendingVoid))
        if (!mounted) return
        if (result?.meta?.requestStatus === 'fulfilled') {
          const cancelled = result?.payload?.cancelled
          if (cancelled) {
            setSelectedAdmin('')
            setPin('')
            setOpenVoid(false)
          } else {
            setOpenVoid(false)
            setOpen(false)
          }
        }
      } catch (e) {
        // errors handled in thunk
      } finally {
        if (mounted) setSubmitting(false)
        setPendingVoid(null)
      }
    }
    doVoid()
    return () => {
      mounted = false
    }
  }, [pendingVoid])

  const handleClose = () => setOpen(false)

  const handleCloseVoid = () => {
    setOpenVoid(false)
    setSelectedAdmin('')
    setPin('')
  }

  const handleConfirmVoid = () => {
    setPendingVoid({
      code: data.code,
      adminUserId: selectedAdmin,
      pin,
      warehouseId: data.warehouseId
    })
  }

  const changeAmount = (data?.totalPayment || 0) - (data?.grandTotal || 0)

  return (
    <>
      <Dialog
        fullWidth
        open={open}
        scroll='paper'
        maxWidth='lg'
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: `${radii['3xl']}px`,
            border: `1px solid ${colors.border}`,
            boxShadow: shadows.lg,
            backgroundColor: colors.background
          }
        }}
      >
        {/* Header */}
        <Box sx={{ p: 5, pb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 0 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  flexShrink: 0,
                  borderRadius: `${radii.lg}px`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: stone[100],
                  color: colors.foreground
                }}
              >
                <Icon icon='tabler:file-invoice' fontSize='1.25rem' />
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontSize: '1.125rem', fontWeight: 600, color: colors.foreground }}>
                  Detail Transaksi POS
                </Typography>
                <Typography sx={{ ...mutedSx, mt: 0.5 }}>
                  {data?.code || '-'}
                </Typography>
                {(data?.queueNumber != null || data?.shift) && (
                  <Tooltip
                    title={
                      data?.shift ? (
                        <Box>
                          <Typography variant='caption' display='block'>
                            <strong>{data.shift.shiftName}</strong>
                          </Typography>
                          <Typography variant='caption' display='block'>
                            {data.shift.startShift ? data.shift.startShift.substring(0, 5) : '-'} -{' '}
                            {data.shift.endShift ? data.shift.endShift.substring(0, 5) : '-'}
                          </Typography>
                        </Box>
                      ) : (
                        ''
                      )
                    }
                  >
                    <Typography sx={mutedSx}>
                      {data?.queueNumber != null && `Antrian #${data.queueNumber}`}
                      {data?.queueNumber != null && data?.shift && ' | '}
                      {data?.shift &&
                        `${data.shift.shiftName || 'Shift'} (${
                          data.shift.startShift ? data.shift.startShift.substring(0, 5) : '-'
                        })`}
                    </Typography>
                  </Tooltip>
                )}
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
              {data?.status && <Status status={data.status} />}
              <IconButton onClick={handleClose} size='small' aria-label='close' sx={{ color: colors.foreground, p: 1 }}>
                <Icon icon='tabler:x' fontSize='1rem' />
              </IconButton>
            </Box>
          </Box>
        </Box>

        {/* Body */}
        <DialogContent sx={{ px: 5, pb: 5, pt: 0 }}>
          {loadingDetailPointOfSale ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : errorDetailPointOfSale ? (
            <Alert severity='error' sx={{ borderRadius: `${radii.lg}px` }}>
              Point of sale: {data?.code || ''} Tidak Ditemukan. Mohon cek list point of sale:{' '}
              <Link href='/point-of-sale'>Point of Sale</Link>
            </Alert>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {/* Info strip */}
              <Grid
                container
                spacing={4}
                sx={{
                  m: 0,
                  p: 4,
                  borderRadius: `${radii.lg}px`,
                  backgroundColor: stone[100]
                }}
              >
                <Grid item xs={6} sm={3}>
                  <InfoItem
                    icon='tabler:calendar'
                    label='Tanggal'
                    value={`${returnFormatDate(data?.createdAt)}, ${returnFormatTime(data?.createdAt)}`}
                  />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <InfoItem icon='tabler:building-warehouse' label='Gudang' value={data?.warehouseName} />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <InfoItem icon='tabler:user-shield' label='Kasir' value={data?.createdBy} />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <InfoItem icon='tabler:user' label='Pelanggan' value={data?.customer?.name} />
                </Grid>
              </Grid>

              {/* 1. Ringkasan Pembayaran */}
              <Box>
                <SectionHeading number={1} title='Ringkasan Pembayaran' />
                <Box
                  sx={{
                    borderRadius: `${radii.lg}px`,
                    border: `1px solid ${statusTokens.success.border}`,
                    boxShadow: shadows.xs,
                    backgroundColor: statusTokens.success.bg,
                    p: 4
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                    <Typography sx={{ fontSize: '0.8125rem', color: colors.foreground }}>Sub Total</Typography>
                    <Typography sx={{ fontSize: '0.8125rem', fontWeight: 500, color: colors.foreground }}>
                      {priceFormatWIthCurrency(data?.subTotal)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                    <Typography sx={{ fontSize: '0.8125rem', color: colors.foreground }}>Diskon</Typography>
                    <Typography sx={{ fontSize: '0.8125rem', fontWeight: 500, color: colors.foreground }}>
                      {priceFormatWIthCurrency(data?.totalDiscount || 0)}
                    </Typography>
                  </Box>
                  <Divider sx={{ borderBottomWidth: 2, my: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                    <Typography sx={{ fontSize: '0.9375rem', fontWeight: 600, color: colors.foreground }}>
                      Grand Total
                    </Typography>
                    <Typography sx={{ fontSize: '0.9375rem', fontWeight: 700, color: colors.foreground }}>
                      {priceFormatWIthCurrency(data?.grandTotal)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                    <Typography sx={{ fontSize: '0.8125rem', color: colors.foreground }}>Dibayar</Typography>
                    <Typography sx={{ fontSize: '0.8125rem', fontWeight: 500, color: colors.foreground }}>
                      {priceFormatWIthCurrency(data?.totalPayment)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                    <Typography
                      sx={{
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        color: changeAmount < 0 ? statusTokens.danger.fg : statusTokens.success.fg
                      }}
                    >
                      {changeAmount >= 0 ? 'Kembalian' : 'Kurang Bayar'}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        color: changeAmount < 0 ? statusTokens.danger.fg : statusTokens.success.fg
                      }}
                    >
                      {priceFormatWIthCurrency(Math.abs(changeAmount))}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* 2. Produk Dibeli */}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                  <Box
                    sx={{
                      width: 22,
                      height: 22,
                      flexShrink: 0,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: colors.foreground,
                      color: colors.primaryForeground,
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}
                  >
                    2
                  </Box>
                  <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: colors.foreground, flexShrink: 0 }}>
                    Produk Dibeli
                  </Typography>
                  <Box sx={{ flexGrow: 1, height: '1px', backgroundColor: colors.border }} />
                  <Typography sx={{ ...mutedSx, flexShrink: 0 }}>
                    {data?.listProducts?.length || 0} Items
                  </Typography>
                </Box>
                <DataTable
                  itemLabel='produk'
                  rows={data?.listProducts || []}
                  getRowId={row => row.id}
                  columns={[
                    {
                      flex: 0.4,
                      minWidth: 160,
                      field: 'productName',
                      headerName: 'NAMA PRODUK',
                      renderCell: params => (
                        <Box sx={{ py: 1 }}>
                          <Typography variant='body2' sx={{ color: colors.foreground, whiteSpace: 'normal' }}>
                            {params.row.productName || params.row.title}
                          </Typography>
                          {params.row.notes && (
                            <Typography sx={{ fontSize: '0.75rem', color: colors.mutedForeground }}>
                              Catatan: {params.row.notes}
                            </Typography>
                          )}
                        </Box>
                      )
                    },
                    {
                      flex: 0.2,
                      minWidth: 90,
                      field: 'quantity',
                      headerName: 'QUANTITY',
                      renderCell: params => (
                        <Typography variant='body2' sx={{ color: colors.foreground }}>
                          {params.row.quantity}
                        </Typography>
                      )
                    },
                    {
                      flex: 0.2,
                      minWidth: 110,
                      field: 'price',
                      headerName: 'HARGA',
                      renderCell: params => (
                        <Typography variant='body2' sx={{ color: colors.foreground }}>
                          {priceFormatWIthCurrency(params.row.price)}
                        </Typography>
                      )
                    },
                    {
                      flex: 0.2,
                      minWidth: 130,
                      field: 'subTotal',
                      headerName: 'TOTAL PEMBELIAN',
                      renderCell: params => (
                        <Typography variant='body2' sx={{ fontWeight: 500, color: colors.foreground }}>
                          {priceFormatWIthCurrency(params.row.subTotal || 0)}
                        </Typography>
                      )
                    }
                  ]}
                  sx={{ '& .MuiDataGrid-cell': { alignItems: 'flex-start', py: 1 } }}
                />
              </Box>
            </Box>
          )}
        </DialogContent>

        {/* Footer */}
        {data && data.status !== 'VOID' && !disableActions && (
          <>
            <Divider sx={{ borderColor: colors.border }} />
            <Box sx={{ p: 4, display: 'flex', justifyContent: 'flex-start' }}>
              <Button
                variant='contained'
                onClick={() => setOpenVoid(true)}
                startIcon={<Icon icon='tabler:ban' fontSize='1rem' />}
                sx={{
                  backgroundColor: statusTokens.danger.fg,
                  '&:hover': { backgroundColor: statusTokens.danger.fg, filter: 'brightness(0.92)' }
                }}
              >
                VOID
              </Button>
            </Box>
          </>
        )}
      </Dialog>

      {/* VOID Dialog */}
      <Dialog
        open={openVoid}
        onClose={handleCloseVoid}
        maxWidth='xs'
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: `${radii['3xl']}px`,
            border: `1px solid ${colors.border}`,
            boxShadow: shadows.lg,
            backgroundColor: colors.background
          }
        }}
      >
        {/* Header */}
        <Box sx={{ p: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Icon icon='tabler:alert-circle' fontSize='1.5rem' color={statusTokens.danger.fg} />
            <Typography sx={{ fontSize: '1.125rem', fontWeight: 600, color: colors.foreground }}>
              Void Transaksi {data?.code}
            </Typography>
          </Box>
          <IconButton onClick={handleCloseVoid} size='small' aria-label='close' sx={{ color: colors.foreground, p: 1 }}>
            <Icon icon='tabler:x' fontSize='1rem' />
          </IconButton>
        </Box>

        <Box sx={{ px: 5 }}>
          <Divider sx={{ borderColor: colors.border }} />
        </Box>

        <DialogContent component='form' autoComplete='off' sx={{ px: 5, py: 4 }}>
          <Typography sx={{ ...mutedSx, mb: 3 }}>
            Konfirmasi void untuk transaksi:{' '}
            <Box component='span' sx={{ fontWeight: 600, color: colors.foreground }}>
              {data?.code}
            </Box>
          </Typography>

          {/* Dummy input to prevent browser autofill */}
          <input type='text' name='prevent_autofill_username' autoComplete='off' style={{ display: 'none' }} />

          {/* Admin Selection */}
          <FormControl fullWidth sx={{ mb: 4 }}>
            <InputLabel id='admin-select-label'>Pilih Admin</InputLabel>
            <Select
              labelId='admin-select-label'
              value={selectedAdmin}
              label='Pilih Admin'
              onChange={e => setSelectedAdmin(e.target.value)}
              disabled={submitting}
            >
              {users.map(u => (
                <MenuItem key={u.id} value={u.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Icon icon='tabler:user-circle' fontSize='1.125rem' />
                    {u.name}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* PIN Input */}
          <TextField
            label='PIN Admin (4 digit)'
            fullWidth
            name={pinInputNameRef.current}
            autoComplete='off'
            value={pin}
            onChange={e => setPin(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
            type='tel'
            disabled={submitting}
            inputProps={{
              inputMode: 'numeric',
              pattern: '[0-9]*',
              maxLength: 4,
              autoComplete: 'off',
              autoCorrect: 'off',
              spellCheck: false,
              autoCapitalize: 'off',
              style: { WebkitTextSecurity: 'disc' }
            }}
          />

          {/* Warning Alert */}
          <Alert
            severity='warning'
            variant='outlined'
            sx={{ mt: 4, borderRadius: `${radii.lg}px` }}
            icon={<Icon icon='tabler:alert-triangle' />}
          >
            <Typography variant='body2'>Aksi ini tidak dapat dibatalkan setelah dikonfirmasi</Typography>
          </Alert>
        </DialogContent>

        <Box sx={{ px: 5 }}>
          <Divider sx={{ borderColor: colors.border }} />
        </Box>

        <Box sx={{ p: 4, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
          <Button
            variant='outlined'
            color='secondary'
            onClick={handleCloseVoid}
            disabled={submitting}
            startIcon={<Icon icon='tabler:x' fontSize='1rem' />}
            sx={{
              color: colors.foreground,
              borderColor: colors.border3,
              boxShadow: shadows.xs,
              '&:hover': { borderColor: colors.border3 }
            }}
          >
            Batal
          </Button>
          <Button
            variant='contained'
            disabled={!selectedAdmin || pin.length !== 4 || submitting}
            onClick={handleConfirmVoid}
            startIcon={
              submitting ? (
                <CircularProgress size={16} sx={{ color: 'inherit' }} />
              ) : (
                <Icon icon='tabler:ban' fontSize='1rem' />
              )
            }
            sx={{
              backgroundColor: statusTokens.danger.fg,
              '&:hover': { backgroundColor: statusTokens.danger.fg, filter: 'brightness(0.92)' }
            }}
          >
            {submitting ? 'Memproses...' : 'Confirm VOID'}
          </Button>
        </Box>
      </Dialog>
    </>
  )
}
