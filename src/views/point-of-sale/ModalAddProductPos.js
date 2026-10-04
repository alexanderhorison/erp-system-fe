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
import { fetchDetailProductPos, updateFavoriteProductPos } from 'src/store/apps/pos'
import CustomTextField from 'src/@core/components/mui/text-field'
import FormInputText from '../common/Form/FormInputText'
import FormInputNumberPos from '../common/FormPos/FormInputNumberPos'
import FormInputPricePos from '../common/FormPos/FormInputPricePos'
import { priceFormatWIthCurrency } from 'src/helpers/priceFormatter'
import TransformProductPointOfSale from './TransformProductPointOfSale'
import ModalAddBasePrice from './ModalAddBasePrice'
import { fetchMasterDataProductPrice } from 'src/store/apps/master/product-price'
import { autoSavePos } from 'src/helpers/pos/autoSavePos'
import { enumActions } from 'src/helpers/enumActions'

// ** Shared Components
import AppModal from 'src/views/common/AppModal'
import { FieldLabel, IconAction, SubTotalField, UnitPicker } from './ProductModalParts'

// ** Design Tokens
import { colors, shadows, status as statusTokens } from 'src/configs/designTokens'

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
    setValue,
    formState: { errors },
    watch
  } = useForm({
    defaultValues: {
      price: null,
      quantity: null
    },
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  // Update price when selected changes
  useEffect(() => {
    if (selected && selected.basePrice !== undefined && selected.basePrice !== null) {
      setValue('price', selected.basePrice)
    }
  }, [selected?.basePrice])

  // ON SUBMIT
  const onSubmit = val => {
    if (!selected) {
      console.error('Selected unit is null, cannot submit')
      return
    }

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
      productId: selected?.productId,
      MasterProductPriceId: selected?.MasterProductPriceId
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
    setSelected(null) // Reset selected when data changes
    const warehouse = JSON.parse(localStorage.getItem('warehousePos'))
    dispatch(fetchDetailProductPos({ warehouseId: warehouse?.warehouseId, productId: data?.productId }))
    if (data?.isFavorite) {
      setIsFavorite(true)
    }
    // Dispatch Product Base Price
    dispatch(fetchMasterDataProductPrice(data?.productId))
  }, [data?.productId])

  useEffect(() => {
    if (detailProductPos && detailProductPos.length > 0) {
      let unit = null
      let selectedUnit = null
      if (data?.productName?.toUpperCase().includes('KALENG')) {
        unit = detailProductPos.find(unit => unit.unitName === 'KALENG')
        selectedUnit = unit || detailProductPos[0]
      } else {
        unit = detailProductPos.find(unit => unit.unitName === 'PCS')
        selectedUnit = unit || detailProductPos[0]
      }

      console.log('Selected unit on load:', selectedUnit)

      setSelected(selectedUnit)

      // Always set quantity to 1 regardless of stock
      setValue('quantity', 1)

      // Update price saat auto pilih unit (also handle zero price)
      if (selectedUnit && selectedUnit.basePrice !== undefined && selectedUnit.basePrice !== null) {
        setValue('price', selectedUnit.basePrice)
      }
    }
  }, [detailProductPos])

  const handleTransformation = () => {
    setDataTransformation({ ...selected, qty: getValues('quantity') })
    setOpenModalTransform(true)
  }

  const userData = JSON.parse(localStorage.getItem('userData'))
  const canEditBasePrice = Boolean(userData?.actions?.includes(enumActions.EDIT_POS_BASE_PRICE.value))

  const handleSelectUnit = item => {
    setSelected(item)
    const hasStock = item.quantity && item.quantity > 0

    if (hasStock) {
      // Set quantity to 1 if stock is available
      const currentQuantity = getValues('quantity')
      if (!currentQuantity || currentQuantity === '' || currentQuantity === null) {
        setValue('quantity', 1)
      }
    } else {
      // Clear quantity if stock is empty
      setValue('quantity', null)
    }
  }

  return (
    <>
      <AppModal
        open={open}
        onClose={handleClose}
        onSubmit={handleSubmit(onSubmit)}
        title={data?.productName}
        size='md'
        loadingPage={loadingDetailProductPos}
        submitDisabled={!selected}
        headerAction={
          <Button
            variant='outlined'
            color='secondary'
            size='small'
            onClick={handleFav}
            startIcon={<Icon icon={isFavorite ? 'tabler:star-filled' : 'tabler:star'} fontSize='1rem' />}
            sx={{
              color: colors.foreground,
              borderColor: colors.border3,
              boxShadow: shadows.xs,
              '& .MuiButton-startIcon': { color: isFavorite ? statusTokens.warning.fg : 'inherit' }
            }}
          >
            Favorite
          </Button>
        }
        showClose={false}
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
            <UnitPicker units={detailProductPos} selectedUnitName={selected?.unitName} onSelect={handleSelectUnit} />
          </Grid>

          {/* Each row: left half = field + its icon action, right half = Kuantiti / Sub Total */}
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <CustomTextField fullWidth label='Stok' value={tempQuantity()} disabled keepDisabledField />
              </Box>
              <IconAction
                label='Transformasi'
                icon='lucide:arrow-left-right'
                onClick={handleTransformation}
                disabled={!(getValues('quantity') > 0 && selected)}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FieldLabel>Kuantiti</FieldLabel>
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
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <FieldLabel>Harga</FieldLabel>
                <FormInputPricePos
                  control={control}
                  name='price'
                  errors={errors}
                  label=''
                  disabled={
                    !selected ||
                    (selected.basePrice !== undefined && selected.basePrice !== null && selected.basePrice !== 0)
                  }
                  keepDisabledField
                  fullWidth
                />
              </Box>
              <IconAction
                label='Add Base Price'
                icon='tabler:tags'
                onClick={() => setOpenModalBasePrice(true)}
                disabled={!canEditBasePrice}
                tooltip={canEditBasePrice ? '' : "You don't have authority to perform this actions"}
              />
            </Box>
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
                  fullWidth
                />
              </Box>
            )}
          </Grid>
        </Grid>
      </AppModal>
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
