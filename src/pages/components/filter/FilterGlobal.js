import { Button, CardContent, CardHeader, Grid } from '@mui/material'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'
import CustomTextField from 'src/@core/components/mui/text-field'
import { fetchDataMasterCategory } from 'src/store/apps/master/category'
import { fetchMasterDataCompany } from 'src/store/apps/master/company'
import { fetchMasterDataType } from 'src/store/apps/master/type'
import { fetchMasterDataUnit } from 'src/store/apps/master/unit'
import { fetchMasterDataWarehouseRack } from 'src/store/apps/master/warehouse-rack'

export default function FilterGlobal({
  submitFilter,
  handleClear,
  listFilter = [],
  warehouseId,
}) {
  const dispatch = useDispatch()
  const autocompleteRefs = useRef({})
  // ADD DEFAULT VALUE HERE
  const defaultValueFilter = {
    categoryId: '',
    typeId: '',
    companyId: '',
    unitId: '',
    warehouseRackId: '',
  }
  const [filterInput, setFilterInput] = useState(defaultValueFilter)

  const { data: category } = useSelector(state => state.category)
  const { data: type } = useSelector(state => state.type)
  const { data: company } = useSelector(state => state.company)
  const { data: unit } = useSelector(state => state.unit)
  const { data: rack } = useSelector(state => state.masterWarehouseRack)

  // RESET FIELDS
  const clearAllFilter = useCallback(() => {
    Object.values(autocompleteRefs.current).forEach((ref) => {
      const clearIndicator = ref.querySelector('.MuiAutocomplete-clearIndicator');
      if (clearIndicator) {
        clearIndicator.click();
      }
    });
    setFilterInput(defaultValueFilter)
    handleClear()
  }, [handleClear])

  // FETCH NEEDED DATA
  useEffect(() => {
    listFilter.includes('category') && dispatch(fetchDataMasterCategory())
    listFilter.includes('type') && dispatch(fetchMasterDataType())
    listFilter.includes('company') && dispatch(fetchMasterDataCompany())
    listFilter.includes('unit') && dispatch(fetchMasterDataUnit())
    listFilter.includes('rack') && dispatch(fetchMasterDataWarehouseRack(warehouseId))
  }, [])

  return (
    <>
      <CardHeader title='Pencarian' />
      <CardContent>
        <Grid container spacing={6}>
          {
            listFilter.includes('category') &&
            <Grid item sm={4} xs={12}>
              <CustomAutocomplete
                ref={el => (autocompleteRefs.current.category = el)}
                id="autocomplete-custom-category"
                options={category}
                getOptionLabel={option => option?.name || ''}
                onChange={(event, newValue) => {
                  setFilterInput({ ...filterInput, categoryId: newValue?.id || "" })
                }}
                renderInput={params => (
                  <CustomTextField
                    {...params}
                    placeholder='Pilih category'
                  />
                )}
              />
            </Grid>
          }
          {
            listFilter.includes('type') &&
            <Grid item sm={4} xs={12}>
              <CustomAutocomplete
                ref={el => (autocompleteRefs.current.type = el)}
                id="autocomplete-custom-type"
                options={type}
                getOptionLabel={option => option.name || ''}
                onChange={(event, newValue) => {
                  setFilterInput({ ...filterInput, typeId: newValue?.id || "" })
                }}
                renderInput={params => (
                  <CustomTextField
                    {...params}
                    placeholder='Pilih type'
                  />
                )}
              />
            </Grid>
          }
          {
            listFilter.includes('company') &&
            <Grid item sm={4} xs={12}>
              <CustomAutocomplete
                ref={el => (autocompleteRefs.current.company = el)}
                id="autocomplete-custom-company"
                options={company}
                getOptionLabel={option => option.name || ''}
                onChange={(event, newValue) => {
                  setFilterInput({ ...filterInput, companyId: newValue?.id || "" })
                }}
                renderInput={params => (
                  <CustomTextField
                    {...params}
                    placeholder='Pilih company'
                  />
                )}
              />
            </Grid>
          }
          {
            listFilter.includes('unit') &&
            <Grid item sm={4} xs={12}>
              <CustomAutocomplete
                ref={el => (autocompleteRefs.current.unit = el)}
                id="autocomplete-custom-unit"
                options={unit}
                getOptionLabel={option => option.name || ''}
                onChange={(event, newValue) => {
                  setFilterInput({ ...filterInput, unitId: newValue?.id || "" })
                }}
                renderInput={params => (
                  <CustomTextField
                    {...params}
                    placeholder='Pilih Unit'
                  />
                )}
              />
            </Grid>
          }
          {
            listFilter.includes('rack') &&
            <Grid item sm={4} xs={12}>
              <CustomAutocomplete
                ref={el => (autocompleteRefs.current.rack = el)}
                id="autocomplete-custom-rack"
                options={rack}
                getOptionLabel={option => option.name || ''}
                onChange={(event, newValue) => {
                  setFilterInput({ ...filterInput, warehouseRackId: newValue?.id || "" })
                }}
                renderInput={params => (
                  <CustomTextField
                    {...params}
                    placeholder='Pilih rack'
                  />
                )}
              />
            </Grid>
          }
        </Grid>
      </CardContent>
      <CardContent>
        <Grid container spacing={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Grid item>
            <Button
              color='primary'
              variant='contained'
              sx={{ '& svg': { p: 0 } }}
              onClick={() => {
                clearAllFilter()
              }}
            >
              Clear Filter
            </Button>
          </Grid>
          <Grid item>
            <Button
              color='primary'
              variant='contained'
              sx={{ '& svg': { p: 0 } }}
              onClick={() => {
                submitFilter(filterInput)
              }}
            >
              Apply Filter
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </>
  )
}
