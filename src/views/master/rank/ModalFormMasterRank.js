// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Third Party Imports
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

// ** Store
import { addMasterDataRank, editMasterDataRank } from 'src/store/apps/master/rank'

// ** Shared Components
import FormInputText from 'src/views/common/Form/FormInputText'
import AppModal from 'src/views/common/AppModal'

export default function ModalFormMasterRank({ open, setOpen, typeModal, id }) {
  const dispatch = useDispatch()
  const { defaultValue, detail: detailRank, loadingAdd, loadingEdit } = useSelector(state => state.masterRank)

  // SCHEMA YUP VALIDATION
  const schema = yup.object().shape({
    name: yup.string().required('Nama rank harus diisi'),
    description: yup.string().optional(),
    level: yup.number().required('Level rank harus diisi').typeError('Level rank harus angka')
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

  return (
    <AppModal
      open={open}
      onClose={() => setOpen(false)}
      onSubmit={handleSubmit(onSubmit)}
      title={typeModal === 'ADD' ? 'Tambah Rank Baru' : typeModal === 'VIEW' ? 'Detail Rank' : 'Ubah Rank'}
      size='sm'
      showActions={typeModal !== 'VIEW'}
      loading={typeModal === 'ADD' ? loadingAdd : loadingEdit}
    >
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <FormInputText
            label='Nama Rank'
            name='name'
            control={control}
            errors={errors}
            disabled={typeModal === 'VIEW'}
            placeholder='Masukkan Nama Rank'
          />
        </Grid>
        <Grid item xs={12}>
          <FormInputText
            label='Level Rank'
            name='level'
            control={control}
            errors={errors}
            disabled={typeModal === 'VIEW'}
            placeholder='Masukkan Level Rank'
          />
        </Grid>
        <Grid item xs={12}>
          <FormInputText
            label='Deskripsi'
            name='description'
            control={control}
            errors={errors}
            disabled={typeModal === 'VIEW'}
            placeholder='Masukkan Deskripsi'
            multiline
            rows={4}
          />
        </Grid>
      </Grid>
    </AppModal>
  )
}
