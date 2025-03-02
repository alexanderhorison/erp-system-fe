import {
  Box,
  Button,
  Grid,
  MenuItem,
  Typography
} from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
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
import Script from 'next/script'

// Kedepannya jika tambah filter, bisa tambahkan field ini
const listFilter = [
  {
    id: 1,
    name: 'Company',
    value: "COMPANY"
  },
  {
    id: 2,
    name: 'Type',
    value: "TYPE"
  },
  {
    id: 3,
    name: 'Category',
    value: "CATEGORY"
  },
]

const height = '62vh'

export default function PointOfSaleLayout({
  showFilter,
  setShowFilter,
  warehouse,
  setShowButtonFilter,
}) {
  const { data: companyData, loading } = useSelector(state => state.company)
  const { data: typeData } = useSelector(state => state.type)
  const { data: categoryData } = useSelector(state => state.category)

  const { listProductPos } = useSelector(state => state.pos)

  const [openModalProduct, setOpenModalProduct] = useState(false)
  const [openModalEditProduct, setOpenModalEditProduct] = useState(false)
  const [openModalAddCustomer, setOpenModalAddCustomer] = useState(false)
  const [openModalCharge, setOpenModalCharge] = useState(false)
  const [showProduct, setShowProduct] = useState(true)

  const [selectedProduct, setSelectedProduct] = useState({})
  const [selectedProductEdit, setSelectedProductEdit] = useState({})
  const [selectedCustomerPos, setSelectedCustomerPos] = useState(localStorage.getItem('selectedCustomerPos') ? JSON.parse(localStorage.getItem('selectedCustomerPos')) : {})

  const [filter, setFilter] = useState({
    type: "COMPANY",
    typeValue: "ALL",
    typeProduct: "ALL"
  })

  // FORM BUAT FILTER
  const {
    control: controlFilter,
    watch: watchFilter,
    setValue: setValueFilter
  } = useForm({
    defaultValues: {
      typeFilter: "COMPANY",
      typeProduct: 'ALL',
      typeValue: 'ALL',
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
      formData: localStorage.getItem('listProductPos') ? JSON.parse(localStorage.getItem('listProductPos')) : [],
    },
    mode: 'onChange',
    // resolver: yupResolver(schema)
  })

  const { fields, remove, append, update } = useFieldArray({
    control,
    name: 'formData'
  })
  const formField = watch('formData')

  const filteredProducts = useMemo(() => {
    const { typeFilter, typeValue, typeProduct } = filterForm
    if (typeValue === "ALL" && typeProduct === "ALL") {
      return listProductPos;
    }

    const filterKey = {
      CATEGORY: "categoryId",
      TYPE: "typeId",
      COMPANY: "companyId",
    }[typeFilter];

    return listProductPos.filter((el) => {
      // Check typeValue condition
      const matchesTypeValue = typeValue === "ALL" || (filterKey && el[filterKey] === typeValue);
      // Check typeProduct condition
      const matchesTypeProduct =
        typeProduct === "ALL"
          ? true
          : typeProduct === "favorite"
            ? el.isFavorite === true
            : true

      // Combine both conditions with AND
      return matchesTypeValue && matchesTypeProduct;
    });
  }, [filterForm, listProductPos]);

  const listLeftFilter = useMemo(() => {
    if (filterForm.typeFilter === "COMPANY") {
      return companyData
    }
    if (filterForm.typeFilter === "TYPE") {
      return typeData
    }
    if (filterForm.typeFilter === "CATEGORY") {
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
      detailItem: `${getValues(`formData[${index}].unitName`) ? getValues(`formData[${index}].unitName`) : ''} ${getValues(`formData[${index}].unitName`) ? `@` : ''} ${priceFormatWithZero(getValues(`formData[${index}].price`))}`
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
    setShowButtonFilter(false)
  }

  const handleClickAll = () => {
    setValueFilter('typeProduct', 'ALL')
    setFilter({
      ...filter,
      typeProduct: 'ALL'
    })
    setShowProduct(true)
    setShowButtonFilter(true)
  }

  const handleClickFavorite = () => {
    setValueFilter('typeProduct', 'favorite')
    setFilter({
      ...filter,
      typeProduct: "favorite"
    })
    setShowProduct(true)
    setShowButtonFilter(true)
  }

  const handleDeleteCustom = (item, index) => {
    remove(index)
    const updatedFields = formField.filter((_, i) => i !== index)
    localStorage.setItem('listProductPos', JSON.stringify(updatedFields))
    autoSavePos()
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
        },
      })
    }
  }

  useEffect(() => {
    const billId = JSON.parse(localStorage.getItem('billId'))
    if (!billId) {
      localStorage.setItem('billId', JSON.stringify(generateIdOpenBill()))
    }
  }, [])

  return (
    <Grid container spacing={3}>
      {
        openModalProduct &&
        <ModalAddProductPos
          open={openModalProduct}
          setOpen={setOpenModalProduct}
          data={selectedProduct}
          typeModal={"ADD"}
          addProduct={append}
          fields={fields}
        />
      }
      {
        openModalAddCustomer &&
        <ModalAddCustomerPos
          open={openModalAddCustomer}
          setOpen={setOpenModalAddCustomer}
          setSelectedCustomerPos={setSelectedCustomerPos}
          selectedCustomer={selectedCustomerPos}
        />
      }
      {
        openModalCharge &&
        <ModalChargePos
          open={openModalCharge}
          setOpen={setOpenModalCharge}
          subTotalPrice={subTotalPrice}
          listSelectedProduct={fields}
          customer={selectedCustomerPos}
          resetAllField={resetAllField}
          warehouse={warehouse}
        />
      }
      {
        openModalEditProduct &&
        <ModalEditProductPos
          open={openModalEditProduct}
          setOpen={setOpenModalEditProduct}
          data={selectedProductEdit}
          updateProduct={update}
          removeProduct={remove}
        />
      }
      {/* =============== HEADER ================= */}
      {/* FILTER */}
      <Grid item md={2} sx={{ display: showFilter ? 'block' : 'none' }}>
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
      <Grid item md={6} >
        <Grid container spacing={3} justifyContent="center" alignItems="center">
          <Grid item md={4} >
            <Button
              fullWidth
              variant={filterForm.typeProduct === 'ALL' ? 'contained' : 'outlined'}
              onClick={handleClickAll}
              disabled={warehouse?.warehouseId ? false : true}
            >
              All
            </Button>
          </Grid>
          <Grid item md={4}>
            <Button
              fullWidth
              variant={filterForm.typeProduct === 'favorite' ? 'contained' : 'outlined'}
              onClick={handleClickFavorite}
              disabled={warehouse?.warehouseId ? false : true}
            >
              Favorite
            </Button>
          </Grid>
          <Grid item md={4}>
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
      <Grid item md={showFilter ? 4 : 6}>
        <Button fullWidth variant='contained' onClick={handleClickAddCustomer}>
          {
            selectedCustomerPos?.name ? selectedCustomerPos.name : 'Add Customer'
          }
        </Button>
      </Grid>
      {/* =============== BODY ================ */}
      {/* Section Filter */}
      <Grid
        item
        xs={2}
        style={{ display: showFilter ? 'block' : 'none', transition: 'display 0.5s ease-in-out' }}
      >
        <Box
          sx={{
            maxHeight: 500,
            overflowY: 'auto',
            height: height,
          }}
        >
          <Grid container direction='column' spacing={2}>
            <Grid item xs={6} sm={4} md={4} key={999}>
              <Button
                fullWidth={true}
                variant={filterForm.typeValue === "ALL" ? 'contained' : 'outlined'}
                sx={{
                  height: 60,
                  textWrap: 'wrap',
                  textAlign: 'center'
                }}
                onClick={() => {
                  setValueFilter('typeValue', "ALL")
                  setFilter({
                    ...filter,
                    typeValue: "ALL"
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
                    height: 60,
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
      <Grid item xs={6}>
        {/* All Product */}
        <Box
          sx={{
            height: height,
            overflowY: 'auto',
            display: showProduct ? 'block' : 'none',
          }}
        >
          <Grid container spacing={2}>
            {filteredProducts?.map((data, index) => (
              <Grid item md={4} key={index}>
                <Button
                  fullWidth
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedProduct(data)
                    handleClickProduct()
                  }}
                  sx={{
                    maxWidth: '300px',
                    border: '1px solid',
                    p: 3,
                    textAlign: 'center',
                    width: '100%', // Ensures buttons expand horizontALLy
                    height: 100,
                    backgroundColor: 'primary',
                    textWrap: 'wrap'
                  }}
                >
                  {data.productName}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>
        {/* Custom Product */}
        <Box
          sx={{
            height: height,
            overflowY: 'auto',
            display: showProduct ? 'none' : 'block',
          }}
        >
          <ProductCustomField append={append} control={control} errors={errors} fields={fields} />
        </Box>
      </Grid>
      {/* Cart */}
      <Grid item md={showFilter ? 4 : 6}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <CartProductPos
              data={fields}
              control={control}
              helperTextPrice={helperTextPrice}
              setOpenEditProduct={() => setOpenModalEditProduct(true)}
              selectedProductEdit={selectedProductEdit}
              setSelectedProductEdit={setSelectedProductEdit}
              handleDeleteCustom={handleDeleteCustom}
            />
          </Grid>
          <Grid item xs={12}>
            <Grid container flex flexDirection={'row'} justifyContent={'space-between'} px={6}>
              <Grid item>
                <Typography align='center' variant='h6' sx={{ marginTop: '4px', fontWeight: 'bold', textWrap: 'wrap' }}>
                  Total:
                </Typography>
              </Grid>
              <Grid item>
                <Typography align='center' variant='h6' sx={{ marginTop: '4px', fontWeight: 'bold', textWrap: 'wrap' }}>
                  {priceFormat(subTotalPrice()) || "-"}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={4}>
              <Grid item xs={6}>
                <Button disabled={disableButtonCharge} fullWidth variant={'outlined'} onClick={handleSaveBill}>
                  Next Bill {priceFormat(getValues('grandTotal'))}
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button disabled={disableButtonCharge} fullWidth variant={'contained'} onClick={handleClickCharge}>
                  Charge {priceFormat(getValues('grandTotal'))}
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Button
              disabled={disableButtonClear}
              fullWidth
              // variant={'contained'}
              sx={{ backgroundColor: '#d6bdab' }}
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
      <Script
        src="/epos-2.27.0.js"
        strategy="afterInteractive"
        onLoad={() => console.log("📜 ePOS SDK Loaded")}
      />
    </Grid>
  )
}
