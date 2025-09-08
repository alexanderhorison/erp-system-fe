import {
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  IconButton,
  Box
} from '@mui/material'
import { styled } from '@mui/material/styles'
import Icon from 'src/@core/components/icon'

// Styled close button
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

export default function BaseModal({
  open,
  onClose,
  onSubmit,
  title,
  size = 'sm', // default size
  children,
  showActions = true,
  submitLabel = 'Save',
  cancelLabel = 'Cancel'
}) {
  return (
    <Dialog
      fullWidth
      open={open}
      maxWidth={size}
      scroll='body'
      onClose={onClose}
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <form onSubmit={onSubmit}>
        <DialogContent
          sx={{
            pb: theme => `${theme.spacing(8)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          {/* Close button */}
          <CustomCloseButton onClick={onClose}>
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </CustomCloseButton>

          {/* Title */}
          {title && (
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Typography variant='h3' sx={{ mb: 3 }}>
                {title}
              </Typography>
            </Box>
          )}

          {/* Dynamic content */}
          {children}
        </DialogContent>

        {/* Actions */}
        <DialogActions
          sx={{
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          {showActions && (

            <>
              <Button variant='tonal' color='secondary' onClick={onClose}>
                {cancelLabel}
              </Button>
              <Button type='submit' variant='contained'>
                {submitLabel}
              </Button>
            </>
          )}
        </DialogActions>
      </form>
    </Dialog>
  )
}