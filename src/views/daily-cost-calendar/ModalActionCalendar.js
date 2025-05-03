import React from "react";
import {
  Typography,
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  Button,
} from "@mui/material";
import dayjs from "dayjs";
import { priceFormatWIthCurrency } from "src/helpers/priceFormatter";
import Icon from 'src/@core/components/icon'
import "dayjs/locale/id";
import { CustomCloseButton } from "../pages/dialog-examples/DialogEditUserInfo";

export default function ModalActionCalendar({ open, onClose, selectedDate, expensesByDate }) {
  return (
    <Card>
      <Dialog
        open={open}
        onClose={onClose}
        scroll='body'
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
        <DialogTitle>
          {selectedDate && dayjs(selectedDate).format("dddd, D MMMM YYYY")}
        </DialogTitle>
        <DialogContent
          sx={{
            pb: theme => `${theme.spacing(8)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}>
          <CustomCloseButton onClick={onClose}>
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </CustomCloseButton>
          {selectedDate && (
            <>
              <Typography gutterBottom>
                Total: {priceFormatWIthCurrency(expensesByDate[selectedDate] || 0)}
              </Typography>
              <Stack direction="row" spacing={2} mt={2}>
                {expensesByDate[selectedDate] ? (
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        // TODO: Handle Edit
                        alert(`Edit clicked on ${selectedDate}`);
                        setOpenModal(false);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => {
                        // TODO: Handle Clear
                        alert(`Clear clicked on ${selectedDate}`);
                        setOpenModal(false);
                      }}
                    >
                      Clear
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => {
                      // TODO: Handle Add
                      alert(`Add clicked on ${selectedDate}`);
                      setOpenModal(false);
                    }}
                  >
                    Add
                  </Button>
                )}
                <Button onClick={onClose}>Close</Button>
              </Stack>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}