import { useState } from 'react'
import { Box, Button } from '@mui/material'
import Icon from 'src/@core/components/icon'
import { notifySuccess } from 'src/helpers/notify'
import DetailOpenBillAndTransaction from './DetailOpenBillAndTransaction'

// ** Shared Components
import AppModal from 'src/views/common/AppModal'
import ConfirmDialog from 'src/views/common/ConfirmDialog'
import { actionButtonSx } from 'src/views/common/actionButtonSx'

// ** Design Tokens
import { colors, shadows } from 'src/configs/designTokens'

export default function ModalDetailOpenBill({ open, setOpen, data, setSelectedMenu }) {
  // Which action is waiting for the cashier's answer: 'remove' | 'select' | null
  const [pendingAction, setPendingAction] = useState(null)

  const handleRemove = billId => {
    const listBill = JSON.parse(localStorage.getItem('openBill'))
    const newBill = listBill.filter(bill => bill.id !== billId)
    localStorage.setItem('openBill', JSON.stringify(newBill))
    setOpen(false)
    notifySuccess('Bill dihapus')
  }

  const handleSelect = billId => {
    const listBill = JSON.parse(localStorage.getItem('openBill'))
    const selectedBill = listBill.filter(bill => bill.id === billId)[0]
    const listProductPos = selectedBill?.products
    const selectedCustomerPos = selectedBill?.customer

    localStorage.setItem('listProductPos', JSON.stringify(listProductPos))
    localStorage.setItem('selectedCustomerPos', JSON.stringify(selectedCustomerPos))
    localStorage.setItem('warehousePos', JSON.stringify(selectedBill?.warehouse))
    localStorage.setItem('billId', JSON.stringify(selectedBill?.id))
    setSelectedMenu({
      name: 'POS',
      code: 'POS'
    })
    setOpen(false)
    notifySuccess('Bill dipilih')
  }

  const handleConfirm = () => {
    const action = pendingAction
    setPendingAction(null)
    if (action === 'remove') handleRemove(data.id)
    if (action === 'select') handleSelect(data.id)
  }

  return (
    <>
      <AppModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={event => event.preventDefault()}
        title='Bill Details'
        size='md'
        showActions={false}
      >
        {open && data?.id && <DetailOpenBillAndTransaction data={data} type='openBill' />}

        <Box sx={{ mt: 5, display: 'flex', justifyContent: 'flex-end', gap: 4 }}>
          <Button
            variant='outlined'
            color='secondary'
            onClick={() => setPendingAction('remove')}
            startIcon={<Icon icon='tabler:trash' fontSize='1rem' />}
            sx={{ ...actionButtonSx, color: colors.foreground, borderColor: colors.border3, boxShadow: shadows.xs }}
          >
            Hapus Bill
          </Button>
          <Button
            variant='contained'
            onClick={() => setPendingAction('select')}
            startIcon={<Icon icon='tabler:pointer' fontSize='1rem' />}
            sx={actionButtonSx}
          >
            Pilih Bill
          </Button>
        </Box>
      </AppModal>

      <ConfirmDialog
        open={pendingAction === 'remove'}
        onClose={() => setPendingAction(null)}
        onConfirm={handleConfirm}
        title='Hapus Bill?'
        description='Apakah anda ingin menghapus bill ini?'
        confirmLabel='Ya'
        cancelLabel='Tidak'
        confirmIcon='tabler:trash'
      />
      <ConfirmDialog
        open={pendingAction === 'select'}
        onClose={() => setPendingAction(null)}
        onConfirm={handleConfirm}
        title='Pilih Bill?'
        description='Apakah anda ingin memilih bill ini?'
        confirmLabel='Ya'
        cancelLabel='Tidak'
        confirmIcon='tabler:check'
        destructive={false}
      />
    </>
  )
}
