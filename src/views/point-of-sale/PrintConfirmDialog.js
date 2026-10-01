import ConfirmDialog from 'src/views/common/ConfirmDialog'

// ** "Print Point of Sale" confirmation, shared by every place that prints a receipt.
export default function PrintConfirmDialog({ open, onClose, onConfirm }) {
  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title='Print Point of Sale'
      description='Apakah anda yakin ingin mencetak Point of Sale ini?'
      confirmLabel='Ya'
      cancelLabel='Tidak'
      confirmIcon='tabler:printer'
      destructive={false}
    />
  )
}
