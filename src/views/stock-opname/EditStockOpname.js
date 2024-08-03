import { Button, Card, CardContent, Grid, Typography, useTheme } from '@mui/material'
import { forwardRef, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'
import { useRouter } from 'next/router'

import TableAddStockOpname from './TableAddStockOpname'
import { fetchDetailStockOpname, updateStockOpname } from 'src/store/apps/stock-opname'

const PickersComponent = forwardRef(({ ...props }, ref) => {
  // ** Props
  const { label, readOnly } = props

  return (
    <CustomTextField
      fullWidth
      {...props}
      inputRef={ref}
      label={label || ''}
      {...(readOnly && { inputProps: { readOnly: true } })}
    />
  )
})

export default function EditStockOpname({ }) {
  const dispatch = useDispatch()
  const router = useRouter()
  const [date, setDate] = useState(new Date())
  const theme = useTheme()
  const { direction } = theme
  const popperPlacement = direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  const { id } = router.query

  const { data: masterDataWarehouse } = useSelector(state => state.warehouse)
  const { detailStockOpname, loading } = useSelector(
    state => state.stockOpname
  )

  const [fields, setFields] = useState([])

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue
  } = useForm({
    mode: 'onChange'
  })

  const onSubmit = e => {
    e.preventDefault()
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
      data: mapData,
      status: 'DRAFT',
      notes: getValues('notes')
    }
    dispatch(updateStockOpname({ id, sendData, router }))
  }

  useEffect(() => {
    if (detailStockOpname?.listProduct && fields.length === 0) {
      setFields(detailStockOpname?.listProduct)
    }
    setValue("notes", detailStockOpname?.notes || "")
  }, [detailStockOpname])

  useEffect(() => {
    dispatch(fetchDetailStockOpname(id))
  }, [id, dispatch])

  const handleChange = (actualStock, productWarehouseId) => {
    let data = fields
    const index = data.findIndex(item => item.productWarehouseId === productWarehouseId)
    if (index !== -1) {
      const updatedFields = [...data]
      updatedFields[index] = {
        ...updatedFields[index],
        actualStock: +actualStock || null
      }
      setFields(updatedFields)
    }
  }

  return (
    <form onSubmit={e => onSubmit(e)}>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Grid container gap={4}>
                <Grid container display='flex' gap={4} justifyContent={'space-between'}>
                  <Grid item xs={12} md={5}>
                    <CustomTextField
                      fullWidth
                      value={detailStockOpname?.warehouseName || "-"}
                      label='Nama Gudang'
                      disabled
                      aria-describedby='validation-schema-name'
                    />
                  </Grid>
                  <Grid item xs={12} md={5}>
                    <CustomTextField
                      fullWidth
                      value={detailStockOpname?.createdAt || "-"}
                      label='Tanggal Stock Opname'
                      placeholder=''
                      disabled
                      aria-describedby='validation-schema-name'
                    />
                  </Grid>
                </Grid>
                <Grid container gap={2} flexDirection={'column'}>
                  <Typography variant="body2" sx={{ color: 'text.primary' }}>
                    Code: {detailStockOpname?.code || "-"}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.primary' }}>
                    Dibuat Oleh: {detailStockOpname?.creatorName || "-"}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.primary' }}>
                    Status: {detailStockOpname?.status || "-"}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <TableAddStockOpname type="edit" data={fields} handleChange={handleChange} />
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
        </Grid>
      </Grid>
    </form>
  )
}
