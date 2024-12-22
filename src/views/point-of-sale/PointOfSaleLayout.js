import {
  Box,
  Button,
  Card,
  CardContent,
  Collapse,
  Grid,
  MenuItem,
  Typography
} from '@mui/material'
import { yupResolver } from '@hookform/resolvers/yup'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import CustomTextField from 'src/@core/components/mui/text-field'
import { priceFormat } from 'src/helpers/priceFormatter'
import * as yup from 'yup'
import ModalAddProductPos from './ModalAddProductPos'
import CartProductPos from './CartProductPos'

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

export default function PointOfSaleLayout({
  showFilter,
}) {
  const { data: companyData } = useSelector(state => state.company)
  const { data: typeData } = useSelector(state => state.type)
  const { data: categoryData } = useSelector(state => state.category)

  const { listProductPos } = useSelector(state => state.pos)

  const [openModalProduct, setOpenModalProduct] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState({})

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

  // const schema = yup.object({
  //   grandTotal: yup.number().typeError('Grand Total harus ada')
  // })

  // FORM BUAT CART
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
    getValues,
    watch
  } = useForm({
    values: {
      formData: localStorage.getItem('listProductPos') ? JSON.parse(localStorage.getItem('listProductPos')) : []
    },
    mode: 'onChange',
    // resolver: yupResolver(schema)
  })

  const { fields, remove, append } = useFieldArray({
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

    // console.log(filterForm);

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

  const helperTextPrice = index => {
    const info = {
      detailItem: `${getValues(`formData[${index}].unitName`)} @ ${priceFormat(getValues(`formData[${index}].price`))}`
    }
    return info
  }

  return (
    <Card>
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
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '75vh', p: 2 }}>
        <Grid container spacing={3}>
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
                  label={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      Filter By
                    </div>
                  }
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
          {/* PRODUCT */}
          <Grid item md={6} >
            <Grid container spacing={3} justifyContent="center" alignItems="center">
              <Grid item md={4} >
                <Button
                  fullWidth
                  variant={filterForm.typeProduct === 'ALL' ? 'contained' : 'outlined'}
                  onClick={() => {
                    setValueFilter('typeProduct', 'ALL')
                    setFilter({
                      ...filter,
                      typeProduct: 'ALL'
                    })
                  }}
                >
                  All
                </Button>
              </Grid>
              <Grid item md={4}>
                <Button
                  fullWidth
                  variant={filterForm.typeProduct === 'favorite' ? 'contained' : 'outlined'}
                  onClick={() => {
                    setValueFilter('typeProduct', 'favorite')
                    setFilter({
                      ...filter,
                      typeProduct: "favorite"
                    })
                  }}
                >
                  Favorite
                </Button>
              </Grid>
              <Grid item md={4}>
                <Button
                  fullWidth
                  variant={filterForm.typeProduct === 'custom' ? 'contained' : 'outlined'}
                  onClick={() => setValueFilter('typeProduct', 'custom')}
                >
                  Custom
                </Button>
              </Grid>
            </Grid>
          </Grid>
          {/* ADD CUSTOMER */}
          <Grid item md={showFilter ? 4 : 6}>
            <Button fullWidth variant='contained'>
              Add Customer
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
                height: '61vh',
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
            <Box
              sx={{
                maxHeight: '61vh',
                overflowY: 'auto',
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
          </Grid>
          {/* Cart */}
          <Grid item md={showFilter ? 4 : 6}>
            <CartProductPos
              data={fields}
              control={control}
              helperTextPrice={helperTextPrice}
            />
            <Button
              fullWidth
              variant={'contained'}
              sx={{ mt: 5 }}
              onClick={() => {
                remove()
                localStorage.setItem('listProductPos', JSON.stringify([]))
              }}
            >
              Clear
            </Button>
            <Button fullWidth variant={'contained'} sx={{ mt: 5 }}>
              Charge {priceFormat(getValues('grandTotal'))}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Card>
  )
}
