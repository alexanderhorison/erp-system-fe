// ** React Imports
import { useCallback, useEffect, useMemo, useState } from 'react'

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

// ** Styles Import
import 'react-credit-cards/es/styles-compiled.css'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { CircularProgress, IconButton } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { addMasterDataCategory, editMasterDataCategory } from 'src/store/apps/master/category'
import { fetchDetailProductPos, updateFavoriteProductPos } from 'src/store/apps/pos'
import FormInputText from '../common/Form/FormInputText'
import FormInputNumberPos from '../common/FormPos/FormInputNumberPos'
import FormInputPricePos from '../common/FormPos/FormInputPricePos'

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

const saveToLocalStorage = (data) => localStorage.setItem('listProductPos', JSON.stringify(data))

export default function ModalAddProductPos({
  open,
  setOpen,
  data,
  addProduct,
  fields,
}) {
  const dispatch = useDispatch()
  const { detailProductPos, loadingDetailProductPos } = useSelector(state => state.pos)

  const [selected, setSelected] = useState(null)

  // SHCEMA YUP VALIDATION
  const schema = yup.object().shape({
    // name: yup.string().required('Nama kategori harus diisi')
  })

  // REACT FORM
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    values: {
      price: selected?.basePrice,
    },
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  // ON SUBMIT
  const onSubmit = val => {
    let tempProduct = {
      subTotal: val?.price * val?.quantity,
      quantity: val?.quantity,
      price: val?.price,
      warehouseProductId: selected?.id,
      qty: selected?.quantity,
      masterProductId: selected?.productId,
      rackName: selected?.rackName,
      unitName: selected?.unitName,
      productName: selected?.productName,
      notes: val?.notes,
      title: val?.title || ""
    }
    console.log(tempProduct);
    addProduct(tempProduct)
    saveToLocalStorage([...fields, tempProduct])
    setOpen(false)
  }

  // CLOSE MODAL AND RESET FORM
  const handleClose = () => {
    setOpen(false)
  }

  const handleFav = () => {
    const warehouse = JSON.parse(localStorage.getItem('warehousePos'))
    const sendData = {
      productId: data.productId,
      isFavorite: !data.isFavorite,
      warehouseId: warehouse?.warehouseId,
    }
    dispatch(updateFavoriteProductPos({ data: sendData }))
  }

  const tempQuantity = useCallback(() => {
    return selected?.quantity || ""
  }, [selected])

  useEffect(() => {
    dispatch(fetchDetailProductPos({ warehouseId: 6, productId: data?.productId }))
  }, [data?.id])

  return (
    <Card>
      <Dialog
        fullWidth
        open={open}
        maxWidth='sm'
        scroll='body'
        onClose={handleClose}
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' }, zoom: 1.2 }}
      >
        {loadingDetailProductPos && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 10,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              bgcolor: 'rgba(255, 255, 255, 0.8)',
            }}
          >
            <CircularProgress />
          </Box>
        )}
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
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant='h4' sx={{}}>
                {data?.productName}
              </Typography>
            </Box>

            <Grid container spacing={6} mt={1}>
              <Grid item>
                <Grid container spacing={2} alignItems={'center'}>
                  {
                    detailProductPos?.map((item, index) => (
                      <Grid item key={index}>
                        <Button variant={selected?.unitName === item.unitName ? 'contained' : 'outlined'} onClick={() => setSelected(item)}>{item.unitName}</Button>
                      </Grid>
                    ))
                  }
                </Grid>
                {
                  !selected?.unitName && (
                    <Typography mt={2} variant='body2' sx={{ color: 'error.main' }}>
                      *Silahkan pilih satuan
                    </Typography>
                  )
                }
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={6}>
                  <Grid item xs={6}>
                    <FormInputPricePos
                      control={control}
                      name='price'
                      errors={errors}
                      label='Harga'
                      disabled={selected ? false : true}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormInputNumberPos
                      multiline
                      rows={1}
                      control={control}
                      name='quantity'
                      errors={errors}
                      label={`Stock: ${tempQuantity()}`}
                      max={tempQuantity()}
                      disabled={selected ? false : true}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormInputText
                      multiline
                      rows={3}
                      control={control}
                      name='notes'
                      errors={errors}
                      label='Notes'
                      disabled={selected ? false : true}
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
            <Grid container spacing={6}>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant='outlined'
                  color='secondary'
                  onClick={handleFav}
                  startIcon={
                    <Icon
                      icon={data.isFavorite ? 'tabler:star-filled' : 'tabler:star'} // Gunakan ikon sesuai status
                      fontSize="1.25rem" // Ukuran ikon
                      style={{
                        color: data.isFavorite ? 'orange' : 'inherit', // Warna kuning jika favorit
                      }}
                    />
                  }
                  sx={{
                    borderColor: data.isFavorite ? 'orange' : 'secondary.main', // Border tombol dinamis
                    color: data.isFavorite ? 'orange' : 'secondary.main', // Warna teks tombol dinamis
                  }}
                >
                  Favourite
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button fullWidth type='submit' variant='contained'>
                  Save
                </Button>
              </Grid>
            </Grid>
          </DialogActions>
        </form>
      </Dialog>
    </Card>
  )
}
