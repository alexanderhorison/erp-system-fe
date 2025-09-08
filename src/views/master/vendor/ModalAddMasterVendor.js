// ** MUI Imports
import {
  Grid,
} from '@mui/material'

// ** Styles Import
import 'react-credit-cards/es/styles-compiled.css'

// ** Icon Imports

import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { useEffect } from 'react'
import { fetchMasterDataRank } from 'src/store/apps/master/rank'
import FormSelectSimple from 'src/views/common/Form/FormSelectSimple'
import { addMasterDataVendor, editMasterDataVendor } from 'src/store/apps/master/vendor'
import FormInputText from 'src/views/common/Form/FormInputText'
import BaseModal from 'src/views/common/BaseModal'


export default function ModalAddMasterVendor({ open, setOpen, typeModal, id }) {
  const dispatch = useDispatch()
  const { defaultValue, detail: detailVendor } = useSelector(state => state.masterVendor)
  const { data: dataRank } = useSelector(state => state.masterRank)

  // SHCEMA YUP VALIDATION
  const schema = yup.object().shape({
    name: yup.string().required('Nama company harus diisi'),
    phoneNumber: yup.string().required('Nomor telepon harus diisi'),
    address: yup.string().optional(),
    email: yup.string().email('Masukkan email yang valid').optional(),
    description: yup.string().optional(),
    gender: yup.string().required('Jenis kelamin harus diisi'),
    notes: yup.string().optional(),
    rankId: yup.number().required('Rank harus dipilih'),
  })

  // REACT FORM
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    values: typeModal === 'ADD' ? defaultValue : detailVendor,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  // ON SUBMIT
  const onSubmit = data => {
    if (typeModal === 'ADD') {
      dispatch(addMasterDataVendor({ data, setOpen }))
    } else {
      dispatch(editMasterDataVendor({ id, data, setOpen }))
    }
  }

  useEffect(() => {
    dispatch(fetchMasterDataRank())
  }, [])

  return (
    <BaseModal
      open={open}
      onClose={() => setOpen(false)}
      onSubmit={handleSubmit(onSubmit)}
      title={typeModal === 'ADD'
        ? 'Tambahkan Vendor Baru'
        : typeModal === 'VIEW'
          ? 'Detail Vendor'
          : 'Ubah Vendor'}
      size="sm"
      showActions={typeModal !== 'VIEW'}
    >
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Grid container spacing={6}>
            <Grid item xs={12} sm={12}>
              <FormInputText
                label={'Name Vendor'}
                name={'name'}
                control={control}
                errors={errors}
                disabled={typeModal === 'VIEW'}
                placeholder='Masukkan Name Vendor'
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <FormInputText
                label={'Alamat Vendor'}
                name={'address'}
                control={control}
                errors={errors}
                disabled={typeModal === 'VIEW'}
                placeholder='Masukkan Alamat Vendor'
                multiline={true}
                rows={3}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <FormInputText
                label={'Nomor Telepon'}
                name={'phoneNumber'}
                control={control}
                errors={errors}
                disabled={typeModal === 'VIEW'}
                placeholder='Masukkan Nomor Telepon'
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <FormInputText
                label={'Email'}
                name={'email'}
                control={control}
                errors={errors}
                disabled={typeModal === 'VIEW'}
                placeholder='Masukkan Email'
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <FormSelectSimple
                label={'Pilih Jenis Kelamin'}
                control={control}
                errors={errors}
                disabled={typeModal === 'VIEW'}
                data={[
                  { value: "Laki-laki", name: 'Laki-laki' },
                  { value: "Perempuan", name: 'Perempuan' },
                  { value: "Lainnya", name: 'Lainnya' }
                ]}
                name={'gender'}
                optionsValue={'value'}
                optionsLabel={'name'}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <FormSelectSimple
                label={'Pilih Rank'}
                control={control}
                errors={errors}
                disabled={typeModal === 'VIEW'}
                data={dataRank}
                name={'rankId'}
                optionsValue={'id'}
                optionsLabel={'name'}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <FormInputText
                label={'Catatan'}
                name={'notes'}
                control={control}
                errors={errors}
                disabled={typeModal === 'VIEW'}
                placeholder='Masukkan Catatan'
                multiline={true}
                rows={4}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </BaseModal>
    // <Card>
    //   <Dialog
    //     fullWidth
    //     open={open}
    //     maxWidth='sm'
    //     scroll='body'
    //     onClose={handleClose}
    //     sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    //   >
    //     <form onSubmit={handleSubmit(onSubmit)}>
    //       <DialogContent
    //         sx={{
    //           pb: theme => `${theme.spacing(8)} !important`,
    //           px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
    //           pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
    //         }}
    //       >
    //         <CustomCloseButton onClick={handleClose}>
    //           <Icon icon='tabler:x' fontSize='1.25rem' />
    //         </CustomCloseButton>
    //         <Box sx={{ mb: 4, textAlign: 'center' }}>
    //           <Typography variant='h3' sx={{ mb: 3 }}>
    //             {typeModal === 'ADD'
    //               ? 'Tambahkan Vendor Baru'
    //               : typeModal === 'VIEW'
    //                 ? 'Detail Vendor'
    //                 : 'Ubah Vendor'}
    //           </Typography>
    //         </Box>

    //       </DialogContent>
    //       <DialogActions
    //         sx={{
    //           justifyContent: 'end',
    //           px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
    //           pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
    //         }}
    //       >
    //         {typeModal !== 'VIEW' && (
    //           <>
    //             <Button variant='tonal' color='secondary' onClick={handleClose} hidden={typeModal === 'VIEW'}>
    //               Cancel
    //             </Button>
    //             <Button type='submit' variant='contained' hidden={typeModal === 'VIEW'}>
    //               Submit
    //             </Button>
    //           </>
    //         )}
    //       </DialogActions>
    //     </form>
    //   </Dialog>
    // </Card>
  )
}
