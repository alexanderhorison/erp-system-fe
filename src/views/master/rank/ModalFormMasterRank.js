// ** MUI Imports
import {
  Grid,
} from '@mui/material'

// ** Styles Import
import 'react-credit-cards/es/styles-compiled.css'

import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { useEffect } from 'react'
import { fetchMasterDataRank } from 'src/store/apps/master/rank'
import { addMasterDataRank, editMasterDataRank } from 'src/store/apps/master/rank'
import FormInputText from 'src/views/common/Form/FormInputText'
import BaseModal from 'src/views/common/BaseModal'

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

  useEffect(() => {
    dispatch(fetchMasterDataRank())
  }, [])

  return (
    <BaseModal
      open={open}
      onClose={() => setOpen(false)}
      onSubmit={handleSubmit(onSubmit)}
      title={typeModal === 'ADD'
        ? 'Tambahkan Rank Baru'
        : typeModal === 'VIEW'
          ? 'Detail Rank'
          : 'Ubah Rank'}
      size="sm"
      showActions={typeModal !== 'VIEW'}
    >
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
    </BaseModal>
  )
}
