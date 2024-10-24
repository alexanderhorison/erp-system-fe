import { Box, Button, Card, Dialog, DialogActions, DialogContent, Grid, Typography } from "@mui/material";
import { CustomCloseButton } from "../pages/dialog-examples/DialogEditUserInfo";
import Icon from 'src/@core/components/icon'
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import * as yup from 'yup'
import { fetchListProductTransformation, fetchProductWarehouseDetail, transformProductFromSalesOrder } from "src/store/apps/product-warehouse";
import { yupResolver } from "@hookform/resolvers/yup";
import CardAdjustProduct from "../product-warehouse/warehouse/CardAdjustProduct";
import CustomAutocomplete from "src/@core/components/mui/autocomplete";
import CustomTextField from "src/@core/components/mui/text-field";


export default function ModalTransformProductSalesOrder({
  open,
  setOpen,
  warehouseProductId,
  quantity,
  setValue,
  getValues,
  indexForm,
  update,
  listProduct,
  warehouseId,
}) {
  const dispatch = useDispatch()

  const [selectedUnit, setSelectedUnit] = useState({})
  const [qty, setQty] = useState(quantity)

  const { detailProductWarehouse, listTransformation } = useSelector(state => state.productWarehouse)

  const title = useMemo(() => {
    return "Transformasi Produk"
  }, [])

  const schema = yup.object().shape({
    transformation: yup.string().required('Rumus harus dipilih'),
  })

  const handleClose = () => {
    setOpen(false)
  }

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm({
    values: detailProductWarehouse,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    dispatch(fetchProductWarehouseDetail(warehouseProductId))
    dispatch(fetchListProductTransformation(warehouseProductId))
  }, [warehouseProductId])

  const result = useMemo(() => {
    if (qty > detailProductWarehouse.quantity) {
      setError(`qtyTransformation`, {
        type: 'duplicate',
        message: `Jumlah melebihi stok tersedia`
      })
      return 'Jumlah melebihi stok tersedia'
    }
    if (qty && selectedUnit?.unitTo?.name) {
      if (qty % selectedUnit?.amountFrom !== 0) {
        return `Jumlah harus kelipatan ${selectedUnit?.amountFrom}`;
      }
      const total = (qty / selectedUnit?.amountFrom) * selectedUnit?.amountTo
      return `${total} ${selectedUnit?.unitTo?.name}`
    }
    return "-"
  }, [selectedUnit, qty, detailProductWarehouse, setError])

  // ON SUBMIT
  const onSubmit = data => {
    if (!selectedUnit) {
      setError(`transformation`, {
        type: 'duplicate',
        message: `Rumus harus dipilih`
      })
    } else {
      if (qty % selectedUnit?.amountFrom !== 0) {
        setError(`qtyTransformation`, {
          type: 'duplicate',
          message: `Jumlah harus kelipatan ${selectedUnit.amountFrom}`
        })
      } else if (qty > detailProductWarehouse.quantity) {
        setError(`qtyTransformation`, {
          type: 'duplicate',
          message: `Jumlah melebihi stok tersedia`
        })
      } else {
        const sendData = {
          masterTransformationId: selectedUnit.id,
          productWarehouseId: detailProductWarehouse.id,
          qtyTransformation: qty,
          warehouseRackId: detailProductWarehouse.warehouseRackId
        }

        dispatch(transformProductFromSalesOrder({
          id: detailProductWarehouse.id,
          data: sendData,
          setOpen: setOpen,
          setValue: setValue,
          getValues: getValues,
          indexForm: indexForm,
          update: update,
          listProduct: listProduct,
          warehouseId: warehouseId
        }))
      }
    }
  }

  return (
    < Card >
      <Dialog
        fullWidth
        open={open}
        maxWidth='sm'
        scroll='body'
        onClose={handleClose}
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent
            sx={{
              pb: theme => `${theme.spacing(8)} !important`,
              px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
              pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
            }}
          >
            <CustomCloseButton onClick={handleClose}>
              <Icon icon='tabler:x' fontSize='1.25rem' />
            </CustomCloseButton>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Typography variant='h3' sx={{ mb: 3 }}>
                {title}
              </Typography>
            </Box>

            <Grid container spacing={6}>
              <Grid item xs={12} sm={12}>
                <CardAdjustProduct data={detailProductWarehouse} width={"md"} />
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={6}>
                  <Grid item xs={12}>
                    <Controller
                      name={`transformation`}
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomAutocomplete
                          // key={index}
                          options={listTransformation}
                          id='autocomplete-custom'
                          getOptionLabel={option => option.info || ''}
                          onChange={(event, newValue) => {
                            onChange(+newValue?.id)
                            setSelectedUnit(newValue)
                          }}
                          renderInput={params => (
                            <CustomTextField
                              value={value}
                              {...params}
                              error={Boolean(errors?.transformation)}
                              {...(errors?.transformation && {
                                helperText: errors?.transformation.message
                              })}
                              label='Pilih rumus'
                            />
                          )}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Controller
                      name='qtyTransformation'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          label='Jumlah'
                          value={quantity}
                          disabled
                          onChange={e => {
                            onChange(e.target.value)
                          }}
                          type='number'
                          sx={{ display: 'block' }}
                          error={Boolean(errors.qtyTransformation)}
                          {...(errors.qtyTransformation && { helperText: errors.qtyTransformation.message })}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box display="flex" justifyContent="space-between" width="100%">
                      <Typography variant=''>{"Hasil"}</Typography>
                      <Typography variant=''>{result}</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

          </DialogContent>
          <DialogActions
            sx={{
              // justifyContent: 'center',
              px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
              pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
            }}
          >

            <>
              <Button variant='tonal' color='secondary' onClick={handleClose} >
                Cancel
              </Button>
              <Button type='submit' variant='contained' >
                Submit
              </Button>
            </>

          </DialogActions>
        </form>

      </Dialog>
    </ Card >
  )
}