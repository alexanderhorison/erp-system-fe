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
import { fetchDetailProductPos, updateFavoriteProductPos } from 'src/store/apps/pos'
import FormInputText from '../common/Form/FormInputText'
import FormInputNumberPos from '../common/FormPos/FormInputNumberPos'
import FormInputPricePos from '../common/FormPos/FormInputPricePos'
import { priceFormatWIthCurrency } from 'src/helpers/priceFormatter'
import { swalConfirmationOnly } from 'src/helpers/swalFunctionPos'
import { autoSavePos } from 'src/helpers/pos/autoSavePos'

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

const saveToLocalStorage = data => localStorage.setItem('listProductPos', JSON.stringify(data))

export default function ModalEditProductPos({ open, setOpen, data, updateProduct, removeProduct }) {
  const dispatch = useDispatch()
  const { detailProductPos, loadingDetailProductPos } = useSelector(state => state.pos)

  const [selected, setSelected] = useState(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [showNotes, setShowNotes] = useState(false)

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
      price: selected?.price || null,
      quantity: selected?.quantity || null
    },
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  // ON SUBMIT
  const onSubmit = val => {
    // Determine isPriceUpdated based on the 3 conditions:
    const originalUnitName = data?.unitName
    const originalPrice = data?.price
    const currentUnitName = selected?.unitName
    const currentPrice = Number(val?.price)

    // Find the price that came directly from the selected unit's backend data
    const unitFromDetail = detailProductPos?.find(item => item.unitName === currentUnitName)
    const backendPriceForUnit = unitFromDetail?.basePrice

    let isPriceUpdated = false

    if (currentUnitName === originalUnitName) {
      // Kondisi 1: Unit sama, harga beda → isPriceUpdated true
      isPriceUpdated = currentPrice !== Number(originalPrice)
    } else {
      // Unit diganti
      if (backendPriceForUnit !== undefined && currentPrice === Number(backendPriceForUnit)) {
        // Kondisi 2: Unit diganti, memakai harga as-is dari data backend → isPriceUpdated false
        // MasterProductPriceId sudah diset dari klik unit button
        isPriceUpdated = false
      } else {
        // Kondisi 3: Unit diganti, harga diubah manual → isPriceUpdated true
        isPriceUpdated = true
      }
    }

    let tempProduct = {
      id: selected?.id,
      subTotal: val?.price * val?.quantity,
      quantity: +val?.quantity,
      price: currentPrice,
      warehouseProductId: selected?.warehouseProductId,
      qty: +selected?.qty,
      masterProductId: selected?.productId,
      rackName: selected?.rackName,
      unitName: selected?.unitName,
      unitId: selected?.unitId,
      productName: selected?.productName,
      notes: val?.notes || '',
      title: val?.title || '',
      productId: selected?.productId,
      MasterProductPriceId: selected?.MasterProductPriceId ?? null,
      isPriceUpdated
    }
    updateProduct(data?.index, tempProduct)
    const listProductPos = JSON.parse(localStorage.getItem('listProductPos'))
    const updatedArray = listProductPos.map((item, i) => (i === data?.index ? tempProduct : item))
    saveToLocalStorage(updatedArray)
    autoSavePos()
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
        const fields = localStorage.getItem('listProductPos')
        const updatedFields = JSON.parse(fields).filter((item, index) => index !== data?.index)
        localStorage.setItem('listProductPos', JSON.stringify(updatedFields))
        autoSavePos()
        setOpen(false)
      }
    })
  }

  const tempQuantity = useCallback(() => {
    return selected?.qty || 'Kosong'
  }, [selected])

  const calculateSubTotal = useMemo(() => {
    return getValues('price') * getValues('quantity') || 0
  }, [watch('price'), watch('quantity')])

  useEffect(() => {
    const warehouse = JSON.parse(localStorage.getItem('warehousePos'))
    dispatch(fetchDetailProductPos({ warehouseId: warehouse.warehouseId, productId: data?.productId }))
    setSelected(data)
  }, [data?.id])

  return (
    <Card>
      <Dialog
        fullWidth
        open={open}
        scroll='paper'
        maxWidth='xl'
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
              pb: theme => `${theme.spacing(12)} !important`,
              px: theme => [`${theme.spacing(3)} !important`, `${theme.spacing(6)} !important`],
              overflowY: 'auto',
              height: data?.description ? 'calc(30rem - 80px)' : 'calc(30rem - 60px)',
              maxHeight: data?.description ? 'calc(30rem - 80px)' : 'calc(30rem - 60px)',
              pt: theme => [`${theme.spacing(data?.description ? 20 : 16)} !important`, `${theme.spacing(data?.description ? 20 : 16)} !important`]
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
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
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
              {data?.description && (
                <Typography
                  variant='body2'
                  sx={{
                    margin: 0,
                    color: 'text.secondary',
                    fontStyle: 'italic'
                  }}
                >
                  ({data?.description})
                </Typography>
              )}
            </Box>

            <Grid container spacing={6}>
              <Grid item xs={12}>
                <Typography variant='h6' sx={{ marginBottom: 1 }}>
                  PILIH UNIT {!selected?.unitName && <span style={{ color: 'red' }}>*</span>}
                </Typography>
                <Grid container spacing={6} alignItems={'center'}>
                  {detailProductPos?.map((item, index) => (
                    <Grid item key={index} xs={6}>
                      <Button
                        fullWidth
                        variant={selected?.unitName === item.unitName ? 'contained' : 'outlined'}
                        onClick={() => {
                          setSelected({
                            ...selected,
                            unitName: item?.unitName,
                            unitId: item?.unitId,
                            qty: item?.quantity,
                            quantity: '',
                            price: item?.basePrice,
                            MasterProductPriceId: item?.MasterProductPriceId
                          })
                        }}
                      >
                        {item.unitName}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
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
                      disabled={tempQuantity() === 'Kosong' ? true : selected ? false : true}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                      Sub Total: {priceFormatWIthCurrency(calculateSubTotal)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={showNotes}
                          onChange={e => setShowNotes(e.target.checked)}
                          disabled={!selected}
                        />
                      }
                      label='Notes'
                    />
                    {showNotes && (
                      <Box sx={{ mt: 2 }}>
                        <FormInputText
                          multiline
                          rows={3}
                          control={control}
                          name='notes'
                          errors={errors}
                          label='Notes'
                          disabled={selected ? false : true}
                        />
                      </Box>
                    )}
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
                <Button
                  fullWidth
                  variant='outlined'
                  color='secondary'
                  onClick={handleRemoveProduct}
                  startIcon={<Icon icon={'tabler:trash'} fontSize='1.25rem' />}
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
        </form>
      </Dialog>
    </Card>
  )
}
