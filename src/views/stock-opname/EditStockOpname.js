import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

import CustomTextField from 'src/@core/components/mui/text-field'

import TableAddStockOpname from './TableAddStockOpname'
import { fetchDetailStockOpname, updateStockOpname } from 'src/store/apps/stock-opname'
import HeaderDetailStockOpname from './HeaderDetailStockOpname'

// ** Shared Components
import FormActionBar from 'src/views/common/FormActionBar'

// ** Design Tokens
import { colors, radii, shadows } from 'src/configs/designTokens'

const surfaceCardSx = {
  borderRadius: `${radii.lg}px`,
  border: `1px solid ${colors.border}`,
  boxShadow: shadows.xs
}


export default function EditStockOpname({ }) {
  const dispatch = useDispatch()
  const router = useRouter()

  const { id } = router.query

  const { detailStockOpname, loading, loadingUpdate } = useSelector(
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
    <form>
      {/* No `spacing` on this container: `FormActionBar`'s negative margins are
          measured against the content column, and grid gutters would offset it. */}
      <Grid container>
        <Grid item xs={12} lg={8.5} sx={{ pr: { lg: 4 } }}>
          <Grid container spacing={4}>
            <HeaderDetailStockOpname
              warehouseName={detailStockOpname?.warehouseName}
              createdAt={detailStockOpname?.createdAt}
              code={detailStockOpname?.code}
              status={detailStockOpname?.status}
              creatorName={detailStockOpname?.creatorName}
              id={detailStockOpname?.id}
            />
            <Grid item xs={12}>
              <TableAddStockOpname type='edit' data={fields} handleChange={handleChange} />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} lg={3.5} sx={{ mt: { xs: 4, lg: 0 } }}>
          <Card elevation={0} sx={surfaceCardSx}>
            <CardContent>
              <Typography
                sx={{ fontSize: '0.875rem', fontWeight: 600, lineHeight: '20px', color: colors.foreground, mb: 3 }}
              >
                Catatan
              </Typography>
              <Controller
                name={`notes`}
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    multiline
                    rows={4}
                    fullWidth
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
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <FormActionBar
            onCancel={() => router.push('/stock-opname')}
            onSubmit={() => onSubmit('DRAFT')}
            loading={loadingUpdate}
            submitLabel='Simpan'
            cancelLabel='Batal'
            submitIcon='tabler:device-floppy'
            loadingLabel='Menyimpan...'
          />
        </Grid>
      </Grid>
    </form>
  )
}
