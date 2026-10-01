// ** React Imports
import { useCallback, useEffect, useMemo, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { fetchDetailProductPos } from 'src/store/apps/pos'
import CustomTextField from 'src/@core/components/mui/text-field'
import FormInputText from '../common/Form/FormInputText'
import FormInputNumberPos from '../common/FormPos/FormInputNumberPos'
import FormInputPricePos from '../common/FormPos/FormInputPricePos'
import { priceFormatWIthCurrency } from 'src/helpers/priceFormatter'
import { autoSavePos } from 'src/helpers/pos/autoSavePos'

// ** Shared Components
import AppModal from 'src/views/common/AppModal'
import ConfirmDialog from 'src/views/common/ConfirmDialog'
import { actionButtonSx } from 'src/views/common/actionButtonSx'
import { FieldLabel, SubTotalField, UnitPicker } from './ProductModalParts'

// ** Design Tokens
import { colors, shadows } from 'src/configs/designTokens'

const saveToLocalStorage = data => localStorage.setItem('listProductPos', JSON.stringify(data))

export default function ModalEditProductPos({ open, setOpen, data, updateProduct, removeProduct }) {
  const dispatch = useDispatch()
  const { detailProductPos, loadingDetailProductPos } = useSelector(state => state.pos)

  const [selected, setSelected] = useState(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [showNotes, setShowNotes] = useState(false)
  const [openConfirmRemove, setOpenConfirmRemove] = useState(false)

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
    removeProduct(data?.index)
    const fields = localStorage.getItem('listProductPos')
    const updatedFields = JSON.parse(fields).filter((item, index) => index !== data?.index)
    localStorage.setItem('listProductPos', JSON.stringify(updatedFields))
    autoSavePos()
    setOpenConfirmRemove(false)
    setOpen(false)
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
    <>
      <AppModal
        open={open}
        onClose={handleClose}
        onSubmit={handleSubmit(onSubmit)}
        title={data?.productName}
        size='xl'
        loadingPage={loadingDetailProductPos}
        submitDisabled={!selected}
        showClose={false}
        footerExtra={
          <Button
            variant='outlined'
            color='error'
            onClick={() => setOpenConfirmRemove(true)}
            startIcon={<Icon icon='tabler:trash' fontSize='1rem' />}
            sx={{
              ...actionButtonSx,
              color: colors.destructive,
              borderColor: colors.destructive,
              boxShadow: shadows.xs
            }}
          >
            Hapus Dari Keranjang
          </Button>
        }
      >
        <Grid container spacing={4}>
          {data?.description && (
            <Grid item xs={12}>
              <Typography sx={{ fontSize: '0.8125rem', color: colors.mutedForeground }}>
                ({data.description})
              </Typography>
            </Grid>
          )}

          <Grid item xs={12}>
            <FieldLabel>
              Pilih Unit {!selected?.unitName && <span style={{ color: colors.destructive }}>*</span>}
            </FieldLabel>
            <UnitPicker
              units={detailProductPos}
              selectedUnitName={selected?.unitName}
              onSelect={item =>
                setSelected({
                  ...selected,
                  unitName: item?.unitName,
                  unitId: item?.unitId,
                  qty: item?.quantity,
                  quantity: '',
                  price: item?.basePrice,
                  MasterProductPriceId: item?.MasterProductPriceId
                })
              }
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <CustomTextField fullWidth label='Stok' value={tempQuantity()} disabled keepDisabledField />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FieldLabel>Kuantiti</FieldLabel>
            <FormInputNumberPos
              control={control}
              name='quantity'
              errors={errors}
              label1={null}
              label={null}
              max={tempQuantity()}
              disabled={tempQuantity() === 'Kosong' ? true : selected ? false : true}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FieldLabel>Harga</FieldLabel>
            <FormInputPricePos
              control={control}
              name='price'
              errors={errors}
              label=''
              disabled={selected ? false : true}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <SubTotalField value={priceFormatWIthCurrency(calculateSubTotal)} />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox checked={showNotes} onChange={e => setShowNotes(e.target.checked)} disabled={!selected} />
              }
              label='Catatan'
            />
            {showNotes && (
              <Box sx={{ mt: 1 }}>
                <FormInputText
                  multiline
                  rows={3}
                  control={control}
                  name='notes'
                  errors={errors}
                  label=''
                  disabled={selected ? false : true}
                />
              </Box>
            )}
          </Grid>
        </Grid>
      </AppModal>

      <ConfirmDialog
        open={openConfirmRemove}
        onClose={() => setOpenConfirmRemove(false)}
        onConfirm={handleRemoveProduct}
        title='Hapus Produk dari Keranjang'
        description={
          <>
            Apakah Anda yakin menghapus produk dari keranjang?
            <Box component='span' sx={{ display: 'block', mt: 2 }}>
              Produk:{' '}
              <Box component='span' sx={{ fontWeight: 600, color: colors.foreground }}>
                {data?.productName}
              </Box>
            </Box>
          </>
        }
        confirmLabel='Ya'
        cancelLabel='Tidak'
        confirmIcon='tabler:check'
        destructive={false}
      />
    </>
  )
}
