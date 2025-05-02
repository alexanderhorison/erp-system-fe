import { Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent, Grid, Typography } from "@mui/material";
import ModalConfirmation from "../common/ModalConfirmation";
import { useForm } from "react-hook-form";
import { CustomCloseButton } from "../pages/dialog-examples/DialogEditUserInfo";
import Icon from 'src/@core/components/icon'

export default function SettingDailyCost({ open, onClose }) {

  const {
    handleSubmit,
  } = useForm({
    mode: 'onChange',
    // resolver: yupResolver(schema)
  })

  const onSubmit = payload => {
    console.log("submit");
  }

  return (
    <Card>
      <Dialog
        fullWidth
        open={open}
        maxWidth='sm'
        scroll='body'
        onClose={onClose}
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent
            sx={{
              pb: theme => `${theme.spacing(8)} !important`,
              px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
              pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
            }}
          >
            <CustomCloseButton onClick={onClose}>
              <Icon icon='tabler:x' fontSize='1.25rem' />
            </CustomCloseButton>
          </DialogContent>
          <DialogActions
            sx={{
              px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
              pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
            }}
          >
            <>
              <Button variant='tonal' color='secondary' onClick={onClose}>
                Cancel
              </Button>
              <Button type='submit' variant='contained'>
                Submit
              </Button>
            </>
          </DialogActions>
        </form>

      </Dialog>

    </Card>
  )
}