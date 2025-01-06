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
import { fetchDetailProductPos, updateFavoriteProductPos } from 'src/store/apps/pos'
import FormInputText from '../common/Form/FormInputText'
import FormInputNumberPos from '../common/FormPos/FormInputNumberPos'
import FormInputPricePos from '../common/FormPos/FormInputPricePos'
import { priceFormatWIthCurrency } from 'src/helpers/priceFormatter'
import { swalConfirmationOnly } from 'src/helpers/swalFunctionPos'

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

export default function ModalEditProductPos({
  open,
  setOpen,
  data,
  updateProduct,
  removeProduct,
}) {
  const dispatch = useDispatch()
  const { detailProductPos, loadingDetailProductPos } = useSelector(state => state.pos)

  const [selected, setSelected] = useState(null)
  const [isFavorite, setIsFavorite] = useState(false)

  // SHCEMA YUP VALIDATION
  const schema = yup.object().shape({
    price: yup.string().required('Harga harus diisi'),
    quantity: yup.string().required('Kuantiti harus diisi'),
  })

  // REACT FORM
  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
    watch,
  } = useForm({
    values: {
      price: selected?.price || null,
      quantity: selected?.quantity || null,
    },
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  // ON SUBMIT
  const onSubmit = val => {
    let tempProduct = {
      id: selected?.id,
      subTotal: val?.price * val?.quantity,
      quantity: val?.quantity,
      price: val?.price,
      warehouseProductId: selected?.warehouseProductId,
      qty: selected?.qty,
      masterProductId: selected?.productId,
      rackName: selected?.rackName,
      unitName: selected?.unitName,
      productName: selected?.productName,
      notes: val?.notes,
      title: val?.title || "",
      productId: selected?.productId,
    }
    updateProduct(data?.index, tempProduct)
    setOpen(false)
  }

  // CLOSE MODAL AND RESET FORM
  const handleClose = () => {
    setOpen(false)
  }

  const handleRemoveProduct = () => {
    swalConfirmationOnly({
      title: 'Hapus Produk Dari Keranjang?',
      text: 'Produk akan dihapus dari keranjang',
      confirmButtonText: 'Ya, Hapus',
      showCancelButton: true,
      cancelButtonText: 'Tidak',
      icon: 'warning',
      onClickYes: () => {
        removeProduct(data?.index)
        setOpen(false)
      },
    })
  }

  const tempQuantity = useCallback(() => {
    return selected?.qty || "Kosong"
  }, [selected])

  const calculateSubTotal = useMemo(() => {
    return getValues('price') * getValues('quantity') || 0
  }, [watch('price'), watch('quantity')])

  useEffect(() => {
    const warehouse = JSON.parse(localStorage.getItem('warehousePos'))
    dispatch(fetchDetailProductPos({ warehouseId: warehouse.warehouseId, productId: data?.productId }))
    // if (data?.isFavorite) {
    //   setIsFavorite(true)
    // }
    setSelected(data)
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
              // pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
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
            {/* BUTTON FAV AND SAVE */}
            <DialogActions
              sx={{
                px: theme => [`${theme.spacing(0)} !important`, `${theme.spacing(0)} !important`],
              }}
            >
              <Grid container spacing={6}>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant='outlined'
                    color='secondary'
                    onClick={handleRemoveProduct}
                    startIcon={
                      <Icon
                        icon={'tabler:trash'} // Gunakan ikon sesuai status
                        fontSize="1.25rem" // Ukuran ikon
                        style={{
                          color: isFavorite ? 'orange' : 'inherit', // Warna kuning jika favorit
                        }}
                      />
                    }
                    sx={{
                      borderColor: isFavorite ? 'orange' : 'secondary.main', // Border tombol dinamis
                      color: isFavorite ? 'orange' : 'secondary.main', // Warna teks tombol dinamis
                    }}
                  >
                    Hapus Dari Keranjang
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button fullWidth type='submit' variant='contained' disabled={!selected ? true : false}>
                    Save
                  </Button>
                </Grid>
              </Grid>
            </DialogActions>
            <Grid container spacing={6} mt={0.5}>
              <Grid item xs={12}>
                <Grid container spacing={6} alignItems={'center'}>
                  {
                    detailProductPos?.map((item, index) => (
                      <Grid item key={index} xs={6}>
                        <Button fullWidth variant={selected?.unitName === item.unitName ? 'contained' : 'outlined'} onClick={() => {
                          console.log(item);

                          setSelected({
                            ...selected,
                            unitName: item?.unitName,
                            unitId: item?.unitId,
                            qty: item?.quantity,
                            quantity: "",
                            price: item?.basePrice
                          })
                        }
                        }>{item.unitName}</Button>
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
                      disabled={tempQuantity() === "Kosong" ? true : selected ? false : true}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                      Sub Total: {priceFormatWIthCurrency(calculateSubTotal)}
                    </Typography>
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
        </form>
      </Dialog>
    </Card>
  )
}
