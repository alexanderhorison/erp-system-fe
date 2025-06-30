import { Box, Button, Card, Dialog, DialogActions, DialogContent, Grid, Typography, Divider } from '@mui/material'
import Icon from 'src/@core/components/icon'
import CustomCloseButton from 'src/views/common/CustomCloseButton'
import { priceFormatWIthCurrency } from 'src/helpers/priceFormatter'
import { returnFormatDateDay, returnFormatMonthYear } from 'src/helpers/formatDate'

export default function ModalDetailMonthlyNonCurrentAsset({ open, setOpen, selectedRow }) {
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
              Detail Aset Tidak Lancar Bulanan
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Periode: {returnFormatMonthYear(selectedRow.date)}
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {/* Asset Values Section */}
            <Grid item xs={12}>
              <Typography variant='h6' sx={{ mb: 2 }}>
                Aset
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
                  Depresiasi Kendaraan
                </Typography>
                <Typography variant='h6' sx={{ fontWeight: 600 }}>
                  {priceFormatWIthCurrency(selectedRow.vehicleValue, false)}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
                  Depresiasi Bangunan
                </Typography>
                <Typography variant='h6' sx={{ fontWeight: 600 }}>
                  {priceFormatWIthCurrency(selectedRow.buildingValue, false)}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
                  Tanah
                </Typography>
                <Typography variant='h6' sx={{ fontWeight: 600 }}>
                  {priceFormatWIthCurrency(selectedRow.landValue, false)}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
                  Investasi Jangka Panjang
                </Typography>
                <Typography variant='h6' sx={{ fontWeight: 600 }}>
                  {priceFormatWIthCurrency(selectedRow.longTermInvestment, false)}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
                  Lainnya
                </Typography>
                <Typography variant='h6' sx={{ fontWeight: 600 }}>
                  {priceFormatWIthCurrency(selectedRow.othersValue, false)}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
                  Total Nilai
                </Typography>
                <Typography variant='h6' sx={{ fontWeight: 600 }}>
                  {priceFormatWIthCurrency(selectedRow.totalValue, false)}
                </Typography>
              </Box>
            </Grid>

            {/* Divider */}
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
            </Grid>

            {/* Depreciation Section */}
            <Grid item xs={12}>
              <Typography variant='h6' sx={{ mb: 2 }}>
                Depresiasi
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
                  Depresiasi Tahun Lalu
                </Typography>
                <Typography variant='h6' sx={{ fontWeight: 600 }}>
                  {priceFormatWIthCurrency(selectedRow.previousYearDepreciation, false)}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
                  Depresiasi Tahun Ini
                </Typography>
                <Typography variant='h6' sx={{ fontWeight: 600 }}>
                  {priceFormatWIthCurrency(selectedRow.currentYearDepreciation, false)}
                </Typography>
              </Box>
            </Grid>

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
                      p: 2,
                      backgroundColor: 'action.hover',
                      borderRadius: 1,
                      border: theme => `1px solid ${theme.palette.divider}`
                    }}
                  >
                    <Typography variant='body1'>{selectedRow.notes}</Typography>
                  </Box>
                </Grid>
              </>
            )}

            {/* Timestamp Information */}
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box>
                <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
                  Dibuat pada
                </Typography>
                <Typography variant='body2'>{returnFormatDateDay(selectedRow.createdAt)}</Typography>
              </Box>
            </Grid>
            {/* <Grid item xs={12} sm={6}>
              <Box>
                <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
                  Terakhir diupdate
                </Typography>
                <Typography variant='body2'>{returnFormatDateDay(selectedRow.updatedAt)}</Typography>
              </Box>
            </Grid> */}
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
