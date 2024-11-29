import { Button, Card, CardContent, Grid } from '@mui/material'
import { useEffect, useState } from 'react'
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

  const onSubmit = (status) => {
    const mapData = fields.map(item => {
      let different = null
      if (item.actualStock !== null) {
        different = item.systemStock - item.actualStock
      }
      let actualStock = item.actualStock
      if (isNaN(different)) {
        different = null
      }
      if (item.actualStock === "") {
        actualStock = null
        different = null
      }
      return {
        id: item.id,
        warehouseProductId: item.productWarehouseId,
        actualStock: actualStock,
        diff: actualStock ? Math.abs(different) : different
      }
    })
    let sendData = {
      data: mapData,
      status: status,
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
    <form >
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
          <Button variant='contained' onClick={() => onSubmit("DRAFT")} startIcon={<Icon icon='tabler:send' />}>
            Submit
          </Button>
          {/* <Button variant='contained' onClick={() => onSubmit("PENDING")} startIcon={<Icon icon='tabler:square-rounded-check' />}>
            Selesaikan Stok Opname
          </Button> */}
        </Grid>
      </Grid>
    </form>
  )
}
