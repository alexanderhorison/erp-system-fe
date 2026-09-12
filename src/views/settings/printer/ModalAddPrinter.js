import { yupResolver } from '@hookform/resolvers/yup'
import Grid from '@mui/material/Grid'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAddPrinter, fetchEditPrinter } from 'src/store/apps/config/configPrinter'
import FormInputText from 'src/views/common/Form/FormInputText'
import FormSelectSimple from 'src/views/common/Form/FormSelectSimple'
import * as yup from 'yup'

// ** Shared Components
import AppModal from 'src/views/common/AppModal'

const printerTypes = [
  { value: 'PRINTER_POS', label: 'Printer POS' },
  { value: 'PRINTER_DOT_MATRIX', label: 'Printer Dot Matrix' },
  { value: 'PRINTER_INJECT', label: 'Printer Inject' }
]

const schema = yup.object().shape({
  printerName: yup.string().required('Nama printer harus diisi'),
  ip: yup.string().required('IP printer harus diisi'),
  printerType: yup.string().required('Tipe printer harus dipilih'),
  description: yup.string().optional()
})

const defaultValues = {
  printerName: '',
  ip: '',
  printerType: 'PRINTER_POS',
  description: ''
}

/**
 * ModalAddPrinter
 * -------------------------------------------------------------------------------------
 * Add/Edit dialog for a printer (Figma: shares the shell used across every
 * add/edit modal this session). View mode has its own dedicated dialog
 * (`ModalViewPrinter`) — this component only ever renders ADD/EDIT.
 */
export default function ModalAddPrinter({ open, setOpen, typeModal }) {
  const dispatch = useDispatch()

  const { printerDetail, loadingPrinterDetail, loadingAddPrinter, loadingEditPrinter } = useSelector(
    state => state.printer
  )

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    values:
      typeModal === 'EDIT'
        ? {
            id: printerDetail?.id,
            printerName: printerDetail?.value || '',
            ip: printerDetail?.value_json?.ip || '',
            printerType: printerDetail?.value_json?.printerType || '',
            description: printerDetail?.description || ''
          }
        : defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const onSubmit = data => {
    const value_json = {
      ip: data?.ip
    }

    // Add queueName for DOT_MATRIX printer
    if (data?.printerType === 'PRINTER_DOT_MATRIX') {
      value_json.queueName = 'lp'
    }

    const payload = {
      key: data?.printerType,
      value: data?.printerName,
      category: 'PRINTER',
      value_json: value_json,
      description: data?.description
    }

    if (typeModal === 'ADD') {
      dispatch(fetchAddPrinter({ payload, setOpen }))
    } else if (typeModal === 'EDIT') {
      dispatch(fetchEditPrinter({ id: data?.id, payload, setOpen }))
    }
  }

  return (
    <AppModal
      open={open}
      onClose={() => setOpen(false)}
      onSubmit={handleSubmit(onSubmit)}
      title={typeModal === 'ADD' ? 'Tambah Printer' : 'Ubah Printer'}
      size='sm'
      loading={typeModal === 'ADD' ? loadingAddPrinter : loadingEditPrinter}
      loadingPage={loadingPrinterDetail && typeModal === 'EDIT'}
    >
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <FormInputText
            label='Nama Printer'
            name='printerName'
            control={control}
            errors={errors}
            placeholder='Masukkan Nama Printer'
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormInputText
            label='Alamat IP'
            name='ip'
            control={control}
            errors={errors}
            placeholder='Contoh: 192.168.50.50'
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormSelectSimple
            label='Tipe Printer'
            name='printerType'
            control={control}
            errors={errors}
            data={printerTypes}
            optionsValue='value'
            optionsLabel='label'
            placeholder='Pilih Tipe Printer'
          />
        </Grid>
        <Grid item xs={12}>
          <FormInputText
            label='Deskripsi'
            name='description'
            control={control}
            errors={errors}
            placeholder='Deskripsi printer'
            multiline
            rows={4}
          />
        </Grid>
      </Grid>
    </AppModal>
  )
}
