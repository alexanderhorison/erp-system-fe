import { Button, Card, CardContent, Grid, Typography, useTheme } from '@mui/material'
import { forwardRef, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'
import { useRouter } from 'next/router'

import TableAddStockOpname from './TableAddStockOpname'
import { fetchDetailStockOpname, updateStockOpname } from 'src/store/apps/stock-opname'
import HeaderDetailStockOpname from './HeaderDetailStockOpname'


export default function EditStockOpname({ }) {
  const dispatch = useDispatch()
  const router = useRouter()

  const { id } = router.query

  const { detailStockOpname, loading } = useSelector(
    state => state.stockOpname
  )

  const [fields, setFields] = useState([])

  const {
    control,
    formState: { errors },
    getValues,
    setValue
  } = useForm({
    mode: 'onChange'
  })

  const onSubmit = e => {
    e.preventDefault()
    const mapData = fields.map(item => {
      let different = item.systemStock - item.actualStock
      if (isNaN(different)) {
        different = null
      }
      return {
        id: item.id,
        warehouseProductId: item.productWarehouseId,
        actualStock: item.actualStock,
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

  const handlePending = () => {
    const mapData = fields.map(item => {
      let different = item.systemStock - item.actualStock
      if (isNaN(different)) {
        different = null
      }
      return {
        id: item.id,
        warehouseProductId: item.productWarehouseId,
        actualStock: item?.actualStock || null,
        diff: item?.actualStock ? Math.abs(different) : null
      }
    })
    let sendData = {
      data: mapData,
      status: 'PENDING',
      notes: getValues('notes')
    }
    dispatch(updateStockOpname({ id, sendData, router }))
  }


  useEffect(() => {
    setFields(detailStockOpname?.listProduct)
    setValue("notes", detailStockOpname?.notes || "")
  }, [detailStockOpname, setValue])

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
        actualStock: actualStock
      }
      setFields(updatedFields)
    }
  }

  return (
    <form onSubmit={e => onSubmit(e)}>
      <Grid container spacing={6}>
        <HeaderDetailStockOpname
          warehouseName={detailStockOpname?.warehouseName}
          createdAt={detailStockOpname?.createdAt}
          code={detailStockOpname?.code}
          status={detailStockOpname?.status}
          creatorName={detailStockOpname?.creatorName}
          id={detailStockOpname?.id}
        />
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
          <Button variant='tonal' color='secondary' onClick={() => router.push('/stock-opname')} startIcon={<Icon icon='tabler:x' />}>
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
