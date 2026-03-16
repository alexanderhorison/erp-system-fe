// ** React Imports
import { useEffect, useMemo, useState } from 'react'
import * as yup from 'yup'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { yupResolver } from '@hookform/resolvers/yup'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import { transformProduct } from 'src/store/apps/product-warehouse'
import CardAdjustProduct from './CardAdjustProduct'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'
import BaseModal from 'src/views/common/BaseModal'

export default function ModalTransformationProduct({ open, setOpen, typeModal, warehouseId }) {
  const dispatch = useDispatch()
  const [selectedUnit, setSelectedUnit] = useState({})
  const [qty, setQty] = useState(0)

  const { detailProductWarehouse, listTransformation, loadingListTransformation, loadingTransformProduct } = useSelector(state => state.productWarehouse)

  // SHCEMA YUP VALIDATION
  const schema = yup.object().shape({
    transformation: yup.string().required('Rumus harus dipilih'),
    qtyTransformation: yup.string()
      .required('Kuantiti harus diisi')
      .test(
        'is-valid-number',
        'Kuantiti harus berupa angka',
        function (value) {
          const num = Number(value);
          return !isNaN(num);
        }
      )
      .test(
        'is-greater-than-zero',
        'Kuantiti harus lebih dari 0',
        function (value) {
          const num = Number(value);
          return num > 0;
        }
      ),
  })

  // REACT FORM
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
  // ON SUBMIT
  const onSubmit = data => {
    if (qty % selectedUnit.amountFrom !== 0) {
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
      dispatch(transformProduct({ id: detailProductWarehouse.id, data: sendData, warehouseId, setOpen: setOpen }))
    }
  }

  useEffect(() => {
    // disable warn for select if select not have a child item
    console.warn = () => { }
  }, [dispatch])

  // CLOSE MODAL AND RESET FORM
  const handleClose = () => {
    setOpen(false)
  }

  const result = useMemo(() => {
    if (qty > detailProductWarehouse.quantity) {
      setError(`qtyTransformation`, {
        type: 'duplicate',
        message: `Jumlah melebihi stok tersedia`
      })
      return 'Jumlah melebihi stok tersedia'
    }
    if (qty && selectedUnit?.unitTo?.name) {
      if (qty % selectedUnit.amountFrom !== 0) {
        return `Jumlah harus kelipatan ${selectedUnit.amountFrom}`;
      }
      const total = (qty / selectedUnit.amountFrom) * selectedUnit.amountTo
      return `${total} ${selectedUnit?.unitTo?.name}`
    }
    return "-"
  }, [selectedUnit, qty, detailProductWarehouse, setError])

  return (
    <BaseModal
      open={open}
      onClose={handleClose}
      onSubmit={handleSubmit(onSubmit)}
      title='Transformasi Produk'
      size='sm'
      showActions={typeModal !== 'VIEW'}
      loading={loadingTransformProduct}
      loadingPage={loadingListTransformation}
    >
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
                      value={value}
                      onChange={e => {
                        onChange(e.target.value)
                        setQty(e.target.value)
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
    </BaseModal>
  )
}
