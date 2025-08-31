import { Button, Card, CardContent, Grid, Typography } from "@mui/material"
import { Box } from "@mui/system"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Controller, useFieldArray, useForm } from "react-hook-form"
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import CustomTextField from "src/@core/components/mui/text-field"
import CustomAutocomplete from "src/@core/components/mui/autocomplete"
import { fetchDetailRequestOrder, processRequestOrder } from "src/store/apps/product-request-order"
import Icon from "src/@core/components/icon"
import { fetchMasterDataWarehouse } from "src/store/apps/master/warehouse"
import { findProductWarehouse } from "src/store/apps/product-warehouse"

const DisplayField = ({ title, value, secondValue }) => {
  return (
    <>
      <Typography fontSize="0.85rem">{title}</Typography>
      <CustomTextField value={value} disabled />
      {secondValue && (
        <Typography variant="body2" color="textSecondary">
          {secondValue}
        </Typography>
      )}
    </>
  )
}

export default function ProcessProductRequest() {
  const router = useRouter()
  const dispatch = useDispatch()
  const id = router.query.id

  const schema = yup.object().shape({
    notes: yup.string().optional(),
    data: yup.array().of(
      yup.object().shape({
        warehouseId: yup
          .number()
          .typeError("Gudang harus diisi")
          .required("Gudang harus diisi"),
        stock: yup
          .number()
          .typeError("Stock harus diisi")
          .required("Stock harus diisi")
          .default(0),
        qtyGive: yup
          .number()
          .typeError("Kuantitas Diberikan harus diisi")
          .required("Kuantitas Diberikan harus diisi")
          .min(0, "Kuantitas minimal 0")
          .test(
            "qty-give-not-exceed-stock", // unique test name
            "Kuantitas tidak boleh lebih dari stok", // error message
            function (value) {
              const { stock } = this.parent; // 👈 access sibling field
              if (value == null || stock == null) return true; // skip if empty
              return value <= stock;
            }
          ),
      })
    ),
  })

  const { detailRequestOrder } = useSelector(state => state.productRequest)
  const { data: masterWarehouse } = useSelector(state => state.warehouse)

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      data: [],
    },
  })

  const { fields } = useFieldArray({
    control,
    name: "data",
  })

  useEffect(() => {
    if (id) {
      dispatch(fetchDetailRequestOrder(id))
    }
    dispatch(fetchMasterDataWarehouse())
  }, [id, dispatch])

  useEffect(() => {
    if (detailRequestOrder?.listProducts?.length) {
      reset({
        notes: detailRequestOrder.notes || "",
        data: detailRequestOrder.listProducts.map(p => ({
          productWarehouseId: "",
          warehouseId: "",
          qtyGive: "",
          productName: p.productName,
          unitName: p.unitName,
          qtyRequest: p.quantityRequested,
          productId: p.productId,
          unitId: p.unitId,
        })),

      })
    }
  }, [detailRequestOrder, reset])

  const onSubmit = values => {
    const dataSend = {
      ...values,
      code: detailRequestOrder.code,
      warehouseDestinationId: detailRequestOrder.warehouseDestinationId,
    }
    dispatch(processRequestOrder({ data: dataSend, router }))
  }

  const handleFindProductWarehouse = (productId, unitId, warehouseId, index) => {
    dispatch(findProductWarehouse({ productId, unitId, warehouseId }))
      .then(({ payload }) => {
        if (payload.data) {
          setValue(`data.${index}.productWarehouseId`, payload.data.id)
          setValue(`data.${index}.stock`, payload.data.quantity)
        } else {
          setValue(`data.${index}.stock`, '0')
        }
      })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <Typography fontSize={20} sx={{ paddingTop: 2, ml: 5, mt: 3 }}>
              Produk Request  #{detailRequestOrder?.code}
            </Typography>
            <CardContent>
              {fields.map((field, index) => (
                <Grid container spacing={6} key={field.id} sx={{ mb: 2 }}>
                  {/* Product Name */}
                  <Grid item xs={12} md={3}>
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <Typography fontSize="0.85rem">Produk</Typography>
                      <Typography fontSize="1 rem" sx={{ mt: 2 }}>{`${field.productName} (${field.unitName})`}</Typography>
                    </Box>
                  </Grid>

                  {/* Request Qty */}
                  <Grid item xs={12} md={1.5}>
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <DisplayField title="Request" value={field.qtyRequest} />
                    </Box>
                  </Grid>

                  {/* Warehouse Select */}
                  <Grid item xs={12} md={3}>
                    <Controller
                      name={`data.${index}.warehouseId`}
                      rules={{ required: true }}
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <CustomAutocomplete
                          options={masterWarehouse.filter((data) => data.id !== 6)} // hardcode warehouse gudang depan
                          getOptionLabel={option => option.name || ""}
                          onChange={(e, newVal) => {
                            handleFindProductWarehouse(field.productId, field.unitId, newVal?.id, index)
                            onChange(newVal?.id || "")
                          }}
                          renderInput={params => (
                            <CustomTextField
                              {...params}
                              label="Gudang"
                              error={!!errors?.data?.[index]?.warehouseId}
                              helperText={
                                errors?.data?.[index]?.warehouseId?.message
                              }
                            />
                          )}
                        />
                      )}
                    />
                  </Grid>

                  {/* Stock */}
                  <Grid item xs={12} md={1.5}>
                    <Controller
                      name={`data.${index}.stock`}
                      rules={{ required: true }}
                      control={control}
                      render={({ field }) => (
                        <CustomTextField
                          {...field}
                          label="Stock"
                          error={!!errors?.data?.[index]?.stock}
                          helperText={
                            errors?.data?.[index]?.stock?.message
                          }
                          disabled
                        />
                      )}
                    />
                  </Grid>

                  {/* Qty Give */}
                  <Grid item xs={12} md={1.5}>
                    <Controller
                      name={`data.${index}.qtyGive`}
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <CustomTextField
                          {...field}
                          label="Qty Diberikan"
                          error={!!errors?.data?.[index]?.qtyGive}
                          helperText={
                            errors?.data?.[index]?.qtyGive?.message
                          }
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              ))}
              <Grid item xs={12} sx={{ mt: 4 }}>
                <Controller
                  name={`notes`}
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      multiline
                      rows={3}
                      fullWidth
                      label='Catatan'
                      placeholder={'Catatan...'}
                      value={value}
                      disabled
                      onChange={e => {
                        onChange(e.target.value)
                      }}
                      type='text'
                      sx={{ display: 'block' }}
                    />
                  )}
                />
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Submit Button */}
        <Grid item xs={12}>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              type="submit"
              variant="contained"
              startIcon={<Icon icon="tabler:send" />}
            >
              Submit
            </Button>
          </Box>
        </Grid>
      </Grid>
    </form>
  )
}
