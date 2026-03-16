// ** React Imports
import { useEffect, useMemo } from 'react'
import * as yup from 'yup'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { yupResolver } from '@hookform/resolvers/yup'

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

import { editProductWarehouse } from 'src/store/apps/product-warehouse'
import CardAdjustProduct from './CardAdjustProduct'
import BaseModal from 'src/views/common/BaseModal'

const titleMap = {
  PLUS: 'Tambah Produk',
  MINUS: 'Kurangi Produk',
  MINIMUM_STOCK: 'Atur Stok Minimum'
  // Tambahkan lebih banyak pemetaan jika diperlukan
}

export default function ModalAdjustProduct({ open, setOpen, typeModal, warehouseId }) {
  const dispatch = useDispatch()

  const { detailProductWarehouse, loadingDetailProductWarehouse, loadingEditProduct } = useSelector(state => state.productWarehouse)

  const title = useMemo(() => {
    return titleMap[typeModal] || 'Title Default'
  }, [typeModal])

  // SHCEMA YUP VALIDATION
  const schema = yup.object().shape({
    quantity: yup
      .string()
      .required('Jumlah stok minimal harus diisi')
      .test(
        'is-non-negative',
        'Jumlah stok minimal tidak boleh minus',
        value => {
          // Check if the value is a number and is non-negative
          const num = Number(value);
          return !isNaN(num) && num >= 0;
        }
      ),
    quantityAdjustment:
      typeModal !== 'MINIMUM_STOCK'
        ? yup
          .string()
          .required('Jumlah adjustment harus diisi')
          .test(
            'is-valid-number',
            'Jumlah adjustment harus berupa angka',
            function (value) {
              const num = Number(value);
              return !isNaN(num);
            }
          )
          .test(
            'is-non-negative',
            'Jumlah adjustment tidak boleh minus',
            function (value) {
              const num = Number(value);
              return num >= 0;
            }
          )
          .test(
            'quantity-adjustment',
            'Jumlah Adjustment tidak boleh lebih besar dari Kuantiti ketika adjustment_type adalah MINUS',
            function (value) {
              const num = Number(value);
              if (typeModal === 'MINUS' && num > this.parent.quantity) {
                throw new yup.ValidationError(
                  'Jumlah tidak boleh lebih besar dari Kuantiti jika mengurangi produk',
                  null,
                  'quantityAdjustment'
                );
              }
              return true;
            }
          ) : yup.mixed(),
    minimumStock: yup
      .string()
      .required('Jumlah stok minimal harus diisi')
      .test(
        'is-non-negative',
        'Jumlah stok minimal tidak boleh minus',
        value => {
          // Check if the value is a number and is non-negative
          const num = Number(value);
          return !isNaN(num) && num >= 0;
        }
      )
  })

  // REACT FORM
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    values: detailProductWarehouse,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  // ON SUBMIT
  const onSubmit = data => {
    const idProduct = data.id
    const sendData = {
      ...(typeModal !== 'MINIMUM_STOCK' ? { quantityAdjustment: data.quantityAdjustment } : {}),
      ...(typeModal !== 'MINIMUM_STOCK' ? { quantity: data.quantity } : {}),
      ...(typeModal === 'MINIMUM_STOCK' ? { minimumStock: data.minimumStock } : {}),
      adjustmentType: typeModal
    }
    dispatch(editProductWarehouse({ id: idProduct, data: sendData, warehouseId }))
    setOpen(false)
  }

  useEffect(() => {
    // disable warn for select if select not have a child item
    console.warn = () => { }
  }, [dispatch])

  // CLOSE MODAL AND RESET FORM
  const handleClose = () => {
    setOpen(false)
  }

  return (
    <BaseModal
      open={open}
      onClose={handleClose}
      onSubmit={handleSubmit(onSubmit)}
      title={title}
      size='sm'
      showActions={typeModal !== 'VIEW'}
      loading={loadingEditProduct}
      loadingPage={loadingDetailProductWarehouse}
    >
      <Grid container spacing={6}>
          <Grid item xs={12} sm={12}>
            <CardAdjustProduct data={detailProductWarehouse} />
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={6}>
              {typeModal !== 'MINIMUM_STOCK' && (
                <>
                  <Grid item xs={12}>
                    <Controller
                      name='quantityAdjustment'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          label='Jumlah'
                          value={value}
                          onChange={e => {
                            onChange(e.target.value)
                          }}
                          type='number'
                          sx={{ display: 'block' }}
                          error={Boolean(errors.quantityAdjustment)}
                          {...(errors.quantityAdjustment && { helperText: errors.quantityAdjustment.message })}
                        />
                      )}
                    />
                  </Grid>
                </>
              )}
              {typeModal === 'MINIMUM_STOCK' && (
                <Grid item xs={12}>
                  <Controller
                    name='minimumStock'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        label='Stok Minimal'
                        value={value}
                        onChange={e => {
                          onChange(e.target.value)
                        }}
                        type='number'
                        sx={{ display: 'block' }}
                        error={Boolean(errors.minimumStock)}
                        {...(errors.minimumStock && { helperText: errors.minimumStock.message })}
                      />
                    )}
                  />
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
    </BaseModal>
  )
}
