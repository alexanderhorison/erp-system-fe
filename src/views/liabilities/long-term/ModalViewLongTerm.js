import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  Grid,
  IconButton,
  Typography
} from '@mui/material'
import { styled } from '@mui/material/styles'
import Icon from 'src/@core/components/icon'
import { priceFormatWIthCurrency } from 'src/helpers/priceFormatter'
import { returnFormatMonthYear } from 'src/helpers/formatDate'

const CustomCloseButton = styled(IconButton)(({ theme }) => ({
  top: 0,
  right: 0,
  color: 'grey.500',
  position: 'absolute',
  boxShadow: theme.shadows[2],
  transform: 'translate(10px, -10px)',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: `${theme.palette.background.paper} !important`,
  transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
  '&:hover': {
    transform: 'translate(7px, -5px)'
  }
}))

export default function ModalViewLongTerm({ open, setOpen, selectedRow }) {
  const handleClose = () => {
    setOpen(false)
  }

  if (!selectedRow) return null

  return (
    <Card>
      <Dialog
        fullWidth
        open={open}
        maxWidth='md'
        scroll='body'
        onClose={handleClose}
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <DialogContent
          sx={{
            pb: theme => `${theme.spacing(8)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <CustomCloseButton onClick={handleClose}>
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </CustomCloseButton>
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant='h4' sx={{ mb: 2 }}>
              Detail Liabilitas Jangka Panjang
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Periode: {returnFormatMonthYear(selectedRow.date)}
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {[
              { name: 'shareHolderLoans', label: 'Pinjaman Kepada Pemegang Saham' },
              { name: 'longTermBankLoans', label: 'Hutang Bank Jangka Panjang' },
              { name: 'otherLongtermLiabilities', label: 'Kewajiban Jangka Panjang Lainnya' },
              { name: 'totalLongtermLiabilities', label: 'Jumlah Liabilitas Jangka Panjang' }
            ].map(fieldItem => (
              <Grid item xs={12} sm={6} key={fieldItem.name}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
                    {fieldItem.label}
                  </Typography>
                  <Typography variant='h6' sx={{ fontWeight: 600 }}>
                    {priceFormatWIthCurrency(selectedRow[fieldItem.name], false)}
                  </Typography>
                </Box>
              </Grid>
            ))}

            {/* Notes Section */}
            {selectedRow.notes && (
              <>
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant='h6' sx={{ mb: 2 }}>
                    Catatan
                  </Typography>
                  <Box
                    sx={{
                      p: 3,
                      borderRadius: 1,
                      backgroundColor: 'action.hover',
                      border: theme => `1px solid ${theme.palette.divider}`
                    }}
                  >
                    <Typography variant='body2' sx={{ whiteSpace: 'pre-wrap' }}>
                      {selectedRow.notes}
                    </Typography>
                  </Box>
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>
        <DialogActions
          sx={{
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Button variant='contained' onClick={handleClose}>
            Tutup
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}
