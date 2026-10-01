import { Box, Button, CircularProgress, InputAdornment, MenuItem, Typography } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { useSelector, useDispatch } from 'react-redux'
import CustomTextField from 'src/@core/components/mui/text-field'
import { priceFormat, priceFormatWithZero } from 'src/helpers/priceFormatter'
import ModalAddProductPos from './ModalAddProductPos'
import CartProductPos from './CartProductPos'
import ModalAddCustomerPos from './ModalAddCustomerPos'
import ModalChargePos from './ModalChargePos'
import { swalConfirmationOnly } from 'src/helpers/swalFunctionPos'
import ModalEditProductPos from './ModalEditProductPos'
import ProductCustomField from './ProductCustomField'
import { autoSavePos, generateIdOpenBill } from 'src/helpers/pos/autoSavePos'
import { populateCartFromTransaction, validatePricePos } from 'src/store/apps/pos'
import Script from 'next/script'
import TotalSectionPos from './TotalSectionPos'
import ModalPriceValidation from './ModalPriceValidation'
import Icon from 'src/@core/components/icon'
import ConfirmDialog from 'src/views/common/ConfirmDialog'
import { colors, radii, shadows, stone } from 'src/configs/designTokens'

const surfaceSx = {
  display: 'flex',
  flexDirection: 'column',
  minHeight: 0,
  height: '100%',
  borderRadius: `${radii['3xl']}px`,
  border: `1px solid ${colors.border}`,
  boxShadow: shadows.xs,
  backgroundColor: colors.background,
  overflow: 'hidden'
}

const outlinedPillSx = {
  color: colors.foreground,
  borderColor: colors.border3,
  backgroundColor: colors.background,
  boxShadow: shadows.xs,
  whiteSpace: 'nowrap',
  '&:hover': { borderColor: colors.border3, backgroundColor: stone[50] }
}

// Kedepannya jika tambah filter, bisa tambahkan field ini
const listFilter = [
  {
    id: 1,
    name: 'Company',
    value: 'COMPANY'
  },
  {
    id: 2,
    name: 'Type',
    value: 'TYPE'
  },
  {
    id: 3,
    name: 'Category',
    value: 'CATEGORY'
  }
]

export default function PointOfSaleLayout({
  showFilter,
  setShowFilter,
  warehouse,
  setScriptEpos,
  heightBody,
  isMobile,
  isTablet,
  isLowHeight
}) {
  const height = heightBody || (isMobile ? '16rem' : isTablet ? '18rem' : '20rem')
  const { data: companyData, loading } = useSelector(state => state.company)
  const { data: typeData } = useSelector(state => state.type)
  const { data: categoryData } = useSelector(state => state.category)

  const { listProductPos } = useSelector(state => state.pos)
  const cartFromTransaction = useSelector(state => state.pos.cartFromTransaction)
  const { loadingValidatePrice } = useSelector(state => state.pos)

  const dispatch = useDispatch()

  const [openModalProduct, setOpenModalProduct] = useState(false)
  const [openModalEditProduct, setOpenModalEditProduct] = useState(false)
  const [openModalAddCustomer, setOpenModalAddCustomer] = useState(false)
  const [openModalCharge, setOpenModalCharge] = useState(false)
  const [showProduct, setShowProduct] = useState(true)
  const [searchProduct, setSearchProduct] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [openConfirmReset, setOpenConfirmReset] = useState(false)

  const [selectedProduct, setSelectedProduct] = useState({})
  const [selectedProductEdit, setSelectedProductEdit] = useState({})
  const [selectedCustomerPos, setSelectedCustomerPos] = useState(
    localStorage.getItem('selectedCustomerPos') ? JSON.parse(localStorage.getItem('selectedCustomerPos')) : {}
  )

  const [showBreakdown, setShowBreakdown] = useState(false)

  // State untuk modal validasi harga
  const [priceValidationOpen, setPriceValidationOpen] = useState(false)
  const [priceValidationResult, setPriceValidationResult] = useState([])

  const [filter, setFilter] = useState({
    type: 'COMPANY',
    typeValue: 'ALL',
    typeProduct: 'ALL'
  })

  // FORM BUAT FILTER
  const {
    control: controlFilter,
    watch: watchFilter,
    setValue: setValueFilter
  } = useForm({
    defaultValues: {
      typeFilter: 'COMPANY',
      typeProduct: 'ALL',
      typeValue: 'ALL'
    }
  })
  const filterForm = watchFilter()

  // FORM BUAT CART
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
    resetField,
    getValues,
    watch
  } = useForm({
    values: {
      formData: localStorage.getItem('listProductPos') ? JSON.parse(localStorage.getItem('listProductPos')) : []
    },
    mode: 'onChange'
    // resolver: yupResolver(schema)
  })

  const { fields, remove, append, update } = useFieldArray({
    control,
    name: 'formData'
  })
  const formField = watch('formData')

  const filteredProducts = useMemo(() => {
    const { typeFilter, typeValue, typeProduct } = filterForm
    const keyword = searchProduct.trim().toLowerCase()

    const filterKey = {
      CATEGORY: 'categoryId',
      TYPE: 'typeId',
      COMPANY: 'companyId'
    }[typeFilter]

    return (listProductPos || []).filter(el => {
      // Check typeValue condition
      const matchesTypeValue = typeValue === 'ALL' || (filterKey && el[filterKey] === typeValue)
      // Check typeProduct condition
      const matchesTypeProduct =
        typeProduct === 'ALL' ? true : typeProduct === 'favorite' ? el.isFavorite === true : true
      // Check the search box
      const matchesSearch = !keyword || (el.productName || '').toLowerCase().includes(keyword)

      // Combine all conditions with AND
      return matchesTypeValue && matchesTypeProduct && matchesSearch
    })
  }, [filterForm, listProductPos, searchProduct])

  const favoriteCount = useMemo(
    () => (listProductPos || []).filter(el => el.isFavorite === true).length,
    [listProductPos]
  )

  const listLeftFilter = useMemo(() => {
    if (filterForm.typeFilter === 'COMPANY') {
      return companyData
    }
    if (filterForm.typeFilter === 'TYPE') {
      return typeData
    }
    if (filterForm.typeFilter === 'CATEGORY') {
      return categoryData
    }
    return []
  })

  const handleClickProduct = () => {
    setOpenModalProduct(true)
  }

  const handleClickAddCustomer = () => {
    setOpenModalAddCustomer(true)
  }

  // Handler tombol Validate di cart — selalu validasi harga ke backend sebelum charge
  const handleClickCharge = async () => {
    // Build listSendProduct lalu validasi ke backend
    const currentFormData = getValues('formData')
    const listSendProduct = currentFormData.map((item, index) => ({
      cartIndex: index,
      warehouseProductId: item.warehouseProductId,
      price: item.price,
      quantity: item.quantity,
      subTotal: item.subTotal,
      notes: item?.notes || '',
      title: item?.title || '',
      isDebt: item?.isDebt || false,
      debtDate: item?.debtDate || '',
      MasterProductPriceId: item?.MasterProductPriceId ?? null,
      isPriceUpdated: item?.isPriceUpdated ?? false,
      productName: item?.productName || item?.title || '',
      unitName: item?.unitName || ''
    }))

    // Send the whole cart to backend for validation; backend will decide which items to check
    const validateResult = await dispatch(validatePricePos({ listProduct: listSendProduct }))

    if (validatePricePos.rejected.match(validateResult)) {
      return
    }

    const responseItems = validateResult.payload?.data ?? validateResult.payload ?? []

    if (Array.isArray(responseItems) && responseItems.length > 0) {
      // Backend may return items with cartIndex or in the same order — enrich using cartIndex or order
      const enriched = responseItems.map((r, rIdx) => {
        const matchByCartIndex =
          r.cartIndex !== undefined ? listSendProduct.find(p => p.cartIndex === r.cartIndex) : null
        const matchByOrder = listSendProduct[rIdx]
        const match = matchByCartIndex ?? matchByOrder
        const qty = r.quantity ?? Number(match?.quantity ?? 1)
        const cartPrice = r.cartPrice ?? Number(match?.price ?? 0)
        const backendPrice = r.backendPrice ?? cartPrice
        return {
          ...r,
          cartIndex: r.cartIndex ?? match?.cartIndex ?? rIdx,
          productName: r.productName ?? match?.productName ?? '',
          unitName: r.unitName ?? match?.unitName ?? '',
          quantity: qty,
          cartPrice,
          backendPrice,
          cartSubTotal: r.cartSubTotal ?? cartPrice * qty,
          backendSubTotal: r.backendSubTotal ?? backendPrice * qty,
          isPriceDifferent: r.isPriceDifferent ?? cartPrice !== backendPrice
        }
      })
      setPriceValidationResult(enriched)
      setPriceValidationOpen(true)
      return
    }

    // Tidak ada produk untuk divalidasi, atau semua harga sudah sama → langsung buka charge
    setOpenModalCharge(true)
  }

  // Dipanggil dari ModalPriceValidation setelah user konfirmasi penyesuaian harga
  const handlePriceValidationConfirm = appliedItems => {
    setPriceValidationOpen(false)

    if (appliedItems.length > 0) {
      const applyMap = {}
      appliedItems.forEach(a => {
        applyMap[a.cartIndex] = a.backendPrice
      })

      const current = getValues('formData')
      const updated = current.map((item, index) => {
        if (applyMap[index] !== undefined) {
          const newPrice = Number(applyMap[index])
          return { ...item, price: newPrice, subTotal: newPrice * Number(item.quantity), isPriceUpdated: false }
        }
        return item
      })

      setValue('formData', updated)
      localStorage.setItem('listProductPos', JSON.stringify(updated))
      autoSavePos()
    }

    setOpenModalCharge(true)
  }

  const helperTextPrice = index => {
    const info = {
      detailItem: `${getValues(`formData[${index}].unitName`) ? getValues(`formData[${index}].unitName`) : ''} ${
        getValues(`formData[${index}].unitName`) ? `@` : ''
      } ${priceFormatWithZero(getValues(`formData[${index}].price`))}`
    }
    return info
  }

  const disableButtonCharge = useMemo(() => {
    if (getValues('formData').length === 0) {
      return true
    }
    return false
  }, [getValues('formData')])

  const disableButtonClear = useMemo(() => {
    if (getValues('formData').length === 0) {
      return true
    }
    return false
  }, [getValues('formData')])

  const subTotalPrice = () => {
    let subTotal = 0
    fields.forEach((item, index) => {
      subTotal += getValues(`formData[${index}].quantity`) * getValues(`formData[${index}].price`)
    })
    return subTotal
  }
  const getTotals = () => {
    let total = 0
    let hutang = 0

    fields.forEach((item, index) => {
      const qty = Number(getValues(`formData[${index}].quantity`)) || 0
      const price = Number(getValues(`formData[${index}].price`)) || 0
      const subtotal = qty * price

      if (item.isDebt) hutang = subtotal
      total += subtotal
    })

    return {
      totalBarang: total - hutang,
      totalHutang: hutang,
      grandTotal: total
    }
  }

  const resetAllField = () => {
    resetField('formData')
    setSelectedCustomerPos({})
    localStorage.setItem('listProductPos', JSON.stringify([]))
    localStorage.setItem('billId', JSON.stringify(generateIdOpenBill()))
    localStorage.removeItem('selectedCustomerPos')
  }

  const handleClickCustom = () => {
    setValueFilter('typeProduct', 'custom')
    setShowFilter(false)
    setShowProduct(false)
  }

  const handleClickAll = () => {
    setValueFilter('typeProduct', 'ALL')
    setFilter({
      ...filter,
      typeProduct: 'ALL'
    })
    setShowProduct(true)
  }

  const handleClickFavorite = () => {
    setValueFilter('typeProduct', 'favorite')
    setFilter({
      ...filter,
      typeProduct: 'favorite'
    })
    setShowProduct(true)
  }

  const handleDeleteCustom = (item, index) => {
    remove(index)
    const updatedFields = formField.filter((_, i) => i !== index)
    localStorage.setItem('listProductPos', JSON.stringify(updatedFields))
    autoSavePos()
  }

  // Stepper on a cart row: same persistence as saving the edit dialog
  const handleChangeQuantity = (index, nextQuantity) => {
    const current = getValues('formData')[index]
    const price = Number(current?.price) || 0
    const updatedItem = { ...current, quantity: nextQuantity, subTotal: price * nextQuantity }
    update(index, updatedItem)
    const listProduct = JSON.parse(localStorage.getItem('listProductPos') || '[]')
    localStorage.setItem(
      'listProductPos',
      JSON.stringify(listProduct.map((item, i) => (i === index ? updatedItem : item)))
    )
    autoSavePos()
  }

  const handleConfirmDeleteItem = () => {
    handleDeleteCustom(deleteTarget.item, deleteTarget.index)
    setDeleteTarget(null)
  }

  const handleSaveBill = () => {
    if (fields.length > 0) {
      swalConfirmationOnly({
        title: 'Transaksi Baru?',
        text: 'Apakah anda ingin membuat transaksi baru?',
        confirmButtonText: 'Ya, Buat',
        showCancelButton: true,
        cancelButtonText: 'Tidak',
        icon: 'warning',
        onClickYes: () => {
          autoSavePos()
          resetAllField()
        }
      })
    }
  }

  useEffect(() => {
    const billId = JSON.parse(localStorage.getItem('billId'))
    if (!billId) {
      localStorage.setItem('billId', JSON.stringify(generateIdOpenBill()))
    }
  }, [])

  useEffect(() => {
    if (selectedCustomerPos && selectedCustomerPos?.totalAmountDebtPos) {
      if (!formField.find(item => item.isDebt)) {
        append({
          isCustom: true,
          isDebt: true,
          debtDate: selectedCustomerPos.lastDateDebtPos,
          price: selectedCustomerPos.totalAmountDebtPos,
          productName: 'Custom Amount',
          quantity: 1,
          subTotal: selectedCustomerPos.totalAmountDebtPos,
          title: 'Custom Amount',
          warehouseProductId: null,
          notes: `Hutang ${selectedCustomerPos.lastDateDebtPos}`
        })
      }
    } else {
      // Remove debt if customer has no debt
      const findDebtIndex = formField.findIndex(item => item.isDebt)
      if (findDebtIndex !== -1) remove(findDebtIndex)
    }
  }, [selectedCustomerPos])

  // When a VOID transaction is populated into store, map it to cart and customer
  useEffect(() => {
    if (!cartFromTransaction) return

    const products = cartFromTransaction?.listProducts || []
    const mapped = products.map(item => ({
      // keep any existing id if present
      id: item.id || item.warehouseProductId || Math.random().toString(36).slice(2),
      isCustom: !item.productName || item.title ? true : false,
      isDebt: item.isDebt || false,
      debtDate: item.debtDate || null,
      price: item.price || item.unitPrice || 0,
      productName: item.productName || item.title || 'Custom Amount',
      quantity: item.quantity || 1,
      subTotal: item.subTotal || (item.price || 0) * (item.quantity || 1),
      title: item.title || '',
      warehouseProductId: item.warehouseProductId || null,
      unitName: item.unitName || ''
    }))

    // set form values and persist to localStorage
    setValue('formData', mapped)
    localStorage.setItem('listProductPos', JSON.stringify(mapped))

    // populate customer if exists
    if (cartFromTransaction?.customer && cartFromTransaction.customer.id) {
      const cust = {
        id: cartFromTransaction.customer.id,
        name: cartFromTransaction.customer.name,
        email: cartFromTransaction.customer.email || ''
      }
      setSelectedCustomerPos(cust)
      localStorage.setItem('selectedCustomerPos', JSON.stringify({ id: cust.id, name: cust.name }))
    } else {
      setSelectedCustomerPos({})
      localStorage.removeItem('selectedCustomerPos')
    }
    dispatch(populateCartFromTransaction(null))
  }, [cartFromTransaction])

  return (
    <Box sx={{ height: '100%', maxHeight: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: isLowHeight ? 2 : 4,
          overflow: { xs: 'auto', md: 'hidden' }
        }}
      >
        {/* =============== PRODUCTS PANEL ================= */}
        <Box
          sx={{
            flex: { md: 2 },
            minWidth: 0,
            height: { xs: '80vh', md: 'auto' },
            minHeight: { xs: 480, md: 0 },
            flexShrink: { xs: 0, md: 1 }
          }}
        >
          <Box sx={{ ...surfaceSx, p: 4, gap: 3 }}>
            {/* Toggle + search */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', flexShrink: 0 }}>
              <Button
                variant='contained'
                color='secondary'
                onClick={() => setShowFilter(!showFilter)}
                disabled={!showProduct}
                startIcon={<Icon icon={showFilter ? 'tabler:filter-off' : 'tabler:filter'} fontSize='1rem' />}
                sx={{
                  whiteSpace: 'nowrap',
                  color: colors.foreground,
                  backgroundColor: stone[200],
                  '&:hover': { backgroundColor: stone[300] }
                }}
              >
                {showFilter ? 'Hide Filters' : 'Show Filters'}
              </Button>
              <CustomTextField
                value={searchProduct}
                placeholder='Cari produk'
                onChange={e => setSearchProduct(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') e.preventDefault()
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <Icon icon='tabler:search' fontSize='1.125rem' />
                    </InputAdornment>
                  )
                }}
                sx={{ flex: 1, minWidth: 160, maxWidth: 320 }}
              />
            </Box>

            {/* Filter type + values */}
            {showFilter && showProduct && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', flexShrink: 0 }}>
                <Controller
                  name='typeFilter'
                  control={controlFilter}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      select
                      SelectProps={{
                        value: value,
                        onChange: e => {
                          onChange(e)
                          setFilter({
                            ...filter,
                            type: e.target.value
                          })
                        }
                      }}
                      sx={{ minWidth: 130 }}
                    >
                      {listFilter?.map((data, index) => {
                        return (
                          <MenuItem key={index} value={data.value}>
                            {data.name}
                          </MenuItem>
                        )
                      })}
                    </CustomTextField>
                  )}
                />
                {[{ id: 'ALL', name: 'All' }, ...(listLeftFilter || [])].map(data => {
                  const isAll = data.id === 'ALL'
                  const selected = filterForm.typeValue === data.id

                  return (
                    <Button
                      key={data.id}
                      size='small'
                      variant={selected ? 'contained' : 'outlined'}
                      color={selected ? 'primary' : 'secondary'}
                      onClick={() => {
                        setValueFilter('typeValue', data.id)
                        setFilter({
                          ...filter,
                          typeValue: data.id
                        })
                      }}
                      sx={{
                        // Same box in both states: the outlined chip's border must not make it taller than the filled one
                        height: 36,
                        px: 4,
                        border: '1px solid',
                        borderColor: selected ? 'primary.main' : colors.border3,
                        ...(!selected && outlinedPillSx),
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {isAll ? 'All' : data.name}
                    </Button>
                  )
                })}
              </Box>
            )}

            {/* All / Favorite / Custom */}
            <Box
              sx={{
                flexShrink: 0,
                p: 1,
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                gap: 1,
                borderRadius: 9999,
                backgroundColor: stone[100]
              }}
            >
              {[
                { key: 'ALL', label: 'All', count: listProductPos?.length || 0, onClick: handleClickAll },
                { key: 'favorite', label: 'Favorite', count: favoriteCount, onClick: handleClickFavorite },
                { key: 'custom', label: 'Custom', onClick: handleClickCustom }
              ].map(tab => {
                const active = filterForm.typeProduct === tab.key

                return (
                  <Button
                    key={tab.key}
                    fullWidth
                    disableRipple
                    onClick={tab.onClick}
                    disabled={warehouse?.warehouseId ? false : true}
                    sx={{
                      height: 36,
                      gap: 1.5,
                      color: colors.foreground,
                      backgroundColor: active ? colors.background : 'transparent',
                      boxShadow: active ? shadows.xs : 'none',
                      '&:hover': { backgroundColor: active ? colors.background : stone[200] }
                    }}
                  >
                    {tab.label}
                    {tab.count !== undefined && (
                      <Box
                        component='span'
                        sx={{
                          px: 1.5,
                          minWidth: 22,
                          height: 18,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 9999,
                          fontSize: '0.625rem',
                          color: colors.primaryForeground,
                          backgroundColor: 'primary.main'
                        }}
                      >
                        {tab.count}
                      </Box>
                    )}
                  </Button>
                )
              })}
            </Box>

            {/* All Product */}
            <Box
              sx={{
                flex: 1,
                minHeight: 0,
                overflowY: 'auto',
                overflowX: 'hidden',
                display: showProduct ? 'block' : 'none'
              }}
            >
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', sm: 'repeat(3, minmax(0, 1fr))' },
                  gap: 3,
                  pb: 2
                }}
              >
                {filteredProducts?.map((data, index) => (
                  <Button
                    key={index}
                    fullWidth
                    onClick={e => {
                      e.stopPropagation()
                      setSelectedProduct(data)
                      handleClickProduct()
                    }}
                    sx={{
                      px: 3,
                      py: 2,
                      minHeight: 48,
                      textAlign: 'center',
                      textWrap: 'wrap',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: colors.foreground,
                      backgroundColor: stone[100],
                      border: `1px solid ${stone[400]}`,
                      borderRadius: `${radii['3xl']}px`,
                      '&:hover': { backgroundColor: stone[200] }
                    }}
                  >
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, lineHeight: 1.3, color: 'inherit' }}>
                      {data.productName}
                    </Typography>
                    {data.description && (
                      <Typography sx={{ fontSize: '0.6875rem', color: colors.mutedForeground }}>
                        {`(${data.description})`}
                      </Typography>
                    )}
                  </Button>
                ))}
              </Box>
            </Box>
            {/* Custom Product */}
            <Box
              sx={{
                flex: 1,
                minHeight: 0,
                overflowY: 'auto',
                overflowX: 'hidden',
                display: showProduct ? 'none' : 'block'
              }}
            >
              <ProductCustomField append={append} control={control} errors={errors} fields={fields} />
            </Box>
          </Box>
        </Box>

        {/* =============== ORDER DETAILS ================= */}
        <Box
          sx={{
            flex: { md: 1 },
            minWidth: 0,
            height: { xs: '85vh', md: 'auto' },
            minHeight: { xs: 520, md: 0 },
            flexShrink: { xs: 0, md: 1 },
            maxWidth: { md: 440 }
          }}
        >
          <Box sx={{ ...surfaceSx, p: 4, gap: 3 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2,
                flexWrap: 'wrap',
                flexShrink: 0
              }}
            >
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.foreground }}>
                Order Details
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button
                  size='small'
                  variant={selectedCustomerPos?.name ? 'contained' : 'outlined'}
                  color={selectedCustomerPos?.name ? 'primary' : 'secondary'}
                  onClick={handleClickAddCustomer}
                  sx={{
                    // A chosen customer fills the button with the brand color; otherwise it stays an outlined pill
                    ...(!selectedCustomerPos?.name && outlinedPillSx),
                    // Same box as Reset: the outlined button's border must not make it taller than the filled one
                    height: 32,
                    border: '1px solid',
                    borderColor: selectedCustomerPos?.name ? 'primary.main' : colors.border3,
                    maxWidth: 160,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {selectedCustomerPos?.name ? `${selectedCustomerPos.name}` : 'Add Customer'}
                </Button>
                <Button
                  size='small'
                  variant='outlined'
                  color='secondary'
                  disabled={disableButtonClear}
                  onClick={() => setOpenConfirmReset(true)}
                  startIcon={<Icon icon='tabler:trash' fontSize='0.875rem' />}
                  sx={{ ...outlinedPillSx, height: 32 }}
                >
                  Reset
                </Button>
              </Box>
            </Box>

            <Box
              sx={{
                flex: 1,
                minHeight: 0,
                overflowY: 'auto',
                borderRadius: `${radii['3xl']}px`,
                border: `1px solid ${colors.border}`
              }}
            >
              <CartProductPos
                data={fields}
                control={control}
                helperTextPrice={helperTextPrice}
                setOpenEditProduct={() => setOpenModalEditProduct(true)}
                setSelectedProductEdit={setSelectedProductEdit}
                onChangeQuantity={handleChangeQuantity}
                onRequestDelete={(item, index) => setDeleteTarget({ item, index })}
              />
            </Box>

            <Box sx={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TotalSectionPos getTotals={getTotals} />
              <Box sx={{ display: 'flex', gap: 3 }}>
                <Button
                  disabled={disableButtonCharge}
                  fullWidth
                  variant='outlined'
                  color='secondary'
                  onClick={handleSaveBill}
                  startIcon={<Icon icon='tabler:file-text' fontSize='1rem' />}
                  sx={{ ...outlinedPillSx, height: 44 }}
                >
                  Next Bill
                </Button>
                <Button
                  disabled={disableButtonCharge || loadingValidatePrice}
                  fullWidth
                  variant='contained'
                  onClick={handleClickCharge}
                  startIcon={
                    loadingValidatePrice ? (
                      <CircularProgress size={16} color='inherit' />
                    ) : (
                      <Icon icon='tabler:checkbox' fontSize='1rem' />
                    )
                  }
                  sx={{ height: 44 }}
                >
                  {loadingValidatePrice ? 'Memvalidasi...' : 'Validate'}
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>

        <Script
          src='/epos-2.27.0.js'
          strategy='afterInteractive'
          onLoad={() => {
            setScriptEpos(true)
            console.log('📜 ePOS SDK Loaded')
          }}
        />
      </Box>

      {/* Modals */}
      {openModalProduct && (
        <ModalAddProductPos
          open={openModalProduct}
          setOpen={setOpenModalProduct}
          data={selectedProduct}
          typeModal={'ADD'}
          addProduct={append}
          fields={fields}
        />
      )}
      {openModalAddCustomer && (
        <ModalAddCustomerPos
          open={openModalAddCustomer}
          setOpen={setOpenModalAddCustomer}
          setSelectedCustomerPos={setSelectedCustomerPos}
          selectedCustomer={selectedCustomerPos}
        />
      )}
      {openModalCharge && (
        <ModalChargePos
          open={openModalCharge}
          setOpen={setOpenModalCharge}
          subTotalPrice={subTotalPrice}
          listSelectedProduct={fields}
          customer={selectedCustomerPos}
          resetAllField={resetAllField}
          warehouse={warehouse}
          getTotals={getTotals}
        />
      )}
      {/* Modal Preview Validasi Harga */}
      <ModalPriceValidation
        open={priceValidationOpen}
        onClose={() => setPriceValidationOpen(false)}
        onConfirm={handlePriceValidationConfirm}
        validationResult={priceValidationResult}
      />
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDeleteItem}
        title='Hapus Produk dari Keranjang'
        description={
          <>
            Apakah Anda yakin menghapus produk dari keranjang?
            <Box component='span' sx={{ display: 'block', mt: 2 }}>
              Produk:{' '}
              <Box component='span' sx={{ fontWeight: 600, color: colors.foreground }}>
                {deleteTarget?.item?.productName}
              </Box>
            </Box>
          </>
        }
        confirmLabel='Ya'
        cancelLabel='Tidak'
        confirmIcon='tabler:check'
        destructive={false}
      />
      <ConfirmDialog
        open={openConfirmReset}
        onClose={() => setOpenConfirmReset(false)}
        onConfirm={() => {
          remove()
          localStorage.setItem('listProductPos', JSON.stringify([]))
          setOpenConfirmReset(false)
        }}
        title='Yakin menghapus keranjang?'
        description='Anda akan menghapus keranjang'
        confirmLabel='Ya'
        cancelLabel='Tidak'
        confirmIcon='tabler:check'
        destructive={false}
      />
      {openModalEditProduct && (
        <ModalEditProductPos
          open={openModalEditProduct}
          setOpen={setOpenModalEditProduct}
          data={selectedProductEdit}
          updateProduct={update}
          removeProduct={remove}
        />
      )}
    </Box>
  )
}
