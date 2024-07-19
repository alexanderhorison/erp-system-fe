import { Button, CardContent, Grid, MenuItem } from '@mui/material'
import CustomTextField from 'src/@core/components/mui/text-field'

export default function FilterUser({ filterInput, handleFilterInput, clearAllFilter, submitFilter, roles }) {
  return (
    <>
      <CardContent>
        <Grid container spacing={6}>
          <Grid item sm={4} xs={12}>
            <CustomTextField
              select
              fullWidth
              defaultValue='Pilih Otoritas'
              SelectProps={{
                value: filterInput?.roleId,
                displayEmpty: true,
                onChange: e => handleFilterInput(e)
              }}
              name='roleId'
            >
              <MenuItem Select value=''>
                Select Role
              </MenuItem>
              {roles?.map((data, index) => {
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
              defaultValue='Status Pengguna'
              name='status'
              SelectProps={{
                value: filterInput?.status,
                displayEmpty: true,
                onChange: e => handleFilterInput(e)
              }}
            >
              <MenuItem value=''>Status Pengguna</MenuItem>
              <MenuItem value='active'>Aktif</MenuItem>
              <MenuItem value='notActive'>Tidak Aktif</MenuItem>
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
