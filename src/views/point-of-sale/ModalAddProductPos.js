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
import { CircularProgress, IconButton, Checkbox, FormControlLabel } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { fetchDetailProductPos, fetchListProductPos, updateFavoriteProductPos } from 'src/store/apps/pos'
import FormInputText from '../common/Form/FormInputText'
import FormInputNumberPos from '../common/FormPos/FormInputNumberPos'
import FormInputPricePos from '../common/FormPos/FormInputPricePos'
import { priceFormatWIthCurrency } from 'src/helpers/priceFormatter'
import TransformProductPointOfSale from './TransformProductPointOfSale'
import ModalAddBasePrice from './ModalAddBasePrice'
import { fetchMasterDataProductPrice } from 'src/store/apps/master/product-price'
import { autoSavePos } from 'src/helpers/pos/autoSavePos'

const CustomCloseButton = styled(IconButton)(({ theme }) => ({
  top: 0,
  right: 0,
  color: 'grey.500',
  position: 'absolute',
  boxShadow: theme.shadows[2],
  transform: 'translate(-10px, 10px)',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: `${theme.palette.background.paper} !important`
  // transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
  // '&:hover': {
  //   transform: 'translate(7px, -5px)'
  // }
}))

const saveToLocalStorage = data => localStorage.setItem('listProductPos', JSON.stringify(data))

export default function ModalAddProductPos({ open, setOpen, data, addProduct, fields }) {
  const dispatch = useDispatch()
  const { detailProductPos, loadingDetailProductPos } = useSelector(state => state.pos)

  const [selected, setSelected] = useState(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [showNotes, setShowNotes] = useState(false)

  const [openModalTransform, setOpenModalTransform] = useState(false)
  const [dataTransformation, setDataTransformation] = useState({})

  const [openModalBasePrice, setOpenModalBasePrice] = useState(false)

  // SHCEMA YUP VALIDATION
  const schema = yup.object().shape({
    price: yup.string().required('Harga harus diisi'),
    quantity: yup.string().required('Kuantiti harus diisi')
  })

  // REACT FORM
  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
    watch
  } = useForm({
    values: {
      price: selected?.basePrice || null
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
      title: val?.title || '',
      productId: selected?.productId
    }
    addProduct(tempProduct)
    saveToLocalStorage([...fields, tempProduct])
    autoSavePos()
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
      isFavorite: isFavorite ? false : true,
      warehouseId: warehouse?.warehouseId
    }
    dispatch(updateFavoriteProductPos({ data: sendData, setFavorite: setIsFavorite, isFavorite: isFavorite }))
  }

  const tempQuantity = useCallback(() => {
    return selected?.quantity || 'Kosong'
  }, [selected])

  const calculateSubTotal = useMemo(() => {
    return getValues('price') * getValues('quantity') || 0
  }, [watch('price'), watch('quantity')])

  useEffect(() => {
    const warehouse = JSON.parse(localStorage.getItem('warehousePos'))
    dispatch(fetchDetailProductPos({ warehouseId: warehouse?.warehouseId, productId: data?.productId }))
    if (data?.isFavorite) {
      setIsFavorite(true)
    }
    // Dispatch Product Base Price
    dispatch(fetchMasterDataProductPrice(data?.productId))
  }, [data?.id])

  const handleTransformation = () => {
    setDataTransformation({ ...selected, qty: getValues('quantity') })
    setOpenModalTransform(true)
  }

  return (
    <>
      <Card>
        <Dialog
          fullWidth
          open={open}
          scroll='paper'
          maxWidth='md'
          onClose={handleClose}
          sx={{
            '& .MuiDialog-paper': {
              overflow: 'hidden',
              height: '30rem',
              maxHeight: '30rem',
              position: 'relative'
            }
          }}
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
                bgcolor: 'rgba(255, 255, 255, 0.8)'
              }}
            >
              <CircularProgress />
            </Box>
          )}
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogContent
              sx={{
                pb: theme => `${theme.spacing(12)} !important`, // Reduced bottom padding for fixed buttons
                px: theme => [`${theme.spacing(3)} !important`, `${theme.spacing(6)} !important`], // Reduced horizontal padding
                overflowY: 'auto',
                height: 'calc(30rem - 60px)', // Adjusted height for smaller padding
                maxHeight: 'calc(30rem - 60px)',
                pt: theme => [`${theme.spacing(16)} !important`, `${theme.spacing(16)} !important`] // Increased top padding for fixed header
              }}
            >
              {/* FIXED PRODUCT NAME HEADER WITHIN MODAL */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  zIndex: 2,
                  backgroundColor: 'background.paper',
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  px: theme => [`${theme.spacing(3)} !important`, `${theme.spacing(6)} !important`],
                  py: theme => `${theme.spacing(3)} !important`,
                  textAlign: 'center',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 2
                }}
              >
                <Typography
                  variant='h4'
                  sx={{
                    margin: 0
                  }}
                >
                  {data?.productName}
                </Typography>
                <IconButton
                  onClick={handleFav}
                  sx={{
                    margin: 0,
                    color: isFavorite ? 'orange' : 'grey.500',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 152, 0, 0.1)'
                    }
                  }}
                >
                  <Icon
                    icon={isFavorite ? 'tabler:star-filled' : 'tabler:star'}
                    fontSize='1.5rem'
                    style={{
                      color: isFavorite ? 'orange' : 'inherit'
                    }}
                  />
                </IconButton>
              </Box>

              <Grid container spacing={4} mt={0.5}>
                {/* NEW GRID LAYOUT: Left side (Unit + Notes) and Right side (Quantity, Price, Subtotal) */}
                <Grid item xs={12}>
                  <Grid container spacing={4} alignItems='flex-start'>
                    {/* LEFT SIDE: Pilih Unit dan Notes (6 columns) */}
                    <Grid item xs={6}>
                      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        {/* Unit Selection Area */}
                        <Box>
                          <Typography variant='h6' sx={{ marginBottom: 1 }}>
                            Pilih Unit {!selected?.unitName && <span style={{ color: 'red' }}>*</span>}
                          </Typography>
                          <Grid container spacing={2}>
                            {detailProductPos?.map((item, index) => (
                              <Grid item key={index} xs={12} sm={12}>
                                <Button
                                  fullWidth
                                  variant={selected?.unitName === item.unitName ? 'contained' : 'outlined'}
                                  onClick={() => setSelected(item)}
                                  sx={{
                                    mb: 1,
                                    height: '4rem',
                                    fontSize: '1rem',
                                    fontWeight: 'medium'
                                  }}
                                >
                                  {item.unitName}
                                </Button>
                              </Grid>
                            ))}
                          </Grid>
                        </Box>

                        {/* Notes Section */}
                        <Box sx={{ mt: 1, minHeight: 120 }}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={showNotes}
                                onChange={e => setShowNotes(e.target.checked)}
                                disabled={!selected}
                              />
                            }
                            label='Catatan'
                          />
                          {showNotes && (
                            <Box sx={{ mt: 0 }}>
                              <FormInputText
                                multiline
                                rows={4}
                                control={control}
                                name='notes'
                                errors={errors}
                                label=''
                                disabled={selected ? false : true}
                                fullWidth
                              />
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </Grid>

                    {/* RIGHT SIDE: Kuantiti, Harga, dan Subtotal (6 columns) */}
                    <Grid item xs={6}>
                      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        {/* Quantity Input */}
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant='h6' sx={{ color: 'text.primary' }}>
                              Kuantiti (Stock: {tempQuantity()})
                            </Typography>
                            {getValues('quantity') > 0 && selected && (
                              <Typography
                                variant='subtitle2'
                                sx={{
                                  cursor: 'pointer',
                                  color: 'text.secondary',
                                  textDecoration: 'underline',
                                  fontSize: '0.8rem'
                                }}
                                onClick={() => {
                                  handleTransformation()
                                }}
                              >
                                Transformasi Produk
                              </Typography>
                            )}
                          </Box>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <Box sx={{ mb: 1 }}>
                                <FormInputNumberPos
                                  control={control}
                                  name='quantity'
                                  errors={errors}
                                  label1={null}
                                  label={null}
                                  placeholder=''
                                  max={tempQuantity()}
                                  disabled={tempQuantity() === 'Kosong' ? true : selected ? false : true}
                                  fullWidth
                                />
                              </Box>
                            </Grid>
                          </Grid>
                        </Box>

                        {/* Price Input with Add Base Price */}
                        <Box sx={{ mt: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant='h6' sx={{ color: 'text.primary' }}>
                              Harga
                            </Typography>
                            <Typography
                              variant='subtitle2'
                              sx={{
                                cursor: 'pointer',
                                color: 'text.secondary',
                                textDecoration: 'underline',
                                fontSize: '0.8rem'
                              }}
                              onClick={() => {
                                setOpenModalBasePrice(true)
                              }}
                            >
                              Add Base Price
                            </Typography>
                          </Box>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <FormInputPricePos
                                control={control}
                                name='price'
                                errors={errors}
                                label=''
                                disabled={selected?.basePrice !== 0 || !selected}
                                fullWidth
                              />
                            </Grid>
                          </Grid>
                        </Box>

                        {/* Subtotal Display */}
                        <Box
                          sx={{
                            mt: 2,
                            p: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 1,
                            backgroundColor: 'grey.50'
                          }}
                        >
                          <Typography variant='h6' sx={{ color: 'text.primary', textAlign: 'center' }}>
                            Sub Total
                          </Typography>
                          <Typography
                            variant='h5'
                            sx={{ color: 'primary.main', textAlign: 'center', fontWeight: 'bold' }}
                          >
                            {priceFormatWIthCurrency(calculateSubTotal)}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </DialogContent>
            {/* FIXED BUTTONS AT BOTTOM */}
            <DialogActions
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: 'background.paper',
                borderTop: '1px solid',
                borderColor: 'divider',
                px: theme => [`${theme.spacing(3)} !important`, `${theme.spacing(6)} !important`], // Reduced horizontal padding
                py: theme => `${theme.spacing(2)} !important`, // Reduced vertical padding
                zIndex: 1
              }}
            >
              <Grid container spacing={6}>
                <Grid item xs={6}>
                  <Button fullWidth variant='outlined' onClick={handleClose}>
                    Cancel
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button fullWidth type='submit' variant='contained' disabled={!selected ? true : false}>
                    Save
                  </Button>
                </Grid>
              </Grid>
            </DialogActions>
          </form>
        </Dialog>
      </Card>
      {openModalTransform && (
        <TransformProductPointOfSale
          setOpen={setOpenModalTransform}
          open={openModalTransform}
          transformationData={dataTransformation}
          setSelectedProductPos={setSelected}
        />
      )}
      {openModalBasePrice && (
        <ModalAddBasePrice
          open={openModalBasePrice}
          setOpen={setOpenModalBasePrice}
          product={data}
          setSelected={setSelected}
        />
      )}
    </>
  )
}
