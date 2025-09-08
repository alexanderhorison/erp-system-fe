import { yupResolver } from "@hookform/resolvers/yup";
import { Grid } from "@mui/material";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { fetchAddPrinter, fetchEditPrinter } from "src/store/apps/config/configPrinter";
import BaseModal from "src/views/common/BaseModal";
import FormInputText from "src/views/common/Form/FormInputText";
import * as yup from 'yup'

export default function ModalAddPrinter({
  open,
  setOpen,
  typeModal,
}) {
  const dispatch = useDispatch()

  const { printerDetail, loadingPrinterDetail } = useSelector(state => state.printer)

  const schema = yup.object().shape({
    printerName: yup.string().required('Nama printer harus diisi'),
    ip: yup.string().required('IP printer harus diisi'),
    hostname: yup.string().optional(),
    description: yup.string().optional(),
  })

  // FORM FOR PRINTER 
  const defaultValues = {
    printerName: "",
    ip: "",
    hostname: "",
    description: "",
  }
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    values:
      typeModal === 'EDIT' || typeModal === 'VIEW' ?
        {
          id: printerDetail?.id,
          printerName: printerDetail?.value || "",
          ip: printerDetail?.value_json?.ip || "",
          hostname: printerDetail?.value_json?.hostname || "",
          description: printerDetail?.description || "",
        } : defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const onSubmit = data => {
    const payload = {
      key: "PRINTER_SETTING",
      value: data?.printerName,
      category: "PRINTER",
      value_json: {
        col: 48,
        maxProductName: 29,
        connection_type: "ethernet",
        domain_type: "IP",
        hostname: data?.hostname,
        ip: data?.ip,
        port: 8034,
      },
      description: data?.description,
    }

    if (typeModal === 'ADD') {
      dispatch(fetchAddPrinter({ payload, setOpen }))
    } else if (typeModal === 'EDIT') {
      dispatch(fetchEditPrinter({ id: data?.id, payload, setOpen }))
    }
  }

  const titleModal = useMemo(() => {
    if (typeModal === 'ADD') {
      return 'Tambahkan Printer'
    } else if (typeModal === 'EDIT') {
      return 'Edit Printer'
    } else {
      return 'Detail Printer'
    }
  }, [typeModal])

  return (
    <BaseModal
      open={open}
      onClose={() => setOpen(false)}
      onSubmit={handleSubmit(onSubmit)}
      title={titleModal}
      size="sm"
      showActions={typeModal !== 'VIEW'}
    >
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Grid container spacing={6}>
            <Grid item xs={12} sm={12}>
              <FormInputText
                loading={loadingPrinterDetail}
                label={'Nama Printer'}
                name={'printerName'}
                control={control}
                errors={errors}
                disabled={typeModal === 'VIEW'}
                placeholder='Masukkan Nama Printer'
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormInputText
                loading={loadingPrinterDetail}
                label={'Alamat IP'}
                name={'ip'}
                control={control}
                errors={errors}
                disabled={typeModal === 'VIEW'}
                placeholder='Contoh: 192.168.50.50'
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormInputText
                loading={loadingPrinterDetail}
                label={'Hostname'}
                name={'hostname'}
                control={control}
                errors={errors}
                disabled={typeModal === 'VIEW'}
                placeholder='Contoh: printer.local'
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <FormInputText
                loading={loadingPrinterDetail}
                label={'Deskripsi'}
                name={'description'}
                control={control}
                errors={errors}
                disabled={typeModal === 'VIEW'}
                placeholder='Deskripsi printer'
                multiline
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
    //     maxWidth='sm'
    //     scroll='body'
    //     sx={{ '& .MuiDialog-paper': { overflow: 'visible', pb: 4 } }}
    //     open={open}
    //     onClose={() => setOpen(false)}
    //   >
    //     <form onSubmit={handleSubmit(onSubmit)}>
    //       <DialogContent>
    //         <CustomCloseButton onClick={() => setOpen(false)}>
    //           <Icon icon='tabler:x' fontSize='1.25rem' />
    //         </CustomCloseButton>
    //         <Box sx={{ textAlign: 'center' }}>
    //           <Typography variant='h4' sx={{ mb: 4 }}>
    //             {titleModal}
    //           </Typography>
    //         </Box>
    //         <Grid container spacing={6}>
    //           <Grid item xs={12}>
    //             <Grid container spacing={6}>
    //               <Grid item xs={12} sm={12}>
    //                 <FormInputText
    //                   loading={loadingPrinterDetail}
    //                   label={'Nama Printer'}
    //                   name={'printerName'}
    //                   control={control}
    //                   errors={errors}
    //                   disabled={typeModal === 'VIEW'}
    //                   placeholder='Masukkan Nama Printer'
    //                   required
    //                 />
    //               </Grid>
    //               <Grid item xs={12} sm={6}>
    //                 <FormInputText
    //                   loading={loadingPrinterDetail}
    //                   label={'Alamat IP'}
    //                   name={'ip'}
    //                   control={control}
    //                   errors={errors}
    //                   disabled={typeModal === 'VIEW'}
    //                   placeholder='Contoh: 192.168.50.50'
    //                   required
    //                 />
    //               </Grid>
    //               <Grid item xs={12} sm={6}>
    //                 <FormInputText
    //                   loading={loadingPrinterDetail}
    //                   label={'Hostname'}
    //                   name={'hostname'}
    //                   control={control}
    //                   errors={errors}
    //                   disabled={typeModal === 'VIEW'}
    //                   placeholder='Contoh: printer.local'
    //                 />
    //               </Grid>
    //               <Grid item xs={12} sm={12}>
    //                 <FormInputText
    //                   loading={loadingPrinterDetail}
    //                   label={'Deskripsi'}
    //                   name={'description'}
    //                   control={control}
    //                   errors={errors}
    //                   disabled={typeModal === 'VIEW'}
    //                   placeholder='Deskripsi printer'
    //                   multiline
    //                   rows={4}
    //                 />
    //               </Grid>
    //             </Grid>
    //           </Grid>
    //         </Grid>
    //       </DialogContent>
    //       <DialogActions
    //         sx={{
    //           justifyContent: 'end',
    //         }}
    //       >
    //         {typeModal !== 'VIEW' && (
    //           <>
    //             <Button variant='tonal' color='secondary' onClick={() => setOpen(false)} hidden={typeModal === 'VIEW'}>
    //               Batal
    //             </Button>
    //             <Button type='submit' variant='contained' hidden={typeModal === 'VIEW'}>
    //               Simpan
    //             </Button>
    //           </>
    //         )}
    //       </DialogActions>
    //     </form>
    //   </Dialog>
    // </Card>
  )
}