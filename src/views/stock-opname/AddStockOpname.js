import { Button, Card, CardContent, Grid, useTheme } from '@mui/material'
import { forwardRef, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'
import CustomTextField from 'src/@core/components/mui/text-field'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import Icon from 'src/@core/components/icon'
import { useRouter } from 'next/router'

import { fetchMasterDataWarehouse } from 'src/store/apps/master/warehouse'
import { fetchListProductByWarehouse } from 'src/store/apps/product-warehouse'
import TableAddStockOpname from './TableAddStockOpname'
import { createStockOpname, updateStatusStockOpname } from 'src/store/apps/stock-opname'

const PickersComponent = forwardRef(({ ...props }, ref) => {
  // ** Props
  const { label, readOnly } = props

  return (
    <CustomTextField
      fullWidth
      {...props}
      inputRef={ref}
      label={label || ''}
    />
  )
})

export default function AddStockOpname({ warehouse }) {
  const dispatch = useDispatch()
  const router = useRouter()
  const [date, setDate] = useState(new Date())
  const theme = useTheme()
  const { direction } = theme
  const popperPlacement = direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  const { data: masterDataWarehouse } = useSelector(state => state.warehouse)
  const { dataListProductWarehouse: dataProduct, loadingListProductWarehouse: loading } = useSelector(
    state => state.productWarehouse
  )

  const [fields, setFields] = useState([])

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues
  } = useForm({
    mode: 'onChange'
  })

  const onSubmit = e => {
    e.preventDefault()
    const mapData = fields.map(item => {
      let different = item.quantity - item.actualStock
      if (isNaN(different)) {
        different = null
      }
      return {
        warehouseProductId: item.productWarehouseId,
        systemStock: item.quantity,
        actualStock: item?.actualStock || null,
        diff: item?.actualStock ? Math.abs(different) : null
      }
    })
    let sendData = {
      warehouseId: getValues('warehouseOrigin'),
      opnameDate: date,
      data: mapData,
      status: 'DRAFT',
      notes: getValues('notes')
    }
    dispatch(createStockOpname({ sendData, router }))
  }

  useEffect(() => {
    fields.length !== 0 && setFields([])
    if (dataProduct?.data && fields.length === 0) {
      setFields(dataProduct?.data)
    }
  }, [dataProduct])

  useEffect(() => {
    setFields([])
  }, [])

  useEffect(() => {
    dispatch(fetchMasterDataWarehouse())
  }, [dispatch])

  const handleChange = (actualStock, productWarehouseId) => {
    let data = fields
    const index = data.findIndex(item => item.productWarehouseId === productWarehouseId)
    // create new key actualStock
    if (index !== -1) {
      const updatedFields = [...data]
      updatedFields[index] = {
        ...updatedFields[index],
        actualStock: +actualStock || null
      }
      setFields(updatedFields)
    }
  }

  const handlePending = () => {
    const tempDate = new Date(date)
    const formattedDate = tempDate.toISOString().split('T')[0]
    const mapData = fields.map(item => {
      let different = item.quantity - item.actualStock
      if (isNaN(different)) {
        different = null
      }
      return {
        warehouseProductId: item.productWarehouseId,
        systemStock: item.quantity,
        actualStock: item?.actualStock || null,
        diff: item?.actualStock ? Math.abs(different) : null
      }
    })
    let sendData = {
      warehouseId: getValues('warehouseOrigin'),
      opnameDate: formattedDate,
      data: mapData,
      status: 'PENDING',
      notes: getValues('notes')
    }
    dispatch(createStockOpname({ sendData, router }))
  }

  return (
    <form onSubmit={e => onSubmit(e)}>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Grid container display='flex' gap={4} justifyContent={'space-between'}>
                <Grid item xs={12} md={5.9}>
                  <Controller
                    name={`warehouseOrigin`}
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomAutocomplete
                        options={masterDataWarehouse}
                        id='autocomplete-custom'
                        getOptionLabel={option => option.name || ''}
                        onChange={(event, newValue) => {
                          onChange(+newValue?.id)
                          dispatch(fetchListProductByWarehouse({ warehouseId: +newValue?.id }))
                        }}
                        renderInput={params => (
                          <CustomTextField
                            value={value}
                            {...params}
                            error={Boolean(errors?.warehouseOrigin)}
                            {...(errors?.warehouseOrigin && {
                              helperText: errors?.warehouseOrigin.message
                            })}
                            label='Gudang Sumber'
                          />
                        )}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={5.9}>
                  <DatePicker
                    selected={date}
                    id='basic'
                    popperPlacement={popperPlacement}
                    onChange={date => setDate(date)}
                    customInput={<PickersComponent label='Pilih Tanggal' />}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <TableAddStockOpname data={fields} handleChange={handleChange} />
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Grid item xs={12}>
                <Controller
                  name={`notes`}
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      multiline
                      rows={3}
                      fullWidth
                      label='Catatan'
                      placeholder={'Catatan...'}
                      value={value}
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
        <Grid
          container
          sx={{ paddingLeft: '25px', marginTop: '20px' }}
          display='flex'
          justifyContent='flex-end'
          gap={6}
        >
          <Button variant='tonal' color='secondary' onClick={() => router.back()} startIcon={<Icon icon='tabler:x' />}>
            Cancel
          </Button>
          <Button variant='contained' type='submit' startIcon={<Icon icon='tabler:send' />}>
            Submit
          </Button>
          {/* <Button variant='contained' onClick={handlePending} startIcon={<Icon icon='tabler:square-rounded-check' />}>
            Selesaikan Stok Opname
          </Button> */}
        </Grid>
      </Grid>
    </form>
  )
}
