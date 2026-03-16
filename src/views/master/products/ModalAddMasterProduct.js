// ** React Imports
import { useEffect } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Styles Import
import 'react-credit-cards/es/styles-compiled.css'

// ** Icon Imports
import { MenuItem } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDataMasterCategory } from 'src/store/apps/master/category'
import { fetchMasterDataType } from 'src/store/apps/master/type'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { addMasterDataPorduct, editMasterDataPorduct } from 'src/store/apps/master/product'
import { fetchMasterDataCompany } from 'src/store/apps/master/company'
import BaseModal from 'src/views/common/BaseModal'

export default function ModalAddMasterProduct({ open, setOpen, typeModal, id }) {
  const dispatch = useDispatch()
  const { data: masterDataCategory } = useSelector(state => state.category)
  const { data: masterDataCompany } = useSelector(state => state.company)
  const { data: masterDataType } = useSelector(state => state.type)
  const { defaultValue, detail: detailProduct, loadingAdd, loadingEdit } = useSelector(state => state.masterProduct)

  // SHCEMA YUP VALIDATION
  const schema = yup.object().shape({
    name: yup.string().required('Nama tidak boleh kosong'),
    categoryId: yup.string().required('Kategori harus dipilih'),
    companyId: yup.string().required('Perusahaan harus dipilih'),
    typeId: yup.string().required('Tipe harus dipilih')
  })

  // REACT FORM
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    values: typeModal === 'ADD' ? defaultValue : detailProduct,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  // ON SUBMIT
  const onSubmit = data => {
    const transformedData = {
      ...data,
      TypeId: Number(data.TypeId),
      CompanyId: Number(data.CompanyId),
      CategoryId: Number(data.CategoryId)
    }

    if (typeModal === 'ADD') {
      dispatch(addMasterDataPorduct(transformedData))
    } else {
      dispatch(editMasterDataPorduct({ id, data: transformedData }))
    }
    setOpen(false)
  }

  useEffect(() => {
    dispatch(fetchDataMasterCategory())
    dispatch(fetchMasterDataType())
    dispatch(fetchMasterDataCompany())
    // disable warn for select if select not have a child item
    console.warn = () => {}
  }, [dispatch])

  return (
    <BaseModal
      open={open}
      onClose={() => setOpen(false)}
      onSubmit={handleSubmit(onSubmit)}
      title={typeModal === 'ADD' ? 'Tambahkan Produk Baru' : typeModal === 'VIEW' ? 'Detail Produk' : 'Ubah Produk'}
      size='sm'
      showActions={typeModal !== 'VIEW'}
      loading={typeModal === 'ADD' ? loadingAdd : loadingEdit}
    >
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Grid container spacing={6}>
            <Grid item xs={12} sm={12}>
              <Controller
                name='name'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    label='Nama Produk'
                    placeholder=''
                    onChange={onChange}
                    disabled={typeModal === 'VIEW'}
                    error={Boolean(errors.name)}
                    aria-describedby='validation-schema-name'
                    {...(errors.name && { helperText: errors.name.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6} sm={6}>
              <Controller
                name='categoryId'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    select
                    fullWidth
                    label='Kategori'
                    value={value || ''}
                    onChange={onChange}
                    disabled={typeModal === 'VIEW'}
                    error={Boolean(errors.categoryId)}
                    aria-describedby='validation-schema-categoryId'
                    {...(errors.categoryId && { helperText: errors.categoryId.message })}
                  >
                    {masterDataCategory.map(item => {
                      return (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      )
                    })}
                  </CustomTextField>
                )}
              />
            </Grid>
            <Grid item xs={6} sm={6}>
              <Controller
                name='typeId'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    select
                    fullWidth
                    label='Tipe'
                    value={value || ''}
                    onChange={onChange}
                    disabled={typeModal === 'VIEW'}
                    error={Boolean(errors.typeId)}
                    aria-describedby='validation-schema-typeId'
                    {...(errors.typeId && { helperText: errors.typeId.message })}
                  >
                    {masterDataType.map(item => {
                      return (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      )
                    })}
                  </CustomTextField>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <Controller
                name='companyId'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    select
                    fullWidth
                    label='Perusahaan'
                    value={value || ''}
                    onChange={onChange}
                    disabled={typeModal === 'VIEW'}
                    error={Boolean(errors.companyId)}
                    aria-describedby='validation-schema-companyId'
                    {...(errors.companyId && { helperText: errors.companyId.message })}
                  >
                    {masterDataCompany.map(item => {
                      return (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      )
                    })}
                  </CustomTextField>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='description'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    rows={4}
                    value={value}
                    fullWidth
                    multiline
                    onChange={onChange}
                    disabled={typeModal === 'VIEW'}
                    label='Deskripsi'
                    error={Boolean(errors.description)}
                    aria-describedby='validation-basic-description'
                    {...(errors.description && { helperText: 'This field is required' })}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </BaseModal>
  )
}
