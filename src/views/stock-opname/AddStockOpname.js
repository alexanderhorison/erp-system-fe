import { forwardRef, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { Controller, useForm } from 'react-hook-form'

// ** MUI Imports
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'

// ** Date Picker
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

// ** Custom Component Imports
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Store Imports
import { fetchMasterDataWarehouse } from 'src/store/apps/master/warehouse'
import { checkStockOpnameWarehouse, createStockOpname } from 'src/store/apps/stock-opname'

// ** Shared Components
import FormActionBar from 'src/views/common/FormActionBar'
import TableAddStockOpname from './TableAddStockOpname'

// ** Design Tokens
import { colors, radii, shadows } from 'src/configs/designTokens'

const surfaceCardSx = {
  borderRadius: `${radii.lg}px`,
  border: `1px solid ${colors.border}`,
  boxShadow: shadows.xs
}

const PickersComponent = forwardRef(({ ...props }, ref) => {
  // ** Props
  const { label, readOnly } = props

  return <CustomTextField fullWidth {...props} inputRef={ref} label={label || ''} />
})

export default function AddStockOpname({ warehouse }) {
  const dispatch = useDispatch()
  const router = useRouter()
  const [date, setDate] = useState(new Date())
  const theme = useTheme()
  const { direction } = theme
  const popperPlacement = direction === 'ltr' ? 'bottom-start' : 'bottom-end'
  const [fields, setFields] = useState([])
  const [warehouseId, setWarehouseId] = useState(0)

  const { data: masterDataWarehouse } = useSelector(state => state.warehouse)
  const { dataListProductWarehouse: dataProduct, loadingListProductWarehouse: loading } = useSelector(
    state => state.productWarehouse
  )

  const { checkStockOpname, loadingCheckStockOpname, loadingCreate } = useSelector(state => state.stockOpname)

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
        actualStock: isNaN(item.actualStock) ? null : item.actualStock === 0 ? 0 : item.actualStock,
        diff: item.actualStock !== null && item.actualStock !== 0 ? Math.abs(different) : null
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
    if (dataProduct?.data) {
      setFields(dataProduct?.data)
    }
  }, [dataProduct])

  useEffect(() => {
    dispatch(fetchMasterDataWarehouse())
  }, [dispatch])

  useEffect(() => {
    dispatch(checkStockOpnameWarehouse({ warehouseId: warehouseId }))
    setFields([])
  }, [])

  const handleChange = (actualStock, productWarehouseId) => {
    let data = fields
    const index = data.findIndex(item => item.productWarehouseId === productWarehouseId)
    // create new key actualStock
    if (index !== -1) {
      const updatedFields = [...data]
      updatedFields[index] = {
        ...updatedFields[index],
        actualStock: isNaN(actualStock) ? null : +actualStock === 0 ? 0 : +actualStock
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

  const handleChangeWarehouse = id => {
    dispatch(checkStockOpnameWarehouse({ warehouseId: id }))
  }

  return (
    <form onSubmit={e => onSubmit(e)}>
      {/* No `spacing` on this container: `FormActionBar`'s negative margins are
          measured against the content column, and grid gutters would offset it. */}
      <Grid container>
        {/* Left column: the opname itself. Right column: the note that
            annotates it, kept alongside rather than below the long table. */}
        <Grid item xs={12} lg={8.5} sx={{ pr: { lg: 4 } }}>
          <Card elevation={0} sx={surfaceCardSx}>
            <CardContent>
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Controller
                    name={`warehouseOrigin`}
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomAutocomplete
                        options={masterDataWarehouse}
                        disableClearable={true}
                        id='autocomplete-custom'
                        getOptionLabel={option => option.name || ''}
                        clearable={false}
                        onChange={(event, newValue) => {
                          onChange(+newValue?.id)
                          handleChangeWarehouse(+newValue?.id)
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
                <Grid item xs={12} md={6}>
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

          {checkStockOpname.isHaveStockOpname ? (
            <Alert
              severity='error'
              sx={{ mt: 4, borderRadius: `${radii.lg}px`, ':hover': { cursor: 'pointer' } }}
              onClick={() => router.push(`/stock-opname/${checkStockOpname.stockOpnameCode}`)}
            >
              {checkStockOpname.message}
            </Alert>
          ) : (
            <Box sx={{ mt: 4 }}>
              <TableAddStockOpname
                loading={loadingCheckStockOpname || loading}
                data={fields}
                handleChange={handleChange}
              />
            </Box>
          )}
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
            onCancel={() => router.back()}
            loading={loadingCreate}
            submitLabel='Simpan Draft'
            cancelLabel='Batal'
            submitIcon='tabler:device-floppy'
            loadingLabel='Menyimpan...'
          />
        </Grid>
      </Grid>
    </form>
  )
}
