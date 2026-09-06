import { useState } from 'react'
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { useDispatch, useSelector } from 'react-redux'
import { approveOutstandingProduct, saveToDraftOutstandingProduct } from 'src/store/apps/receipt-order-outstanding'
import DownloadButton from 'src/views/components/buttons/ButtonDownload'

// ** Shared Components
import ConfirmDialog from 'src/views/common/ConfirmDialog'

// ** Design Tokens
import { colors, radii, shadows, status as statusTokens } from 'src/configs/designTokens'

const surfaceCardSx = {
  borderRadius: `${radii['3xl']}px`,
  border: `1px solid ${colors.border}`,
  boxShadow: shadows.xs
}

const ToolbarReceiptOrderOutstanding = ({ id, status, data }) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [confirmAction, setConfirmAction] = useState(null)

  const { loadingSaveDraft, loadingApprove } = useSelector(state => state.deliveryOrderReceiptOutstanding)

  const buildProductPayload = () =>
    data.productOutstandings.map(product => ({
      id: product.productOutstandingsId,
      status: product.status
    }))

  const handleSaveConfirmed = () => {
    const sendData = { notes: data.notes, product: buildProductPayload() }
    dispatch(saveToDraftOutstandingProduct({ data: sendData, code: data.code, router }))
    setConfirmAction(null)
  }

  const handleApproveConfirmed = () => {
    const sendData = { notes: data.notes, products: buildProductPayload() }
    dispatch(approveOutstandingProduct({ code: data.code, router, sendData }))
    setConfirmAction(null)
  }

  return (
    <>
      <Card elevation={0} sx={surfaceCardSx}>
        <CardContent>
          <DownloadButton
            url={'delivery-order-receive-outstanding'}
            id={id}
            setIsLoading={setIsLoading}
            isLoading={isLoading}
          />

          {status === 'PENDING' && (
            <>
              <Button
                fullWidth
                variant='contained'
                color='warning'
                disabled={loadingSaveDraft}
                onClick={() => setConfirmAction('save')}
                startIcon={
                  loadingSaveDraft ? undefined : <Icon icon='tabler:device-floppy' fontSize='1.125rem' />
                }
                sx={{ mt: 2 }}
              >
                {loadingSaveDraft ? 'Menyimpan...' : 'Simpan Surat'}
              </Button>

              <Button
                fullWidth
                variant='contained'
                color='success'
                disabled={loadingApprove}
                onClick={() => setConfirmAction('approve')}
                startIcon={
                  loadingApprove ? undefined : <Icon icon='tabler:discount-check' fontSize='1.125rem' />
                }
                sx={{ mt: 2 }}
              >
                {loadingApprove ? 'Menyelesaikan...' : 'Selesaikan Surat'}
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      <Card elevation={0} sx={{ ...surfaceCardSx, mt: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 3 }}>
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, lineHeight: '20px', color: colors.foreground }}>
              Informasi Tambahan
            </Typography>
            <Chip
              size='small'
              label='Important!'
              sx={{
                height: 20,
                borderRadius: `${radii.full}px`,
                backgroundColor: statusTokens.warning.bg,
                border: `1px solid ${statusTokens.warning.border}`,
                '& .MuiChip-label': {
                  px: 1.5,
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  lineHeight: '16px',
                  color: statusTokens.warning.fg
                }
              }}
            />
          </Box>
          <Typography sx={{ fontSize: '0.8125rem', lineHeight: '20px', color: colors.mutedForeground, mb: 2 }}>
            1. Anda dapat mengubah kolom status untuk memasukkan produk yang sedang dalam status outstanding,
            sehingga memudahkan pengelolaan stok.
          </Typography>
          <Typography sx={{ fontSize: '0.8125rem', lineHeight: '20px', color: colors.mutedForeground, mb: 2 }}>
            2. Tombol "Simpan Surat" memungkinkan Anda menyimpan data sementara, sehingga Anda dapat mengeditnya lagi
            nanti jika diperlukan.
          </Typography>
          <Typography sx={{ fontSize: '0.8125rem', lineHeight: '20px', color: colors.mutedForeground }}>
            3. Dengan menekan tombol "Selesaikan Surat", surat outstanding akan ditutup dan produk tidak dapat
            diubah lagi, sehingga memastikan keakuratan dan integritas data.
          </Typography>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirmAction === 'save'}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleSaveConfirmed}
        title='Simpan Surat Outstanding'
        description='Anda akan menyimpan perubahan pada surat outstanding ini sebagai draft.'
        confirmLabel='Simpan'
        confirmIcon='tabler:device-floppy'
        destructive={false}
        loading={loadingSaveDraft}
        loadingLabel='Menyimpan...'
      />

      <ConfirmDialog
        open={confirmAction === 'approve'}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleApproveConfirmed}
        title='Selesaikan Surat Outstanding'
        description='Surat outstanding akan ditutup dan produk tidak dapat diubah lagi. Lanjutkan?'
        confirmLabel='Selesaikan'
        confirmIcon='tabler:discount-check'
        destructive={false}
        loading={loadingApprove}
        loadingLabel='Menyelesaikan...'
      />
    </>
  )
}

export default ToolbarReceiptOrderOutstanding
