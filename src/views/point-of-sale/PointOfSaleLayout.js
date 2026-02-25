import { Box, Button, Grid, MenuItem, Typography } from '@mui/material'
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
import { populateCartFromTransaction } from 'src/store/apps/pos'
import Script from 'next/script'
import TotalSectionPos from './TotalSectionPos'

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

  const dispatch = useDispatch()

  const [openModalProduct, setOpenModalProduct] = useState(false)
  const [openModalEditProduct, setOpenModalEditProduct] = useState(false)
  const [openModalAddCustomer, setOpenModalAddCustomer] = useState(false)
  const [openModalCharge, setOpenModalCharge] = useState(false)
  const [showProduct, setShowProduct] = useState(true)

  const [selectedProduct, setSelectedProduct] = useState({})
  const [selectedProductEdit, setSelectedProductEdit] = useState({})
  const [selectedCustomerPos, setSelectedCustomerPos] = useState(
    localStorage.getItem('selectedCustomerPos') ? JSON.parse(localStorage.getItem('selectedCustomerPos')) : {}
  )

  const [showBreakdown, setShowBreakdown] = useState(false)

  // Flag: cart sudah tervalidasi harga & user sudah review — tidak perlu validasi ulang kecuali cart berubah
  const [isCartValidated, setIsCartValidated] = useState(false)

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

  const { fields, remove: removeField, append: appendField, update: updateField } = useFieldArray({
    control,
    name: 'formData'
  })
  const formField = watch('formData')

  // Wrapper yang mereset validasi ketika cart berubah
  const append = (...args) => { setIsCartValidated(false); appendField(...args) }
  const update = (...args) => { setIsCartValidated(false); updateField(...args) }
  const remove = (...args) => { setIsCartValidated(false); removeField(...args) }

  const filteredProducts = useMemo(() => {
    const { typeFilter, typeValue, typeProduct } = filterForm
    if (typeValue === 'ALL' && typeProduct === 'ALL') {
      return listProductPos
    }

    const filterKey = {
      CATEGORY: 'categoryId',
      TYPE: 'typeId',
      COMPANY: 'companyId'
    }[typeFilter]

    return listProductPos.filter(el => {
      // Check typeValue condition
      const matchesTypeValue = typeValue === 'ALL' || (filterKey && el[filterKey] === typeValue)
      // Check typeProduct condition
      const matchesTypeProduct =
        typeProduct === 'ALL' ? true : typeProduct === 'favorite' ? el.isFavorite === true : true

      // Combine both conditions with AND
      return matchesTypeValue && matchesTypeProduct
    })
  }, [filterForm, listProductPos])

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

  const handleClickCharge = () => {
    setOpenModalCharge(true)
  }

  const helperTextPrice = index => {
    const info = {
      detailItem: `${getValues(`formData[${index}].unitName`) ? getValues(`formData[${index}].unitName`) : ''} ${getValues(`formData[${index}].unitName`) ? `@` : ''
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
    setIsCartValidated(false)
  }

  /**
   * Dipanggil dari ModalChargePos setelah user konfirmasi di ModalPriceValidation.
   * appliedItems = [{warehouseProductId, backendPrice, backendSubTotal, quantity}]
   * Fungsi ini mengupdate harga di cart (react-hook-form + localStorage),
   * menandai cart sebagai sudah divalidasi, lalu menutup modal charge.
   */
  const applyValidatedPrices = (appliedItems, closeChargeModal) => {
    if (appliedItems.length > 0) {
      // Gunakan cartIndex sebagai key — aman untuk item duplikat (warehouseProductId sama)
      const applyMap = {}
      appliedItems.forEach(a => { applyMap[a.cartIndex] = a.backendPrice })

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

    setIsCartValidated(true)
    if (closeChargeModal) closeChargeModal()
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
    setIsCartValidated(false)
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
    <Box
      sx={{
        height: '100%',
        maxHeight: '100%',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* =============== HEADER SECTION ================= */}
      <Box sx={{ flexShrink: 0, mb: isLowHeight ? 0.5 : 1 }}>
        <Grid container spacing={isLowHeight ? 1 : 2}>
          {/* FILTER */}
          <Grid item xs={12} md={2} sx={{ display: showFilter ? 'block' : 'none' }}>
            <Controller
              name='typeFilter'
              control={controlFilter}
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  select
                  fullWidth
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
          </Grid>
          {/* FILTER BODY PRODUCT */}
          <Grid item xs={12} md={6}>
            <Grid container spacing={{ xs: 1, md: 3 }} justifyContent='center' alignItems='center'>
              <Grid item xs={4} md={4}>
                <Button
                  fullWidth
                  variant={filterForm.typeProduct === 'ALL' ? 'contained' : 'outlined'}
                  onClick={handleClickAll}
                  disabled={warehouse?.warehouseId ? false : true}
                >
                  All
                </Button>
              </Grid>
              <Grid item xs={4} md={4}>
                <Button
                  fullWidth
                  variant={filterForm.typeProduct === 'favorite' ? 'contained' : 'outlined'}
                  onClick={handleClickFavorite}
                  disabled={warehouse?.warehouseId ? false : true}
                >
                  Favorite
                </Button>
              </Grid>
              <Grid item xs={4} md={4}>
                <Button
                  fullWidth
                  variant={filterForm.typeProduct === 'custom' ? 'contained' : 'outlined'}
                  onClick={handleClickCustom}
                  disabled={warehouse?.warehouseId ? false : true}
                >
                  Custom
                </Button>
              </Grid>
            </Grid>
          </Grid>
          {/* ADD CUSTOMER */}
          <Grid item xs={12} md={showFilter ? 4 : 6}>
            <Button fullWidth variant='contained' onClick={handleClickAddCustomer}>
              {selectedCustomerPos?.name ? `${selectedCustomerPos.name}` : 'Add Customer'}
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* =============== BODY SECTION ================= */}
      <Box
        sx={{
          flexGrow: 1,
          overflow: 'hidden',
          minHeight: 0,
          height: '100%'
        }}
      >
        <Grid
          container
          spacing={isLowHeight ? 1 : 2}
          sx={{
            height: '100%',
            maxHeight: '100%',
            overflow: 'hidden',
            minHeight: 0
          }}
        >
          {/* Section Filter */}
          <Grid
            item
            xs={12}
            md={2}
            sx={{
              display: showFilter ? 'flex' : 'none',
              height: '100%',
              maxHeight: '100%',
              flexDirection: 'column',
              minHeight: 0
            }}
          >
            <Box
              sx={{
                height: '100%',
                flex: 1,
                overflowY: 'auto',
                overflowX: 'hidden',
                paddingBottom: 2
              }}
            >
              <Grid container direction='column' spacing={2}>
                <Grid item xs={6} sm={4} md={4} key={999}>
                  <Button
                    fullWidth={true}
                    variant={filterForm.typeValue === 'ALL' ? 'contained' : 'outlined'}
                    sx={{
                      height: 40,
                      textWrap: 'wrap',
                      textAlign: 'center'
                    }}
                    onClick={() => {
                      setValueFilter('typeValue', 'ALL')
                      setFilter({
                        ...filter,
                        typeValue: 'ALL'
                      })
                    }}
                  >
                    ALL
                  </Button>
                </Grid>
                {listLeftFilter?.map((data, index) => (
                  <Grid item xs={6} sm={4} md={4} key={index}>
                    <Button
                      fullWidth={true}
                      variant={filterForm.typeValue === data?.id ? 'contained' : 'outlined'}
                      sx={{
                        height: 40,
                        textWrap: 'wrap',
                        textAlign: 'center'
                      }}
                      onClick={() => {
                        setValueFilter('typeValue', data?.id)
                        setFilter({
                          ...filter,
                          typeValue: data?.id
                        })
                      }}
                    >
                      {data.name}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>
          {/** Products */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              height: '100%',
              maxHeight: '100%',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              minHeight: 0
            }}
          >
            {/* All Product */}
            <Box
              sx={{
                height: '100%',
                flex: 1,
                overflowY: 'auto',
                overflowX: 'hidden',
                display: showProduct ? 'block' : 'none',
                paddingBottom: 2
              }}
            >
              <Grid container spacing={{ xs: 1, md: 2 }} sx={{ paddingBottom: 2 }}>
                {filteredProducts?.map((data, index) => (
                  <Grid item xs={6} sm={4} md={4} key={index}>
                    <Button
                      fullWidth
                      onClick={e => {
                        e.stopPropagation()
                        setSelectedProduct(data)
                        handleClickProduct()
                      }}
                      sx={{
                        maxWidth: '300px',
                        border: '1px solid',
                        p: 3,
                        textAlign: 'center',
                        width: '100%',
                        height: '5.5rem',
                        backgroundColor: 'primary',
                        textWrap: 'wrap',
                        marginBottom: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                        {data.productName}
                      </Typography>
                      {data.description && (
                        <Typography variant="caption" sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>
                          {`(${data.description})`}
                        </Typography>
                      )}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Box>
            {/* Custom Product */}
            <Box
              sx={{
                height: '100%',
                flex: 1,
                overflowY: 'auto',
                overflowX: 'hidden',
                display: showProduct ? 'none' : 'block',
                paddingBottom: 2
              }}
            >
              <ProductCustomField append={append} control={control} errors={errors} fields={fields} />
            </Box>
          </Grid>
          {/* Cart */}
          <Grid
            item
            xs={12}
            md={showFilter ? 4 : 6}
            sx={{
              height: '100%',
              maxHeight: '100%',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              minHeight: 0
            }}
          >
            {/* <Grid container spacing={{ xs: 1, md: 2 }} sx={{ height: showBreakdown ? '95%' : '100%' }}> */}
            <Box
              sx={{
                flexGrow: 1,
                overflowY: 'auto',
                pr: 1, // for scrollbar spacing
                '&::-webkit-scrollbar': { width: 6 },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: '#c1c1c1',
                  borderRadius: 3
                },
                '&::-webkit-scrollbar-thumb:hover': {
                  backgroundColor: '#a0a0a0'
                },
                transition: 'max-height 0.3s ease',
                height: showBreakdown ? '95%' : '100%'
              }}
            >
              <Grid item xs={12} sx={{ height: isLowHeight ? 'calc(100% - 120px)' : 'calc(100% - 180px)' }}>
                <CartProductPos
                  data={fields}
                  control={control}
                  helperTextPrice={helperTextPrice}
                  setOpenEditProduct={() => setOpenModalEditProduct(true)}
                  selectedProductEdit={selectedProductEdit}
                  setSelectedProductEdit={setSelectedProductEdit}
                  handleDeleteCustom={handleDeleteCustom}
                  isMobile={isMobile}
                  isTablet={isTablet}
                  heightBody={heightBody}
                  isLowHeight={isLowHeight}
                />
              </Grid>
              <Grid item xs={12} sx={{ height: isLowHeight ? '120px' : '180px', mt: 2, flexShrink: 0 }}>
                <Grid container spacing={{ xs: 1, md: 1 }} sx={{ height: '100%' }}>
                  {/* === TOTAL SECTION === */}
                  <TotalSectionPos
                    isLowHeight={isLowHeight}
                    getTotals={getTotals}
                    showBreakdown={showBreakdown}
                    setShowBreakdown={setShowBreakdown}
                  />
                  {/* === BUTTONS: NEXT BILL & CHARGE === */}
                  <Grid item xs={12} sx={{ height: isLowHeight ? '60px' : '50px' }}>
                    <Grid container spacing={{ xs: 2, md: 4 }} sx={{ height: '100%' }}>
                      <Grid item xs={6}>
                        <Button
                          disabled={disableButtonCharge}
                          fullWidth
                          variant={'outlined'}
                          onClick={handleSaveBill}
                          sx={{
                            height: '100%',
                            fontSize: isLowHeight ? '0.7rem' : 'inherit'
                          }}
                        >
                          Next Bill {isLowHeight ? '' : priceFormat(getValues('grandTotal'))}
                        </Button>
                      </Grid>
                      <Grid item xs={6}>
                        <Button
                          disabled={disableButtonCharge}
                          fullWidth
                          variant={'contained'}
                          onClick={handleClickCharge}
                          sx={{
                            height: '100%',
                            fontSize: isLowHeight ? '0.7rem' : 'inherit'
                          }}
                        >
                          Charge {isLowHeight ? '' : priceFormat(getValues('grandTotal'))}
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                  {/* === CLEAR BUTTON === */}
                  <Grid item xs={12} sx={{ height: isLowHeight ? '35px' : '60px' }}>
                    <Button
                      disabled={disableButtonClear}
                      fullWidth
                      sx={{
                        backgroundColor: '#ffcdd2',
                        color: '#c62828',
                        height: '100%',
                        fontSize: isLowHeight ? '0.7rem' : 'inherit',
                        '&:hover': {
                          backgroundColor: '#ef9a9a'
                        },
                        '&:disabled': {
                          backgroundColor: '#e0e0e0',
                          color: '#9e9e9e'
                        }
                      }}
                      onClick={() => {
                        swalConfirmationOnly({
                          title: 'Yakin menghapus keranjang?',
                          text: 'Anda akan menghapus keranjang',
                          icon: 'warning',
                          showCancelButton: true,
                          onClickYes: () => {
                            remove()
                            localStorage.setItem('listProductPos', JSON.stringify([]))
                          }
                        })
                      }}
                    >
                      Clear
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
            {/* </Grid> */}
          </Grid>

          <Script
            src='/epos-2.27.0.js'
            strategy='afterInteractive'
            onLoad={() => {
              setScriptEpos(true)
              console.log('📜 ePOS SDK Loaded')
            }}
          />
        </Grid>
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
          isCartValidated={isCartValidated}
          applyValidatedPrices={applyValidatedPrices}
          onCartChange={() => setIsCartValidated(false)}
        />
      )}
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
