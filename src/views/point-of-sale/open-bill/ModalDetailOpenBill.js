import { Button, Card, Dialog, DialogContent, Grid, IconButton, Typography } from "@mui/material";
import { Box } from "@mui/system";
import Icon from 'src/@core/components/icon'
import { styled } from '@mui/material/styles'
import DetailOpenBill from "./DetailOpenBill";
import { swalConfirmationOnly } from "src/helpers/swalFunctionPos";

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

export default function ModalDetailOpenBill({ open, setOpen, data, setSelectedMenu }) {

  const handleRemove = (billId) => {
    swalConfirmationOnly({
      title: 'Hapus Bill?',
      text: 'Apakah anda ingin menghapus bill ini?',
      confirmButtonText: 'Ya, Hapus',
      showCancelButton: true,
      cancelButtonText: 'Tidak',
      icon: 'warning',
      onClickYes: () => {
        const listBill = JSON.parse(localStorage.getItem('openBill'))
        const newBill = listBill.filter(bill => bill.id !== billId)
        localStorage.setItem('openBill', JSON.stringify(newBill))
        setOpen(false)
      },
    })
  }

  const handleSelect = (billId) => {
    const listBill = JSON.parse(localStorage.getItem('openBill'))
    const selectedBill = listBill.filter(bill => bill.id === billId)[0]
    const listProductPos = selectedBill?.products
    const selectedCustomerPos = selectedBill?.customer

    swalConfirmationOnly({
      title: 'Pilih Bill?',
      text: 'Apakah anda ingin memilih bill ini?',
      confirmButtonText: 'Ya, Pilih',
      showCancelButton: true,
      cancelButtonText: 'Tidak',
      icon: 'warning',
      onClickYes: () => {
        localStorage.setItem('listProductPos', JSON.stringify(listProductPos))
        localStorage.setItem('selectedCustomerPos', JSON.stringify(selectedCustomerPos))
        localStorage.setItem('warehousePos', JSON.stringify(selectedBill?.warehouse))
        setSelectedMenu({
          name: "POS",
          code: "POS"
        })
        setOpen(false)
      },
    })
  }

  return (
    <Card>
      <Dialog
        fullWidth
        open={open}
        maxWidth='md'
        scroll='body'
        onClose={() => setOpen(false)}
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' }, zoom: 1 }}
      >
        <DialogContent
          sx={{
            height: "85vh"
          }}
        >
          <CustomCloseButton onClick={() => setOpen(false)}>
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </CustomCloseButton>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant='h4' sx={{}}>
              Detail Open Bill
            </Typography>
          </Box>
          <Grid container py={3} spacing={4}>
            <Grid item xs={6}>
              <Button fullWidth variant='outlined' onClick={() => handleRemove(data.id)}>
                Hapus Bill
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button fullWidth variant='contained' onClick={() => handleSelect(data.id)}>
                Pilih Bill
              </Button>
            </Grid>
          </Grid>
          <DetailOpenBill data={data} />
        </DialogContent>
      </Dialog>
    </Card>
  )
}