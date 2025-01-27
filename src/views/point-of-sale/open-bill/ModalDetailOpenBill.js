import { Button, Card, Dialog, DialogContent, Grid, IconButton, Typography } from "@mui/material";
import { Box } from "@mui/system";
import Icon from 'src/@core/components/icon'
import { styled } from '@mui/material/styles'
import DetailOpenBill from "./DetailOpenBill";
import { swalConfirmationOnly } from "src/helpers/swalFunctionPos";
import DetailOpenBillAndTransaction from "./DetailOpenBillAndTransaction";
import { CustomCloseButton } from "src/views/pages/dialog-examples/DialogEditUserInfo";

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
        localStorage.setItem('billId', JSON.stringify(selectedBill?.id))
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
            height: "85vh",
            overflow: "auto"
          }}
        >
          <CustomCloseButton onClick={() => setOpen(false)}>
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </CustomCloseButton>
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
          {/* <DetailOpenBill data={data} /> */}
          <DetailOpenBillAndTransaction data={data} type='openBill' />
        </DialogContent>
      </Dialog>
    </Card>
  )
}