import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'src/configs/axios'
import { swalToastError } from 'src/helpers/swalFunction'

const label = 'Dashboard'

// 1.⁠ ⁠Daftar barang habis
// 2.⁠ ⁠TOP 5 barang tidak bergerak  (Tambahkan Config Get data Days)
// 3.⁠ ⁠Top 5 barang gerak cepat
// 4.⁠ ⁠TOP 5 barang dengan quantity terbanyak (API berubah ngambil data dari suatu unit limit 5 data) Fetch semua Unit (total 25 data)
// 5.⁠ ⁠Statistik total quantity per unit (API ada Perubahan)
// 6. Statistik jumlah surat (API ada perubahan)
// 7. Statistik jumla surat pending (api ada perubahan)
// 8. Dashboard Banyak Produk Hilang di Outstanding
// 9. Dashboard Banyak Quantity Hilang di Outstanding
// ======================================================================
// 1. DashboardBarangHabis.js
// 2. DashboardBarangTidakBergerak.js
// 3. DashboardBarangCepat.js
// 4. DashboardBarangQuantityTerbanyak.js
// 5. DashboardTotalQuantityPerUnit.js
// 6. DashboardJumlahSurat.js
// 7. DashboardJumlahSuratPending.js
// 8. DashboardProductBanyakHilang.js
// 9. DashboardProductQuantityBanyakHilang.js

// ========= GABUNG DENGAN SUMMARY CUSTOMER =============
// 1. Summary Customer

// 1. DashboardBarangHabis.js
export const fetchDashboardBarangHabis = createAsyncThunk(
  'appDashboard/fetchDashboardBarangHabis',
  async ({ query }, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/dashboard/minimum-stock',
        params: query
      })
      return { data: response.data.data, totalCount: response.data.meta?.totalCount ?? 0 }
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue({ data: [], totalCount: 0 })
    }
  }
)

// 2. DashboardBarangTidakBergerak.js
export const fetchDashboardBarangTidakBergerak = createAsyncThunk(
  'appDashboard/fetchDashboardBarangTidakBergerak',
  async ({ query }, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/dashboard/slow-stock',
        params: query
      })
      return { data: response.data.data, totalCount: response.data.meta?.totalCount ?? 0 }
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue({ data: [], totalCount: 0 })
    }
  }
)

// 3. DashboardBarangCepat.js
export const fetchDashboardBarangCepat = createAsyncThunk(
  'appDashboard/fetchDashboardBarangCepat',
  async ({ query }, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/dashboard/fast-stock',
        params: query
      })
      return response.data.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

// 4. DashboardBarangQuantityTerbanyak.js
export const fetchDashboardBarangQuantityTerbanyak = createAsyncThunk(
  'appDashboard/fetchDashboardBarangQuantityTerbanyak',
  async ({ query, unitId }, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/dashboard/max-quantity-by-unit',
        params: {
          ...query,
          unitId
        }
      })
      return response.data.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

// 5. DashboardTotalQuantityPerUnit.js
export const fetchDashboardTotalQuantityPerUnit = createAsyncThunk(
  'appDashboard/fetchDashboardTotalQuantityPerUnit',
  async ({ query }, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/dashboard/total-product-in-warehouse',
        params: query
      })
      return response.data.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

// 6. DashboardJumlahSurat.js
export const fetchDashboardJumlahSurat = createAsyncThunk(
  'appDashboard/fetchDashboardJumlahSurat',
  async ({ query }, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/dashboard/total-surat',
        params: query
      })
      return response.data.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

// 7. DashboardJumlahSuratPending.js
export const fetchDashboardJumlahSuratPending = createAsyncThunk(
  'appDashboard/fetchDashboardJumlahSuratPending',
  async ({ query }, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/dashboard/total-surat-pending',
        params: query
      })

      return response.data.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

// 8. DashboardProductBanyakHilang.js
export const fetchDashboardProductBanyakHilang = createAsyncThunk(
  'appDashboard/fetchDashboardProductBanyakHilang',
  async ({ query }, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/dashboard/most-lost-product-outstanding',
        params: query
      })
      return response.data.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

// 9. DashboardProductQuantityBanyakHilang.js
export const fetchDashboardProductQuantityBanyakHilang = createAsyncThunk(
  'appDashboard/fetchDashboardProductQuantityBanyakHilang',
  async ({ query }, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/dashboard/most-lost-quantity-product-outstanding',
        params: query
      })
      return response.data.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

// SUMMARY CUSTOMER
export const fetchDashboardSummaryCustomer = createAsyncThunk(
  'appDashboard/fetchDashboardSummaryCustomer',
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/dashboard/summary-customer/' + id
      })
      return response.data.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

export const fetchDashboardSummaryVendor = createAsyncThunk(
  'appDashboard/fetchDashboardSummaryVendor',
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/dashboard/summary-vendor/' + id
      })
      return response.data.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

// DASHBOARD SALES ORDER 1 - 4
export const fetchDashboardSalesOrder = createAsyncThunk(
  'appDashboard/fetchDashboardSalesOrder',
  async ({ query }, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/dashboard/sales-order/so1'
      })
      return response?.data?.data || {}
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

// DASHBOARD SALES ORDER OVER DUE DATE
export const fetchDashboardSalesOrderOverDueDate = createAsyncThunk(
  'appDashboard/fetchDashboardSalesOrderOverDueDate',
  async (query, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/dashboard/sales-order/so6',
        params: query
      })

      return response.data.data
    } catch (error) {
      swalToastError({ label, error })
    }
  }
)

// DASHBOARD COUNT SO - LUNAS & BELUM LUNAS
export const dashboardCountSo = createAsyncThunk('appDashboard/dashboardCountSo', async (_, { rejectWithValue }) => {
  try {
    const response = await axios({
      method: 'GET',
      url: '/dashboard/sales-order/menu'
    })

    return response.data.data
  } catch (error) {
    swalToastError({ label, error })
    return rejectWithValue({ countPaid: 0, countDebt: 0 })
  }
})

// DASHBOARD SALES ORDER 1 - 4
export const fetchDashboardPurchaseOrder = createAsyncThunk(
  'appDashboard/fetchDashboardPurchaseOrder',
  async ({ query }, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/dashboard/purchase-order/po1'
      })

      return response?.data?.data || {}
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

// DASHBOARD SALES ORDER OVER DUE DATE
export const fetchDashboardPurchaseOrderOverDueDate = createAsyncThunk(
  'appDashboard/fetchDashboardPurchaseOrderOverDueDate',
  async (query, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/dashboard/purchase-order/po6',
        params: query
      })

      return response.data.data
    } catch (error) {
      swalToastError({ label, error })
    }
  }
)

// DASHBOARD COUNT PO - LUNAS & BELUM LUNAS
export const dashboardCountPo = createAsyncThunk('appDashboard/dashboardCountPo', async (_, { rejectWithValue }) => {
  try {
    const response = await axios({
      method: 'GET',
      url: '/dashboard/purchase-order/menu'
    })

    return response.data.data
  } catch (error) {
    swalToastError({ label, error })
    return rejectWithValue({ countPaid: 0, countDebt: 0 })
  }
})

export const fetchDashboardFinanceRevenue = createAsyncThunk(
  'appDashboard/fetchDashboardFinanceRevenue',
  async (query, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/dashboard/finance/revenue',
        params: query
      })

      return response.data.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

export const fetchDashboardFinanceProfitLoss = createAsyncThunk(
  'appDashboard/fetchDashboardFinanceProfitLoss',
  async (query, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/dashboard/finance/profit-loss',
        params: query
      })

      return response.data.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

export const fetchDashboardFinanceProfitLossYearly = createAsyncThunk(
  'appDashboard/fetchDashboardFinanceProfitLossYearly',
  async (query, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/dashboard/finance/profit-loss-yearly',
        params: query
      })
      return response.data.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

// REDUCER DASHBOARD
export const appMasterRankSlice = createSlice({
  name: 'appDashboard',
  initialState: {
    // 1
    dataDashboardBarangHabis: [],
    totalCountDashboardBarangHabis: 0,
    loadingDashboardBarangHabis: false,
    errorDashboardBarangHabis: false,
    // 2
    dataDashboardBarangTidakBergerak: [],
    totalCountDashboardBarangTidakBergerak: 0,
    loadingDashboardBarangTidakBergerak: false,
    errorDashboardBarangTidakBergerak: false,
    // 3
    dataDashboardBarangCepat: [],
    loadingDashboardBarangCepat: false,
    errorDashboardBarangCepat: false,
    // 4
    dataDashboardBarangQuantityTerbanyak: [],
    loadingDashboardBarangQuantityTerbanyak: false,
    errorDashboardBarangQuantityTerbanyak: false,
    // 5
    dataDashboardTotalQuantityPerUnit: [],
    loadingDashboardTotalQuantityPerUnit: false,
    errorDashboardTotalQuantityPerUnit: false,
    // 6
    dataDashboardJumlahSurat: [],
    loadingDashboardJumlahSurat: false,
    errorDashboardJumlahSurat: false,
    // 7
    dataDashboardJumlahSuratPending: [],
    loadingDashboardJumlahSuratPending: false,
    errorDashboardJumlahSuratPending: false,
    // 8
    dataDashboardProductBanyakHilang: [],
    loadingDashboardProductBanyakHilang: false,
    errorDashboardProductBanyakHilang: false,
    // 9
    dataDashboardProductQuantityBanyakHilang: [],
    loadingDashboardProductQuantityBanyakHilang: false,
    errorDashboardProductQuantityBanyakHilang: false,

    // DASHBOARD SUMMARY CUSTOMER
    dataDashboardSummaryCustomer: [],
    loadingDashboardSummaryCustomer: false,
    errorDashboardSummaryCustomer: false,

    // DASHBOARD SUMMARY VENDOR
    dataDashboardSummaryVendor: [],
    loadingDashboardSummaryVendor: false,
    errorDashboardSummaryVendor: false,

    // DASHBOARD SALES ORDER
    dataDashboardSalesOrder: {
      dashboard1: [],
      dashboard2: [],
      dashboard3: [],
      dashboard4: []
    },
    loadingDashboardSalesOrder: false,
    errorDashboardSalesOrder: false,
    // OVER DUE DATE SO
    dataDashboardSalesOrderOverDueDate: {
      data: [],
      totalPage: 0,
      totalData: 0
    },
    loadingDashboardSalesOrderOverDueDate: false,
    errorDashboardSalesOrderOverDueDate: false,
    // DASHBOARD COUNT SO - LUNAS & BELUM LUNAS
    dataDashboardCountSo: {
      countPaid: 0,
      countDebt: 0
    },
    loadingDashboardCountSo: false,
    errorDashboardCountSo: false,

    // DASHBOARD PURCHASE ORDER
    dataDashboardPurchaseOrder: {
      dashboard1: [],
      dashboard2: [],
      dashboard3: [],
      dashboard4: []
    },
    loadingDashboardPurchaseOrder: false,
    errorDashboardPurchaseOrder: false,
    // OVER DUE DATE PO
    dataDashboardPurchaseOrderOverDueDate: {
      data: [],
      totalPage: 0
    },
    loadingDashboardPurchaseOrderOverDueDate: false,
    errorDashboardPurchaseOrderOverDueDate: false,
    // DASHBOARD COUNT PO - LUNAS & BELUM LUNAS
    dataDashboardCountPo: {
      countPaid: 0,
      countDebt: 0
    },
    loadingDashboardCountPo: false,
    errorDashboardCountPo: false,

    // DASHBOARD FINANCE
    dataDashboardFinanceRevenue: [],
    loadingDashboardFinanceRevenue: false,
    errorDashboardFinanceRevenue: false,

    dataDashboardFinanceProfitLoss: [],
    loadingDashboardFinanceProfitLoss: false,
    errorDashboardFinanceProfitLoss: false,

    dataDashboardFinanceProfitLossYearly: [],
    loadingDashboardFinanceProfitLossYearly: false,
    errorDashboardFinanceProfitLossYearly: false
  },
  reducers: {},
  extraReducers: builder => {
    builder
      // 1
      .addCase(fetchDashboardBarangHabis.fulfilled, (state, action) => {
        state.loadingDashboardBarangHabis = false
        state.dataDashboardBarangHabis = action.payload.data
        state.totalCountDashboardBarangHabis = action.payload.totalCount
      })
      .addCase(fetchDashboardBarangHabis.pending, (state, action) => {
        state.dataDashboardBarangHabis = []
        state.loadingDashboardBarangHabis = true
      })
      .addCase(fetchDashboardBarangHabis.rejected, (state, action) => {
        state.loadingDashboardBarangHabis = false
        state.errorDashboardBarangHabis = true
      })
      // 2
      .addCase(fetchDashboardBarangTidakBergerak.fulfilled, (state, action) => {
        state.loadingDashboardBarangTidakBergerak = false
        state.dataDashboardBarangTidakBergerak = action.payload.data
        state.totalCountDashboardBarangTidakBergerak = action.payload.totalCount
      })
      .addCase(fetchDashboardBarangTidakBergerak.pending, (state, action) => {
        state.dataDashboardBarangTidakBergerak = []
        state.loadingDashboardBarangTidakBergerak = true
      })
      .addCase(fetchDashboardBarangTidakBergerak.rejected, (state, action) => {
        state.loadingDashboardBarangTidakBergerak = false
        state.errorDashboardBarangTidakBergerak = true
      })
      // 3
      .addCase(fetchDashboardBarangCepat.fulfilled, (state, action) => {
        state.loadingDashboardBarangCepat = false
        state.dataDashboardBarangCepat = action.payload
      })
      .addCase(fetchDashboardBarangCepat.pending, (state, action) => {
        state.dataDashboardBarangCepat = []
        state.loadingDashboardBarangCepat = true
      })
      .addCase(fetchDashboardBarangCepat.rejected, (state, action) => {
        state.loadingDashboardBarangCepat = false
        state.errorDashboardBarangCepat = true
      })
      // 4
      .addCase(fetchDashboardBarangQuantityTerbanyak.fulfilled, (state, action) => {
        state.loadingDashboardBarangQuantityTerbanyak = false
        state.dataDashboardBarangQuantityTerbanyak = action.payload
      })
      .addCase(fetchDashboardBarangQuantityTerbanyak.pending, (state, action) => {
        state.dataDashboardBarangQuantityTerbanyak = []
        state.loadingDashboardBarangQuantityTerbanyak = true
      })
      .addCase(fetchDashboardBarangQuantityTerbanyak.rejected, (state, action) => {
        state.loadingDashboardBarangQuantityTerbanyak = false
        state.errorDashboardBarangQuantityTerbanyak = true
      })
      // 5
      .addCase(fetchDashboardTotalQuantityPerUnit.fulfilled, (state, action) => {
        state.loadingDashboardTotalQuantityPerUnit = false
        state.dataDashboardTotalQuantityPerUnit = action.payload
      })
      .addCase(fetchDashboardTotalQuantityPerUnit.pending, (state, action) => {
        state.dataDashboardTotalQuantityPerUnit = []
        state.loadingDashboardTotalQuantityPerUnit = true
      })
      .addCase(fetchDashboardTotalQuantityPerUnit.rejected, (state, action) => {
        state.loadingDashboardTotalQuantityPerUnit = false
        state.errorDashboardTotalQuantityPerUnit = true
      })
      // 6
      .addCase(fetchDashboardJumlahSurat.fulfilled, (state, action) => {
        state.loadingDashboardJumlahSurat = false
        state.dataDashboardJumlahSurat = action.payload
      })
      .addCase(fetchDashboardJumlahSurat.pending, (state, action) => {
        state.dataDashboardJumlahSurat = []
        state.loadingDashboardJumlahSurat = true
      })
      .addCase(fetchDashboardJumlahSurat.rejected, (state, action) => {
        state.loadingDashboardJumlahSurat = false
        state.errorDashboardJumlahSurat = true
      })
      // 7
      .addCase(fetchDashboardJumlahSuratPending.fulfilled, (state, action) => {
        state.loadingDashboardJumlahSuratPending = false
        state.dataDashboardJumlahSuratPending = action.payload
      })
      .addCase(fetchDashboardJumlahSuratPending.pending, (state, action) => {
        state.dataDashboardJumlahSuratPending = []
        state.loadingDashboardJumlahSuratPending = true
      })
      .addCase(fetchDashboardJumlahSuratPending.rejected, (state, action) => {
        state.loadingDashboardJumlahSuratPending = false
        state.errorDashboardJumlahSuratPending = true
      })
      // 8
      .addCase(fetchDashboardProductBanyakHilang.fulfilled, (state, action) => {
        state.loadingDashboardProductBanyakHilang = false
        state.dataDashboardProductBanyakHilang = action.payload
      })
      .addCase(fetchDashboardProductBanyakHilang.pending, (state, action) => {
        state.dataDashboardProductBanyakHilang = []
        state.loadingDashboardProductBanyakHilang = true
      })
      .addCase(fetchDashboardProductBanyakHilang.rejected, (state, action) => {
        state.loadingDashboardProductBanyakHilang = false
        state.errorDashboardProductBanyakHilang = true
      })
      // 9
      .addCase(fetchDashboardProductQuantityBanyakHilang.fulfilled, (state, action) => {
        state.loadingDashboardProductQuantityBanyakHilang = false
        state.dataDashboardProductQuantityBanyakHilang = action.payload
      })
      .addCase(fetchDashboardProductQuantityBanyakHilang.pending, (state, action) => {
        state.dataDashboardProductQuantityBanyakHilang = []
        state.loadingDashboardProductQuantityBanyakHilang = true
      })
      .addCase(fetchDashboardProductQuantityBanyakHilang.rejected, (state, action) => {
        state.loadingDashboardProductQuantityBanyakHilang = false
        state.errorDashboardProductQuantityBanyakHilang = true
      })
      // DATA DASHBOARD SUMMARY CUSTOMER
      .addCase(fetchDashboardSummaryCustomer.fulfilled, (state, action) => {
        state.loadingDashboardSummaryCustomer = false
        state.dataDashboardSummaryCustomer = action.payload
      })
      .addCase(fetchDashboardSummaryCustomer.pending, (state, action) => {
        state.dataDashboardSummaryCustomer = []
        state.loadingDashboardSummaryCustomer = true
      })
      .addCase(fetchDashboardSummaryCustomer.rejected, (state, action) => {
        state.loadingDashboardSummaryCustomer = false
        state.errorDashboardSummaryCustomer = true
      })
      // DATA DASHBOARD SUMMARY VENDOR
      .addCase(fetchDashboardSummaryVendor.fulfilled, (state, action) => {
        state.loadingDashboardSummaryVendor = false
        state.dataDashboardSummaryVendor = action.payload
      })
      .addCase(fetchDashboardSummaryVendor.pending, (state, action) => {
        state.dataDashboardSummaryVendor = []
        state.loadingDashboardSummaryVendor = true
      })
      .addCase(fetchDashboardSummaryVendor.rejected, (state, action) => {
        state.loadingDashboardSummaryVendor = false
        state.errorDashboardSummaryVendor = true
      })

      // DATA DASHBOARD SALES ORDER 1 - 4
      .addCase(fetchDashboardSalesOrder.pending, (state, action) => {
        state.loadingDashboardSalesOrder = true
      })
      .addCase(fetchDashboardSalesOrder.fulfilled, (state, action) => {
        state.loadingDashboardSalesOrder = false
        state.dataDashboardSalesOrder = action.payload
      })
      .addCase(fetchDashboardSalesOrder.rejected, (state, action) => {
        state.loadingDashboardSalesOrder = false
        state.errorDashboardSalesOrder = true
      })
      // DATA DASHBOARD SALES ORDER OVER DUE DATE
      .addCase(fetchDashboardSalesOrderOverDueDate.pending, (state, action) => {
        state.loadingDashboardSalesOrderOverDueDate = true
      })
      .addCase(fetchDashboardSalesOrderOverDueDate.fulfilled, (state, action) => {
        state.loadingDashboardSalesOrderOverDueDate = false
        state.dataDashboardSalesOrderOverDueDate = action.payload
      })
      .addCase(fetchDashboardSalesOrderOverDueDate.rejected, (state, action) => {
        state.loadingDashboardSalesOrderOverDueDate = false
        state.errorDashboardSalesOrderOverDueDate = true
      })
      // DATA DASHBOARD COUNT SO - LUNAS & BELUM LUNAS
      .addCase(dashboardCountSo.pending, (state, action) => {
        state.loadingDashboardCountSo = true
      })
      .addCase(dashboardCountSo.fulfilled, (state, action) => {
        state.loadingDashboardCountSo = false
        state.dataDashboardCountSo = action.payload
      })
      .addCase(dashboardCountSo.rejected, (state, action) => {
        state.loadingDashboardCountSo = false
        state.errorDashboardCountSo = true
      })

      // DATA DASHBOARD PURCHASE ORDER 1 - 4
      .addCase(fetchDashboardPurchaseOrder.pending, (state, action) => {
        state.loadingDashboardPurchaseOrder = true
      })
      .addCase(fetchDashboardPurchaseOrder.fulfilled, (state, action) => {
        state.loadingDashboardPurchaseOrder = false
        state.dataDashboardPurchaseOrder = action.payload
      })
      .addCase(fetchDashboardPurchaseOrder.rejected, (state, action) => {
        state.loadingDashboardPurchaseOrder = false
        state.errorDashboardPurchaseOrder = true
      })
      // DATA DASHBOARD PURCHASE ORDER OVER DUE DATE
      .addCase(fetchDashboardPurchaseOrderOverDueDate.pending, (state, action) => {
        state.dataDashboardPurchaseOrderOverDueDate = []
        state.loadingDashboardPurchaseOrderOverDueDate = true
      })
      .addCase(fetchDashboardPurchaseOrderOverDueDate.fulfilled, (state, action) => {
        state.loadingDashboardPurchaseOrderOverDueDate = false
        state.dataDashboardPurchaseOrderOverDueDate = action.payload
      })
      .addCase(fetchDashboardPurchaseOrderOverDueDate.rejected, (state, action) => {
        state.loadingDashboardPurchaseOrderOverDueDate = false
        state.errorDashboardPurchaseOrderOverDueDate = true
      })
      // DATA DASHBOARD COUNT PO - LUNAS & BELUM LUNAS
      .addCase(dashboardCountPo.pending, (state, action) => {
        state.loadingDashboardCountPo = true
      })
      .addCase(dashboardCountPo.fulfilled, (state, action) => {
        state.loadingDashboardCountPo = false
        state.dataDashboardCountPo = action.payload
      })
      .addCase(dashboardCountPo.rejected, (state, action) => {
        state.loadingDashboardCountPo = false
        state.errorDashboardCountPo = true
      })

      // DATA DASHBOARD FINANCE REVENUE
      .addCase(fetchDashboardFinanceRevenue.pending, (state, action) => {
        state.loadingDashboardFinanceRevenue = true
      })
      .addCase(fetchDashboardFinanceRevenue.fulfilled, (state, action) => {
        state.loadingDashboardFinanceRevenue = false
        state.dataDashboardFinanceRevenue = action.payload
      })
      .addCase(fetchDashboardFinanceRevenue.rejected, (state, action) => {
        state.loadingDashboardFinanceRevenue = false
        state.errorDashboardFinanceRevenue = true
      })
      // DATA DASHBOARD FINANCE PROFIT LOSS
      .addCase(fetchDashboardFinanceProfitLoss.pending, (state, action) => {
        state.loadingDashboardFinanceProfitLoss = true
      })
      .addCase(fetchDashboardFinanceProfitLoss.fulfilled, (state, action) => {
        state.loadingDashboardFinanceProfitLoss = false
        state.dataDashboardFinanceProfitLoss = action.payload
      })
      .addCase(fetchDashboardFinanceProfitLoss.rejected, (state, action) => {
        state.loadingDashboardFinanceProfitLoss = false
        state.errorDashboardFinanceProfitLoss = true
      })
      // DATA DASHBOARD FINANCE PROFIT LOSS YEARLY
      .addCase(fetchDashboardFinanceProfitLossYearly.pending, (state, action) => {
        state.loadingDashboardFinanceProfitLossYearly = true
      })
      .addCase(fetchDashboardFinanceProfitLossYearly.fulfilled, (state, action) => {
        state.loadingDashboardFinanceProfitLossYearly = false
        state.dataDashboardFinanceProfitLossYearly = action.payload
      })
      .addCase(fetchDashboardFinanceProfitLossYearly.rejected, (state, action) => {
        state.loadingDashboardFinanceProfitLossYearly = false
        state.errorDashboardFinanceProfitLossYearly = true
      })
  }
})

export default appMasterRankSlice.reducer
