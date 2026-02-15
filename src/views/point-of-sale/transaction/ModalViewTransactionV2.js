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
  Chip
} from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import Link from 'next/link'
import { Box } from '@mui/system'
import { CustomCloseButton } from 'src/views/pages/dialog-examples/DialogEditUserInfo'
import Icon from 'src/@core/components/icon'
import DetailOpenBillAndTransaction from '../open-bill/DetailOpenBillAndTransaction'
import { fetchDataUsers } from 'src/store/apps/user'
import { voidPointOfSale } from 'src/store/apps/pos'

export default function ModalViewTransactionV2({ open, setOpen, disableActions = false }) {
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

  // removed debug log

  useEffect(() => {
    if (!pendingVoid) return
    let mounted = true
    const doVoid = async () => {
      try {
        setSubmitting(true)
        const result = await dispatch(voidPointOfSale(pendingVoid))
        if (!mounted) return
        // Only close modals when the thunk succeeded and not cancelled by user
        if (result?.meta?.requestStatus === 'fulfilled') {
          const cancelled = result?.payload?.cancelled
          if (cancelled) {
            // User cancelled in confirmation dialog: close the Void modal (keep detail modal open)
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
            position: 'relative'
          }
        }}
      >
        <DialogContent
          sx={{
            pb: theme => `${theme.spacing(4)} !important`,
            px: theme => [`${theme.spacing(3)} !important`, `${theme.spacing(6)} !important`],
            overflowY: 'auto',
            height: 'calc(34rem - 60px)',
            maxHeight: 'calc(34rem - 60px)',
            pt: theme => [`${theme.spacing(23)} !important`, `${theme.spacing(23)} !important`]
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 2,
              backgroundColor: 'background.paper',
              borderBottom: '1px solid',
              borderColor: 'divider',
              px: theme => [`${theme.spacing(3)} !important`, `${theme.spacing(6)} !important`],
              py: theme => `${theme.spacing(3)} !important`,
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant='h4' sx={{ margin: 0 }}>
                Detail Transaction POS
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
              <Typography variant='body2' sx={{ margin: 0, color: 'text.secondary' }}>
                {data?.code}
              </Typography>
              <Chip size='small' label={`Queue ${data?.queueNumber ?? '-'}`} />
            </Box>
          </Box>
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
            <>
              <DetailOpenBillAndTransaction data={data} type={'transaction'} disableActions={disableActions} />
            </>
          )}
          {/* VOID Dialog */}
          <Dialog
            open={openVoid}
            onClose={() => {
              setOpenVoid(false)
              setSelectedAdmin('')
              setPin('')
            }}
            maxWidth='xs'
            fullWidth
          >
            <DialogContent component='form' autoComplete='off'>
              <Typography variant='h6' sx={{ mb: 2 }}>
                Void Transaction {data?.code}
              </Typography>
              {/* dummy input to prevent browser autofill */}
              <input type='text' name='prevent_autofill_username' autoComplete='off' style={{ display: 'none' }} />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id='admin-select-label'>Pilih Admin</InputLabel>
                <Select
                  labelId='admin-select-label'
                  value={selectedAdmin}
                  label='Pilih Admin'
                  onChange={e => setSelectedAdmin(e.target.value)}
                >
                  {users.map(u => (
                    <MenuItem key={u.id} value={u.id}>
                      {u.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label='PIN Admin (4 digit)'
                fullWidth
                name={pinInputNameRef.current}
                autoComplete='off'
                value={pin}
                onChange={e => setPin(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
                type='tel'
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
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  setOpenVoid(false)
                  setSelectedAdmin('')
                  setPin('')
                }}
              >
                Batal
              </Button>
              <Button
                color='error'
                variant='contained'
                disabled={!selectedAdmin || pin.length !== 4 || submitting}
                onClick={() => {
                  setPendingVoid({ code: data.code, adminUserId: selectedAdmin, pin, warehouseId: data.warehouseId })
                }}
              >
                {submitting ? <CircularProgress size={20} /> : 'Confirm VOID'}
              </Button>
            </DialogActions>
          </Dialog>
        </DialogContent>
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
    </Card>
  )
}
