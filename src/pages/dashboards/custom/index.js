// ** MUI Import
import Grid from '@mui/material/Grid'
// ** Custom Component Import
import KeenSliderWrapper from 'src/@core/styles/libs/keen-slider'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import DashboardJumlahSurat from 'src/views/dashboards/custom/DashboardJumlahSurat'
import DashboardBarangHabis from 'src/views/dashboards/custom/DashboardBarangHabis'
import DashboardBarangQuantityTerbanyak from 'src/views/dashboards/custom/DashboardBarangQuantityTerbanyak'
import DashboardJumlahSuratPending from 'src/views/dashboards/custom/DashboardJumlahSuratPending'
import DashboardTotalQuantityPerUnit from 'src/views/dashboards/custom/DashboardTotalQuantityPerUnit'
import DashboardBarangCepat from 'src/views/dashboards/custom/DashboardBarangCepat'
import DashboardBarangTidakBergerak from 'src/views/dashboards/custom/DashboardBarangTidakBergerak'
import DashboardBanyakProdukHilang from 'src/views/dashboards/custom/DashboardBanyakProdukHilang'
import DashboardBanyakQuantityHilang from 'src/views/dashboards/custom/DashboardBanyakQuantityHilang'

// 1. DashboardBarangHabis.js
// 2. DashboardBarangTidakBergerak.js
// 3. DashboardBarangCepat.js
// 4. DashboardBarangQuantityTerbanyak.js
// 5. DashboardTotalQuantityPerUnit.js
// 6. DashboardJumlahSurat.js
// 7. DashboardJumlahSuratPending.js
// 8. DashboardBanyakProdukHilang.js
// 9. DashboardBanyakQuantityHilang.js

export default function CustomDashboard({ query }) {
  return (
    <ApexChartWrapper>
      <KeenSliderWrapper>
        <Grid container spacing={6}>
          {/* 1. DashboardBarangHabis*/}
          <Grid item xs={12} sm={6} order={1}>
            <DashboardBarangHabis query={query} />
          </Grid>
          {/* 2. DashboardBarangTidakBergerak*/}
          <Grid item xs={12} sm={6} order={2}>
            <DashboardBarangTidakBergerak query={query} />
          </Grid>
          {/* 3. DashboardBarangCepat*/}
          <Grid item xs={12} sm={6} order={2}>
            <DashboardBarangCepat query={query} />
          </Grid>
          {/* 4. DashboardBarangQuantityTerbanyak*/}
          <Grid item xs={12} sm={6} order={2}>
            <DashboardBarangQuantityTerbanyak query={query} />
          </Grid>
          {/* 5. DashboardTotalQuantityPerUnit*/}
          <Grid item xs={12} sm={6} order={0}>
            <DashboardTotalQuantityPerUnit query={query} />
          </Grid>
          {/* 6. DashboardJumlahSurat*/}
          <Grid item xs={12} sm={3} order={2}>
            <DashboardJumlahSurat query={query} />
          </Grid>
          {/* 7. DashboardJumlahSuratPending*/}
          <Grid item xs={12} sm={3} order={2}>
            <DashboardJumlahSuratPending query={query} />
          </Grid>
          {/* 8. DashboardBanyakProdukHilang*/}
          <Grid item xs={12} sm={6} order={2}>
            <DashboardBanyakProdukHilang query={query} />
          </Grid>
          {/* 9. DashboardBanyakQuantityHilang*/}
          <Grid item xs={12} sm={6} order={2}>
            <DashboardBanyakQuantityHilang query={query} />
          </Grid>
        </Grid>
      </KeenSliderWrapper>
    </ApexChartWrapper>
  )
}