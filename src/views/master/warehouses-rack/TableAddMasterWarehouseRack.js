import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Card, CardContent, CircularProgress, Divider, Grid, IconButton, MenuItem, Typography } from '@mui/material'
import React from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import CustomTextField from 'src/@core/components/mui/text-field'

import Icon from 'src/@core/components/icon'
import * as yup from 'yup'
import { useRouter } from 'next/router'
import { addMasterDataWarehouseRack, editMasterDataWarehouseRack } from 'src/store/apps/master/warehouse-rack'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import PickersComponent from 'src/views/forms/form-elements/pickers/PickersCustomInput'

export default function TableAddMasterWarehouseRack({ warehouse, typeModal }) {
  const dispatch = useDispatch()
  const router = useRouter()

  const { keyAttributes, defaultValue, detail: warehouseRackDetail, loadingAdd, loadingEdit } = useSelector(state => state.masterWarehouseRack) // Ini state key nya hardcode

  const schema = yup.object({
    name: yup.string().required('Nama Rak tidak boleh kosong'),
    description: yup.string().optional(),
    data: yup.array().of(
      yup.object().shape({
        key: yup.string().optional(),
        value: yup
          .string()
          .test('value-required-if-key', 'Value attribut tidak boleh kosong', function (value) {
            const { key } = this.parent
            if (key) {
              return !!value // value must be present if key is provided
            }
            return true // if key is not provided, value can be anything
          })
      })
    )
      .optional()
  })

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm({
    values: typeModal === 'ADD' ? defaultValue : warehouseRackDetail,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const { fields, remove, append } = useFieldArray({
    control,
    name: 'data'
  })

  const onSubmit = data => {
    data.warehouseId = warehouse.id
    if (typeModal === 'ADD') {
      dispatch(addMasterDataWarehouseRack({ data, warehouseId: warehouse.id, router }))
    } else if (typeModal === 'EDIT') {
      dispatch(editMasterDataWarehouseRack({ data, warehouseId: warehouse.id, router, id: warehouseRackDetail.id }))
    }
  }

  const addMore = () => {
    append({ key: '', value: '' })
  }

  const deleteItem = itemIndex => {
    remove(itemIndex)
  }

  // Watch all the selected keys
  const selectedKeys = watch('data')?.map(item => item?.key)

  // Filter out selected keys from the options
  const getAvailableKeys = currentKey => {
    return keyAttributes?.filter(attr => !selectedKeys?.includes(attr.key) || attr.key === currentKey)
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <Typography fontSize={18} sx={{ marginLeft: '1.5rem;', marginTop: '1rem' }}>
                Informasi Rak
              </Typography>
              <CardContent>
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={12}>
                      <Controller
                        name='name'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                          <CustomTextField
                            fullWidth
                            value={value}
                            label='Nama Rak'
                            placeholder=''
                            onChange={onChange}
                            error={Boolean(errors.name)}
                            aria-describedby='validation-schema-name'
                            {...(errors.name && { helperText: errors.name.message })}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <Controller
                        name='description'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                          <CustomTextField
                            fullWidth
                            multiline
                            rows={3}
                            value={value}
                            label='Deskripsi Rak'
                            placeholder=''
                            onChange={onChange}
                            error={Boolean(errors.description)}
                            aria-describedby='validation-schema-description'
                            {...(errors.description && { helperText: errors.description.message })}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </CardContent>
              <Typography fontSize={18} sx={{ marginLeft: '1.5rem;' }}>
                Rak Attribute
              </Typography>
              {fields.map((item, index) => (
                <React.Fragment key={item.id}>
                  <CardContent>
                    <Grid container spacing={6}>
                      <Grid item xs={5.5}>
                        <Controller
                          name={`data[${index}].key`}
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <CustomTextField
                              select
                              fullWidth
                              label='Pilih Key'
                              error={Boolean(errors?.data?.[index]?.key)}
                              {...(errors?.data?.[index]?.key && {
                                helperText: errors?.data?.[index]?.key.message
                              })}
                              SelectProps={{
                                value: value,
                                onChange: e => onChange(e)
                              }}
                            >
                              {getAvailableKeys(value)?.map((data, index) => {
                                return (
                                  <MenuItem Select key={index} value={data.key}>
                                    {data.key}
                                  </MenuItem>
                                )
                              })}
                            </CustomTextField>
                          )}
                        />
                      </Grid>
                      <Grid item xs={5.5}>
                        <Controller
                          name={`data[${index}].value`}
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange } }) => {
                            const selectKey = watch(`data[${index}].key`)
                            return selectKey === 'PRODUCTION DATE' || selectKey === 'EXPIRED DATE' ? (
                              <DatePicker
                                fullWidth
                                label='Value'
                                value={value}
                                onChange={e => {
                                  const formattedDate = new Date(e).toLocaleDateString('en-GB') // 'en-GB' formats the date as dd/mm/yy
                                  onChange(formattedDate)
                                }}
                                customInput={
                                  <PickersComponent
                                    fullWidth
                                    label='Value'
                                    error={Boolean(errors?.data?.[index]?.value)}
                                    {...(errors?.data?.[index]?.value && {
                                      helperText: errors?.data?.[index]?.value.message
                                    })}
                                  />
                                }
                                sx={{ display: 'block' }}
                              />
                            ) : (
                              <CustomTextField
                                fullWidth
                                label='Value'
                                value={value}
                                onChange={e => {
                                  onChange(e.target.value)
                                }}
                                sx={{ display: 'block' }}
                                error={Boolean(errors?.data?.[index]?.value)}
                                {...(errors?.data?.[index]?.value && {
                                  helperText: errors?.data?.[index]?.value.message
                                })}
                              />
                            )
                          }}
                        />
                      </Grid>
                      <Grid item xs={1} sx={{ marginTop: '18px' }}>
                        <IconButton onClick={() => deleteItem(index)} sx={{ color: 'text.primary' }}>
                          <Icon icon='tabler:trash' />
                        </IconButton>
                        {/* {fields.length !== 1 ? (
                          <IconButton onClick={() => deleteItem(index)} sx={{ color: 'text.primary' }}>
                            <Icon icon='tabler:trash' />
                          </IconButton>
                        ) : null} */}
                      </Grid>
                    </Grid>
                  </CardContent>
                  <Divider />
                </React.Fragment>
              ))}
              <CardContent>
                <Grid item>
                  <Button onClick={addMore} startIcon={<Icon icon='tabler:plus' />}>
                    Tambahkan Attribut
                  </Button>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid container sx={{ paddingLeft: '25px', marginTop: '20px' }} display='flex' justifyContent='space-between'>
            <Grid item></Grid>
            <Grid display='flex' justifyContent='space-between' gap={4}>
              <Button
                variant='tonal'
                color='secondary'
                onClick={() => router.back()}
                startIcon={<Icon icon='tabler:x' />}
                disabled={typeModal === 'ADD' ? loadingAdd : loadingEdit}
              >
                Cancel
              </Button>
              {(typeModal === 'ADD' ? loadingAdd : loadingEdit) ? (
                <Button variant='contained' disabled>
                  <CircularProgress size={20} sx={{ color: 'white', mr: 2 }} />
                  Submitting...
                </Button>
              ) : (
                <Button variant='contained' type='submit' startIcon={<Icon icon='tabler:send' />}>
                  Submit
                </Button>
              )}
            </Grid>
          </Grid>
        </Grid>
      </form>
    </>
  )
}
