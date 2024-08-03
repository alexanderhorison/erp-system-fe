// ** React Imports
import { useEffect, useMemo } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Styles Import
import 'react-credit-cards/es/styles-compiled.css'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { IconButton, MenuItem } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDataMasterCategory } from 'src/store/apps/master/category'
import { fetchMasterDataType } from 'src/store/apps/master/type'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { addMasterDataPorduct, editMasterDataPorduct } from 'src/store/apps/master/product'
import { fetchMasterDataCompany } from 'src/store/apps/master/company'

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

export default function ModalAddMasterProduct({ open, setOpen, typeModal, id }) {
  const dispatch = useDispatch()
  const { data: masterDataCategory } = useSelector(state => state.category)
  const { data: masterDataCompany } = useSelector(state => state.company)
  const { data: masterDataType } = useSelector(state => state.type)
  const { defaultValue, detail: detailProduct } = useSelector(state => state.masterProduct)

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

  // CLOSE MODAL AND RESET FORM
  const handleClose = () => {
    setOpen(false)
  }

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
                {typeModal === 'ADD' ? 'Tambahkan Produk Baru' : typeModal === 'VIEW' ? 'Detail Produk' : 'Ubah Produk'}
              </Typography>
            </Box>
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
          </DialogContent>
          <DialogActions
            sx={{
              justifyContent: 'center',
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
