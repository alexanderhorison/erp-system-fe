import { Button, CardContent, Grid, MenuItem } from '@mui/material'
import CustomTextField from 'src/@core/components/mui/text-field'

export default function FilterProduct({
  filterInput,
  handleFilterInput,
  clearAllFilter,
  submitFilter,
  category,
  type,
  company
}) {
  return (
    <>
      <CardContent>
        <Grid container spacing={6}>
          <Grid item sm={4} xs={12}>
            <CustomTextField
              select
              fullWidth
              defaultValue='Pilih Kategori'
              SelectProps={{
                value: filterInput?.CategoryId,
                displayEmpty: true,
                onChange: e => handleFilterInput(e)
              }}
              name='CategoryId'
            >
              <MenuItem Select value=''>
                Select Category
              </MenuItem>
              {category?.map((data, index) => {
                return (
                  <MenuItem Select key={index} value={data.id}>
                    {data.name}
                  </MenuItem>
                )
              })}
            </CustomTextField>
          </Grid>
          <Grid item sm={4} xs={12}>
            <CustomTextField
              select
              fullWidth
              defaultValue='Pilih Type'
              SelectProps={{
                value: filterInput?.TypeId,
                displayEmpty: true,
                onChange: e => handleFilterInput(e)
              }}
              name='TypeId'
            >
              <MenuItem Select value=''>
                Select Type
              </MenuItem>
              {type?.map((data, index) => {
                return (
                  <MenuItem Select key={index} value={data.id}>
                    {data.name}
                  </MenuItem>
                )
              })}
            </CustomTextField>
          </Grid>
          <Grid item sm={4} xs={12}>
            <CustomTextField
              select
              fullWidth
              defaultValue='Pilih Company'
              SelectProps={{
                value: filterInput?.CompanyId,
                displayEmpty: true,
                onChange: e => handleFilterInput(e)
              }}
              name='CompanyId'
            >
              <MenuItem Select value=''>
                Select Company
              </MenuItem>
              {company?.map((data, index) => {
                return (
                  <MenuItem Select key={index} value={data.id}>
                    {data.name}
                  </MenuItem>
                )
              })}
            </CustomTextField>
          </Grid>
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
                submitFilter()
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
