import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Card, CardContent, Divider, Grid, IconButton, MenuItem, Typography } from '@mui/material'
import React from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import CustomTextField from 'src/@core/components/mui/text-field'

import Icon from 'src/@core/components/icon'
import * as yup from 'yup'
import { useRouter } from 'next/router'
import { addMasterDataWarehouseRack, editMasterDataWarehouseRack } from 'src/store/apps/master/warehouse-rack'

export default function TableAddMasterWarehouseRack({ warehouse, typeModal }) {
  const dispatch = useDispatch()
  const router = useRouter()

  const { keyAttributes, defaultValue, detail: warehouseRackDetail } = useSelector(state => state.masterWarehouseRack) // Ini state key nya hardcode

  const schema = yup.object({
    name: yup.string().required('Nama Rak tidak boleh kosong'),
    description: yup.string().optional(),
    data: yup.array().of(
      yup.object().shape({
        key: yup.string().required('Key attribut harus dipilih'),
        value: yup.string().required('Value attribut harus diisi')
      })
    )
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
  const selectedKeys = watch('data')?.map(item => item.key)

  // Filter out selected keys from the options
  const getAvailableKeys = currentKey => {
    return keyAttributes.filter(attr => !selectedKeys.includes(attr.key) || attr.key === currentKey)
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
                <Grid container spacing={6}>
                  <Grid item xs={4}>
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
                  <Grid item xs={4}>
                    <Controller
                      name='description'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
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
              </CardContent>
              <Typography fontSize={18} sx={{ marginLeft: '1.5rem;' }}>
                Rak Attribute
              </Typography>
              {fields.map((item, index) => (
                <React.Fragment key={item.id}>
                  <CardContent>
                    <Grid container spacing={6}>
                      <Grid item xs={4}>
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
                      <Grid item xs={3}>
                        <Controller
                          name={`data[${index}].value`}
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
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
                          )}
                        />
                      </Grid>
                      <Grid item xs={1} sx={{ marginTop: 'auto' }}>
                        {fields.length !== 1 ? (
                          <IconButton onClick={() => deleteItem(index)} sx={{ color: 'text.primary' }}>
                            <Icon icon='tabler:trash' />
                          </IconButton>
                        ) : null}
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
              >
                Cancel
              </Button>
              <Button variant='contained' type='submit' startIcon={<Icon icon='tabler:send' />}>
                Submit
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </>
  )
}
