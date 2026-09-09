import Grid from '@mui/material/Grid'

// ** Shared Components
import PageHeader from 'src/views/common/PageHeader'
import TableRole from 'src/views/settings/roles/TableRole'

export default function PermissionsTable() {
  return (
    <Grid container>
      <Grid item xs={12}>
        <PageHeader
          title='Daftar Otoritas'
          breadcrumbs={[{ label: 'Users & Permissions' }, { label: 'Permissions' }]}
        />
        <TableRole />
      </Grid>
    </Grid>
  )
}
