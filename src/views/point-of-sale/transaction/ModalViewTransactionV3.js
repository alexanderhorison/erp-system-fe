import React, { useState, useEffect, useRef } from 'react'
import {
  Grid,
  Typography,
  Card,
  Alert,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import Link from 'next/link'
import { Box } from '@mui/system'
import Icon from 'src/@core/components/icon'
import DetailOpenBillAndTransaction from '../open-bill/DetailOpenBillAndTransaction'
import { fetchDataUsers } from 'src/store/apps/user'
import { voidPointOfSale } from 'src/store/apps/pos'

export default function ModalViewTransactionV3({ open, setOpen, disableActions = false }) {
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

  return (
    <Card>
      <Dialog
        fullWidth
        open={open}
        scroll='paper'
        maxWidth='lg'
        onClose={handleClose}
        sx={{
          '& .MuiDialog-paper': {
            overflow: 'hidden',
            height: '34rem',
            maxHeight: '34rem',
            position: 'relative',
            borderRadius: 2
          }
        }}
      >
        {/* Fixed Header */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            backgroundColor: 'background.paper',
            borderBottom: '1px solid',
            borderColor: 'divider',
            px: theme => [`${theme.spacing(3)} !important`, `${theme.spacing(6)} !important`],
            py: theme => `${theme.spacing(3)} !important`
          }}
        >
          {/* Close Button */}
          <Box sx={{ position: 'absolute', right: 16, top: 16 }}>
            <Tooltip title='Close'>
              <IconButton size='small' onClick={handleClose} sx={{ color: 'text.secondary' }}>
                <Icon icon='mdi:close' fontSize={20} />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Title Section */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Icon icon='mdi:receipt-text-outline' fontSize={28} />
              <Typography variant='h4' sx={{ margin: 0, fontWeight: 600 }}>
                Detail Transaction POS
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Typography variant='body2' sx={{ margin: 0, color: 'text.secondary', fontWeight: 500 }}>
                {data?.code || '-'}
              </Typography>
              <Chip size='small' label={`Queue ${data?.queueNumber ?? '-'}`} color='primary' variant='outlined' />
              {data?.shift && (
                <Tooltip
                  title={
                    <Box>
                      <Typography variant='caption' display='block'>
                        <strong>{data.shift.shiftName}</strong>
                      </Typography>
                      <Typography variant='caption' display='block'>
                        ID: {data.shift.id}
                      </Typography>
                      <Typography variant='caption' display='block'>
                        {data.shift.startShift ? data.shift.startShift.substring(0, 5) : '-'} -{' '}
                        {data.shift.endShift ? data.shift.endShift.substring(0, 5) : '-'}
                      </Typography>
                    </Box>
                  }
                >
                  <Chip
                    size='small'
                    icon={<Icon icon='mdi:clock-outline' fontSize={16} />}
                    label={`${data.shift.shiftName || 'Shift'} (${
                      data.shift.startShift ? data.shift.startShift.substring(0, 5) : '-'
                    } - ${data.shift.endShift ? data.shift.endShift.substring(0, 5) : '-'})`}
                    color='secondary'
                    variant='outlined'
                  />
                </Tooltip>
              )}
              {data?.status && (
                <Chip
                  size='small'
                  label={data.status}
                  color={data.status === 'VOID' ? 'error' : 'success'}
                  variant='filled'
                />
              )}
            </Box>
          </Box>
        </Box>

        {/* Content */}
        <DialogContent
          sx={{
            pb: theme => `${theme.spacing(4)} !important`,
            px: theme => [`${theme.spacing(3)} !important`, `${theme.spacing(6)} !important`],
            overflowY: 'auto',
            height: 'calc(34rem - 60px)',
            maxHeight: 'calc(34rem - 60px)',
            pt: theme => [`${theme.spacing(24)} !important`, `${theme.spacing(24)} !important`]
          }}
        >
          {loadingDetailPointOfSale ? (
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                minHeight: '200px'
              }}
            >
              <CircularProgress sx={{ mb: 3 }} size={40} />
              <Typography variant='body2' color='text.secondary'>
                Loading transaction details...
              </Typography>
            </Box>
          ) : errorDetailPointOfSale ? (
            <Grid container spacing={6}>
              <Grid item xs={12}>
                <Alert severity='error' variant='outlined'>
                  <Typography variant='body2'>
                    Point of sale: <strong>{data?.code || ''}</strong> tidak ditemukan. Mohon cek list point of sale:{' '}
                    <Link href='/point-of-sale' style={{ fontWeight: 600 }}>
                      Point of Sale
                    </Link>
                  </Typography>
                </Alert>
              </Grid>
            </Grid>
          ) : (
            <DetailOpenBillAndTransaction data={data} type={'transaction'} disableActions={disableActions} />
          )}
        </DialogContent>

        {/* Footer Actions */}
        <Divider />
        <DialogActions
          sx={{
            justifyContent: 'space-between',
            py: theme => `${theme.spacing(2)} !important`,
            px: theme => `${theme.spacing(4)} !important`,
            backgroundColor: theme => (theme.palette.mode === 'light' ? 'grey.50' : 'background.paper')
          }}
        >
          <Box>
            {data && data.status !== 'VOID' && !disableActions && (
              <Button
                color='error'
                variant='contained'
                onClick={() => setOpenVoid(true)}
                startIcon={<Icon icon='mdi:cancel' />}
                sx={{ fontWeight: 600 }}
              >
                VOID Transaction
              </Button>
            )}
          </Box>
          <Button variant='outlined' onClick={handleClose} sx={{ fontWeight: 600 }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* VOID Dialog */}
      <Dialog
        open={openVoid}
        onClose={handleCloseVoid}
        maxWidth='xs'
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 2
          }
        }}
      >
        {/* Void Dialog Header */}
        <Box
          sx={{
            px: 4,
            pt: 4,
            pb: 2,
            borderBottom: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Icon icon='mdi:alert-circle-outline' fontSize={24} color='error' />
            <Typography variant='h6' sx={{ fontWeight: 600 }}>
              Void Transaction
            </Typography>
          </Box>
          <Typography variant='body2' color='text.secondary'>
            Konfirmasi void untuk transaksi: <strong>{data?.code}</strong>
          </Typography>
        </Box>

        <DialogContent component='form' autoComplete='off' sx={{ px: 4, py: 4 }}>
          {/* Dummy input to prevent browser autofill */}
          <input type='text' name='prevent_autofill_username' autoComplete='off' style={{ display: 'none' }} />

          {/* Admin Selection */}
          <FormControl fullWidth sx={{ mb: 3 }}>
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
                    <Icon icon='mdi:account-circle' fontSize={20} />
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
            helperText='Masukkan PIN 4 digit untuk konfirmasi'
          />

          {/* Warning Alert */}
          <Alert severity='warning' variant='outlined' sx={{ mt: 3 }} icon={<Icon icon='mdi:alert' />}>
            <Typography variant='body2'>Aksi ini tidak dapat dibatalkan setelah dikonfirmasi</Typography>
          </Alert>
        </DialogContent>

        <Divider />
        <DialogActions sx={{ px: 4, py: 2.5 }}>
          <Button onClick={handleCloseVoid} variant='outlined' disabled={submitting} sx={{ fontWeight: 600 }}>
            Batal
          </Button>
          <Button
            color='error'
            variant='contained'
            disabled={!selectedAdmin || pin.length !== 4 || submitting}
            onClick={handleConfirmVoid}
            startIcon={submitting ? <CircularProgress size={20} color='inherit' /> : <Icon icon='mdi:check' />}
            sx={{ fontWeight: 600, minWidth: 140 }}
          >
            {submitting ? 'Processing...' : 'Confirm VOID'}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}
