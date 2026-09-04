import Grid from '@mui/material/Grid'

import PageHeader from 'src/views/common/PageHeader'
import TableMasterUser from 'src/views/settings/user/TableMasterUser'

export default function UserList() {
  return (
    <Grid container>
      <Grid item xs={12}>
        <PageHeader title='Daftar Pengguna' breadcrumbs={[{ label: 'Users & Permissions' }, { label: 'Users' }]} />
        <TableMasterUser />
      </Grid>
    </Grid>
  )
}
