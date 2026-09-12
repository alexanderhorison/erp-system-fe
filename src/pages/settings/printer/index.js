import Grid from '@mui/material/Grid'

// ** Shared Components
import PageHeader from 'src/views/common/PageHeader'
import TablePrinter from 'src/views/settings/printer/TablePrinter'

export default function SettingPrinter() {
  return (
    <Grid container>
      <Grid item xs={12}>
        <PageHeader
          title='Daftar Printer'
          breadcrumbs={[{ label: 'Users & Permissions' }, { label: 'Printer Setting' }]}
        />
        <TablePrinter />
      </Grid>
    </Grid>
  )
}
