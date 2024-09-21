// ** MUI Imports
// import Box from '@mui/material/Box'
import {
  Box,
  Card,
  Grid,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
} from '@mui/material'
import { styled } from '@mui/material/styles'

// ** Styles Import
import 'react-credit-cards/es/styles-compiled.css'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { useEffect } from 'react'
import { fetchMasterDataRank } from 'src/store/apps/master/rank'
import { addMasterDataRank, editMasterDataRank } from 'src/store/apps/master/rank'
import FormInputText from 'src/views/common/Form/FormInputText'

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

export default function ModalFormMasterRank({ open, setOpen, typeModal, id }) {
  const dispatch = useDispatch()
  const { defaultValue, detail: detailRank } = useSelector(state => state.masterRank)

  // SHCEMA YUP VALIDATION
  const schema = yup.object().shape({
    name: yup.string().required('Nama rank harus diisi'),
    description: yup.string().optional(),
    level: yup.number().required('Level rank harus diisi').typeError("Level rank harus angka"),
  })

  // REACT FORM
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    values: typeModal === 'ADD' ? defaultValue : detailRank,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  // ON SUBMIT
  const onSubmit = data => {
    if (typeModal === 'ADD') {
      dispatch(addMasterDataRank({ data, setOpen }))
    } else {
      dispatch(editMasterDataRank({ id, data, setOpen }))
    }
  }

  // CLOSE MODAL AND RESET FORM
  const handleClose = () => {
    setOpen(false)
  }

  useEffect(() => {
    dispatch(fetchMasterDataRank())
  }, [])

  return (
    <Card>
      <Dialog
        fullWidth
        open={open}
        maxWidth='sm'
        scroll='body'
        onClose={handleClose}
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
            <CustomCloseButton onClick={handleClose}>
              <Icon icon='tabler:x' fontSize='1.25rem' />
            </CustomCloseButton>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Typography variant='h3' sx={{ mb: 3 }}>
                {typeModal === 'ADD'
                  ? 'Tambahkan Rank Baru'
                  : typeModal === 'VIEW'
                    ? 'Detail Rank'
                    : 'Ubah Rank'}
              </Typography>
            </Box>
            <Grid container spacing={6}>
              <Grid item xs={12}>
                <Grid container spacing={6}>
                  <Grid item xs={12} sm={12}>
                    <FormInputText
                      label={'Name Rank'}
                      name={'name'}
                      control={control}
                      errors={errors}
                      disabled={typeModal === 'VIEW'}
                      placeholder='Masukkan Name Rank'
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <FormInputText
                      label={'Deskripsi'}
                      name={'description'}
                      control={control}
                      errors={errors}
                      disabled={typeModal === 'VIEW'}
                      placeholder='Masukkan Deskripsi'
                      multiline
                      rows={4}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <FormInputText
                      label={'Level Rank'}
                      name={'level'}
                      control={control}
                      errors={errors}
                      disabled={typeModal === 'VIEW'}
                      placeholder='Masukkan Level Rank'
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions
            sx={{
              justifyContent: 'end',
              px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
              pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
            }}
          >
            {typeModal !== 'VIEW' && (
              <>
                <Button variant='tonal' color='secondary' onClick={handleClose} hidden={typeModal === 'VIEW'}>
                  Cancel
                </Button>
                <Button type='submit' variant='contained' hidden={typeModal === 'VIEW'}>
                  Submit
                </Button>
              </>
            )}
          </DialogActions>
        </form>
      </Dialog>
    </Card>
  )
}
