// ** MUI Import
import Grid from '@mui/material/Grid'

// ** Custom Component Import
import KeenSliderWrapper from 'src/@core/styles/libs/keen-slider'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

import DashboardStatCard from 'src/views/dashboards/common/DashboardStatCard'
import DashboardSectionLabel from 'src/views/dashboards/common/DashboardSectionLabel'
import DashboardJumlahSurat from 'src/views/dashboards/inventory/DashboardJumlahSurat'
import DashboardBarangHabis from 'src/views/dashboards/inventory/DashboardBarangHabis'
import DashboardBarangQuantityTerbanyak from 'src/views/dashboards/inventory/DashboardBarangQuantityTerbanyak'
import DashboardJumlahSuratPending from 'src/views/dashboards/inventory/DashboardJumlahSuratPending'
import DashboardTotalQuantityPerUnit from 'src/views/dashboards/inventory/DashboardTotalQuantityPerUnit'
import DashboardBarangCepat from 'src/views/dashboards/inventory/DashboardBarangCepat'
import DashboardBarangTidakBergerak from 'src/views/dashboards/inventory/DashboardBarangTidakBergerak'
import DashboardBanyakProdukHilang from 'src/views/dashboards/inventory/DashboardBanyakProdukHilang'
import DashboardBanyakQuantityHilang from 'src/views/dashboards/inventory/DashboardBanyakQuantityHilang'

// ** Store
import { useSelector } from 'react-redux'

/**
 * CustomDashboard
 * -------------------------------------------------------------------------------------
 * "Dashboard - Inventory" (Figma). Four KPI tiles, then two labeled sections:
 * "Distribusi & Pergerakan Stok" (stock distribution + fast/slow/out-of-stock
 * lists) and "Produk & Dokumen" (top-quantity chart, document counts,
 * outstanding lists).
 */
export default function CustomDashboard({ query }) {
  const {
    totalCountDashboardBarangHabis,
    loadingDashboardBarangHabis,
    totalCountDashboardBarangTidakBergerak,
    loadingDashboardBarangTidakBergerak,
    dataDashboardJumlahSurat,
    loadingDashboardJumlahSurat,
    dataDashboardJumlahSuratPending,
    loadingDashboardJumlahSuratPending
  } = useSelector(state => state.dashboard)

  const totalSuratDibuat = dataDashboardJumlahSurat.reduce((sum, item) => sum + (item.value || 0), 0)
  const totalSuratPending = dataDashboardJumlahSuratPending.reduce((sum, item) => sum + (item.value || 0), 0)

  return (
    <ApexChartWrapper>
      <KeenSliderWrapper>
        <Grid container spacing={4}>
          {/* Stat cards */}
          <Grid item xs={12} sm={6} md={3}>
            <DashboardStatCard
              label='Barang Habis'
              value={totalCountDashboardBarangHabis}
              icon='tabler:alert-triangle'
              tone='danger'
              loading={loadingDashboardBarangHabis}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardStatCard
              label='Barang Slow Stock'
              value={totalCountDashboardBarangTidakBergerak}
              icon='tabler:arrow-right'
              tone='info'
              loading={loadingDashboardBarangTidakBergerak}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardStatCard
              label='Total Surat Dibuat'
              value={totalSuratDibuat}
              icon='tabler:file-text'
              tone='success'
              loading={loadingDashboardJumlahSurat}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardStatCard
              label='Surat Pending'
              value={totalSuratPending}
              icon='tabler:alert-triangle'
              tone='warning'
              loading={loadingDashboardJumlahSuratPending}
            />
          </Grid>

          {/* Distribusi & Pergerakan Stok */}
          <Grid item xs={12} sx={{ mt: 2 }}>
            <DashboardSectionLabel title='Distribusi & Pergerakan Stok' />
          </Grid>
          <Grid item xs={12} md={6}>
            <DashboardTotalQuantityPerUnit query={query} />
          </Grid>
          <Grid item xs={12} md={6}>
            <DashboardBarangHabis query={query} />
          </Grid>
          <Grid item xs={12} md={6}>
            <DashboardBarangTidakBergerak query={query} />
          </Grid>
          <Grid item xs={12} md={6}>
            <DashboardBarangCepat query={query} />
          </Grid>

          {/* Produk & Dokumen */}
          <Grid item xs={12} sx={{ mt: 2 }}>
            <DashboardSectionLabel title='Produk & Dokumen' />
          </Grid>
          <Grid item xs={12} md={6}>
            <DashboardBarangQuantityTerbanyak query={query} />
          </Grid>
          <Grid item xs={12} md={3}>
            <DashboardJumlahSurat query={query} />
          </Grid>
          <Grid item xs={12} md={3}>
            <DashboardJumlahSuratPending query={query} />
          </Grid>
          <Grid item xs={12} md={6}>
            <DashboardBanyakProdukHilang query={query} />
          </Grid>
          <Grid item xs={12} md={6}>
            <DashboardBanyakQuantityHilang query={query} />
          </Grid>
        </Grid>
      </KeenSliderWrapper>
    </ApexChartWrapper>
  )
}
