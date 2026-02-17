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
  Tooltip,
  Box,
  Paper,
  CardContent,
  CardHeader,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import Link from 'next/link'
import Icon from 'src/@core/components/icon'
import { fetchDataUsers } from 'src/store/apps/user'
import { voidPointOfSale } from 'src/store/apps/pos'
import { priceFormatWIthCurrency } from 'src/helpers/priceFormatter'
import { returnFormatDate, returnFormatTime } from 'src/helpers/formatDate'
import TablePorductOpenBill from '../open-bill/TableProductOpenBill'

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
            height: '40rem',
            maxHeight: '40rem',
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

        {/* Content Area */}
        <DialogContent
          sx={{
            pb: theme => `${theme.spacing(4)} !important`,
            px: theme => [`${theme.spacing(3)} !important`, `${theme.spacing(6)} !important`],
            overflowY: 'auto',
            height: 'calc(40rem - 60px)',
            maxHeight: 'calc(40rem - 60px)',
            pt: theme => [`${theme.spacing(24)} !important`, `${theme.spacing(24)} !important`]
          }}
        >
          {loadingDetailPointOfSale ? (
            <Box sx={{ mt: 11, width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              <CircularProgress sx={{ mb: 4 }} />
              <Typography>Loading...</Typography>
            </Box>
          ) : errorDetailPointOfSale ? (
            <Grid container spacing={6}>
              <Grid item xs={12}>
                <Alert severity='error'>
                  Point of sale: {data?.code || ''} Tidak Ditemukan. Mohon cek list point of sale:{' '}
                  <Link href='/point-of-sale'>Point of Sale</Link>
                </Alert>
              </Grid>
            </Grid>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Transaction Overview Cards */}
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {/* Transaction Info Card */}
                <Card sx={{ flex: 1, minWidth: 280 }}>
                  <CardHeader
                    avatar={
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <Icon icon='mdi:information-outline' fontSize={20} />
                      </Avatar>
                    }
                    title='Transaction Information'
                    titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
                  />
                  <CardContent sx={{ pt: 0 }}>
                    <Grid container spacing={2}>
                      {/* Left Column */}
                      <Grid item xs={6}>
                        <List dense>
                          <ListItem sx={{ px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              <Icon icon='mdi:tag-outline' fontSize={20} color='primary' />
                            </ListItemIcon>
                            <ListItemText
                              primary='POS Code'
                              secondary={data?.code || '-'}
                              primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                              secondaryTypographyProps={{ variant: 'body1', fontWeight: 500 }}
                            />
                          </ListItem>
                          <ListItem sx={{ px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              <Icon icon='mdi:calendar-clock' fontSize={20} color='primary' />
                            </ListItemIcon>
                            <ListItemText
                              primary='Tanggal'
                              secondary={`${returnFormatDate(data?.createdAt)} ${returnFormatTime(data?.createdAt)}`}
                              primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                              secondaryTypographyProps={{ variant: 'body1', fontWeight: 500 }}
                            />
                          </ListItem>
                        </List>
                      </Grid>
                      {/* Right Column */}
                      <Grid item xs={6}>
                        <List dense>
                          <ListItem sx={{ px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              <Icon icon='mdi:storefront-outline' fontSize={20} color='primary' />
                            </ListItemIcon>
                            <ListItemText
                              primary='Gudang'
                              secondary={data?.warehouseName || '-'}
                              primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                              secondaryTypographyProps={{ variant: 'body1', fontWeight: 500 }}
                            />
                          </ListItem>
                          <ListItem sx={{ px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              <Icon icon='mdi:account-tie-outline' fontSize={20} color='primary' />
                            </ListItemIcon>
                            <ListItemText
                              primary='Kasir'
                              secondary={data?.createdBy || 'Kasir Tidak Diketahui'}
                              primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                              secondaryTypographyProps={{ variant: 'body1', fontWeight: 500 }}
                            />
                          </ListItem>
                        </List>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                {/* Payment Summary Card */}
                <Card sx={{ flex: 1, minWidth: 280 }}>
                  <CardHeader
                    avatar={
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <Icon icon='mdi:cash-multiple' fontSize={20} />
                      </Avatar>
                    }
                    title='Payment Summary'
                    titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
                  />
                  <CardContent sx={{ pt: 0 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant='body2' color='text.secondary'>
                          Total Items
                        </Typography>
                        <Chip label={data?.totalItems || 0} size='small' color='primary' variant='outlined' />
                      </Box>

                      <Divider />

                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant='body2' color='text.secondary'>
                          Sub Total
                        </Typography>
                        <Typography variant='body1' fontWeight={500}>
                          {priceFormatWIthCurrency(data?.subTotal)}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant='body2' color='text.secondary'>
                          Discount
                        </Typography>
                        <Typography variant='body1' fontWeight={500}>
                          {priceFormatWIthCurrency(data?.totalDiscount || 0)}
                        </Typography>
                      </Box>

                      <Divider />

                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant='h6' color='primary' fontWeight={600}>
                          Grand Total
                        </Typography>
                        <Typography variant='h6' color='primary' fontWeight={600}>
                          {priceFormatWIthCurrency(data?.grandTotal)}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant='body2' color='text.secondary'>
                          Payment
                        </Typography>
                        <Typography variant='body1' fontWeight={500}>
                          {priceFormatWIthCurrency(data?.totalPayment)}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography
                          variant='body2'
                          color='text.secondary'
                          sx={{ fontWeight: data?.totalPayment - data?.grandTotal < 0 ? 600 : 400 }}
                        >
                          {data?.totalPayment - data?.grandTotal >= 0 ? 'Change' : 'Remaining'}
                        </Typography>
                        <Typography
                          variant='body1'
                          fontWeight={500}
                          sx={{
                            color: data?.totalPayment - data?.grandTotal < 0 ? 'error.main' : 'success.main'
                          }}
                        >
                          {priceFormatWIthCurrency(Math.abs((data?.totalPayment || 0) - (data?.grandTotal || 0)))}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Box>

              {/* Customer Information Card */}
              <Card>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <Icon icon='mdi:account-outline' fontSize={20} />
                    </Avatar>
                  }
                  title='Customer Information'
                  titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
                />
                <CardContent sx={{ pt: 0 }}>
                  {data?.customer?.name ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ width: 40, height: 40 }}>
                        <Icon icon='mdi:account' fontSize={24} />
                      </Avatar>
                      <Box>
                        <Typography variant='body1' fontWeight={500}>
                          {data.customer.name}
                        </Typography>
                        {data.customer.email && (
                          <Typography variant='body2' color='text.secondary'>
                            {data.customer.email}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ width: 40, height: 40, bgcolor: 'grey.300' }}>
                        <Icon icon='mdi:account-off' fontSize={24} />
                      </Avatar>
                      <Typography variant='body2' color='text.secondary'>
                        No customer information available
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>

              {/* Products Section */}
              <Card>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <Icon icon='mdi:package-variant' fontSize={20} />
                    </Avatar>
                  }
                  title='Products'
                  titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
                  action={
                    <Chip
                      label={`${data?.listProducts?.length || 0} items`}
                      size='small'
                      color='secondary'
                      variant='outlined'
                    />
                  }
                />
                <CardContent sx={{ pt: 0 }}>
                  <TablePorductOpenBill data={data?.listProducts || []} />
                </CardContent>
              </Card>
            </Box>
          )}
        </DialogContent>

        {/* Footer Actions */}
        <Divider />
        <DialogActions
          sx={{
            justifyContent: 'flex-start',
            py: theme => `${theme.spacing(1)} !important`,
            px: theme => `${theme.spacing(3)} !important`
          }}
        >
          {data && data.status !== 'VOID' && !disableActions && (
            <Button color='error' variant='contained' onClick={() => setOpenVoid(true)}>
              VOID
            </Button>
          )}
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
              Void Transaction {data?.code}
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
          <FormControl fullWidth sx={{ mb: 2 }}>
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
            sx={{ mb: 1 }}
          />

          {/* Warning Alert */}
          <Alert severity='warning' variant='outlined' sx={{ mt: 3 }} icon={<Icon icon='mdi:alert' />}>
            <Typography variant='body2'>Aksi ini tidak dapat dibatalkan setelah dikonfirmasi</Typography>
          </Alert>
        </DialogContent>

        <Divider />
        <DialogActions sx={{ px: 4, py: 2.5 }}>
          <Button onClick={handleCloseVoid} disabled={submitting} sx={{ fontWeight: 600 }}>
            Batal
          </Button>
          <Button
            color='error'
            variant='contained'
            disabled={!selectedAdmin || pin.length !== 4 || submitting}
            onClick={handleConfirmVoid}
            sx={{ fontWeight: 600, minWidth: 140 }}
          >
            {submitting ? <CircularProgress size={20} /> : 'Confirm VOID'}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}
