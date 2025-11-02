import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'src/configs/axios'
import { swalConfirmationAdd, swalNotifSuccess, swalSuccess, swalToastError } from 'src/helpers/swalFunction'

const label = 'Sales Order'

// GET ALL SALES ORDER
export const fetchAllSalesOrder = createAsyncThunk(
  'salesOrder/fetchAllSalesOrder',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/sales-order/',
        params
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

// CREATE SALES ORDER
export const createSalesOrder = createAsyncThunk(
  'salesOrder/createSalesOrder',
  async ({ data, router }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'POST',
        url: '/sales-order/create',
        data
      })
      swalSuccess({ label, name: 'Sales Order', response })
      router.push(`/sales-order`)
      return
    } catch (error) {
      return rejectWithValue({})
    }
  }
)

// GET DETAIL SALES ORDER
export const fetchDetailSalesOrder = createAsyncThunk(
  'salesOrder/fetchDetailSalesOrder',
  async (code, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/sales-order/' + code
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

// UPDATE FORM SALES ORDER
export const updateFormSalesOrder = createAsyncThunk(
  'salesOrder/updateFormSalesOrder',
  async ({ data, code, router }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'PUT',
        url: '/sales-order/' + code,
        data
      })
      swalSuccess({ label, name: 'Sales Order', response })
      router.push(`/sales-order`)
      return
    } catch (error) {
      return rejectWithValue({})
    }
  }
)

export const sendEmail = createAsyncThunk('salesOrder/sendEmail', async (formData, { rejectWithValue }) => {
  try {
    // Prepare form data
    const response = await axios({
      method: 'POST',
      url: '/send-email/',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data' // Set the correct header for file uploads
      }
    })
    swalNotifSuccess({ message: response?.data?.message })
  } catch (error) {
    swalToastError({ label, error })
    return rejectWithValue([])
  }
})

// TERIMA / TOLAK SALES ORDER
export const updateSalesOrder = createAsyncThunk(
  'salesOrder/updateSalesOrder',
  async ({ code, type, router }, { dispatch, rejectWithValue }) => {
    try {
      await swalConfirmationAdd({
        label,
        name: 'Surat',
        title: type == 'approve' ? 'Anda akan menerima sales order?' : 'Anda akan tolak sales order?',
        axiosRequest: fullPayment => {
          return axios({
            method: 'POST',
            // TYPE (approve/reject)
            // CODE (sales order code)
            url: `/sales-order/${type}/${code}`,
            data: type === 'approve' ? { fullPayment } : {}
          })
        },
        dispatchRequest: () => {
          router.push('/sales-order')
        },
        paymentSelection: type === 'approve'
      })
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue({})
    }
  }
)

// GET LIST MASTER PRODUCT SALES ORDER
export const fetchListProductSalesOrder = createAsyncThunk(
  'appProductWarehouse/fetchListProductSalesOrder',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/product-warehouse/warehouse/' + id + '/list-product-sales-order'
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return error
    }
  }
)

// GET ALL SALES ORDER CUSTOMER
export const fetchAllSalesOrderCustomer = createAsyncThunk(
  'salesOrder/fetchAllSalesOrderCustomer',
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/sales-order/customer/' + id
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

export const appMasterProductSlice = createSlice({
  name: 'salesOrder',
  initialState: {
    dataSalesOrder: [],
    paginationSalesOrder: {
      total: 0,
      page: 1,
      limit: 25,
      totalPage: 0
    },
    loadingDataSalesOrder: true,
    errorDataSalesOrder: false,

    detailSalesOrder: {},
    loadingDetailSalesOrder: false,
    errorDetailSalesOrder: false,

    loadingUpdateSalesOrder: false,
    errorUpdateSalesOrder: false,

    listProductSalesOrder: [],
    loadingListProductSalesOrder: false,
    errorListProductSalesOrder: false,

    dataSalesOrderCustomer: [],
    loadingDataSalesOrderCustomer: true,
    errorDataSalesOrderCustomer: false,

    loadingCreateSalesOrder: false
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(createSalesOrder.pending, (state, action) => {
        state.loadingCreateSalesOrder = true
      })
      .addCase(createSalesOrder.fulfilled, (state, action) => {
        state.loadingCreateSalesOrder = false
      })
      .addCase(createSalesOrder.rejected, (state, action) => {
        state.loadingCreateSalesOrder = false
      })

      .addCase(fetchAllSalesOrder.pending, (state, action) => {
        state.loadingDataSalesOrder = true
      })
      .addCase(fetchAllSalesOrder.fulfilled, (state, action) => {
        state.dataSalesOrder = action.payload.data
        state.paginationSalesOrder = action.payload.pagination || {
          total: action.payload.data?.length || 0,
          page: 1,
          limit: 25,
          totalPage: 1
        }
        state.loadingDataSalesOrder = false
      })
      .addCase(fetchAllSalesOrder.rejected, (state, action) => {
        state.dataSalesOrder = []
        state.paginationSalesOrder = {
          total: 0,
          page: 1,
          limit: 25,
          totalPage: 0
        }
        state.loadingDataSalesOrder = false
        state.errorDataSalesOrder = action.error.message
      })

      .addCase(fetchDetailSalesOrder.pending, (state, action) => {
        state.loadingDetailSalesOrder = true
      })
      .addCase(fetchDetailSalesOrder.fulfilled, (state, action) => {
        state.detailSalesOrder = action.payload.data
        state.loadingDetailSalesOrder = false
      })
      .addCase(fetchDetailSalesOrder.rejected, (state, action) => {
        state.detailSalesOrder = {}
        state.loadingDetailSalesOrder = false
        state.errorDetailSalesOrder = action.error.message
      })

      .addCase(updateSalesOrder.pending, (state, action) => {
        state.loadingUpdateSalesOrder = true
      })
      .addCase(updateSalesOrder.fulfilled, (state, action) => {
        state.loadingUpdateSalesOrder = false
      })
      .addCase(updateSalesOrder.rejected, (state, action) => {
        state.loadingUpdateSalesOrder = false
        state.errorUpdateSalesOrder = action.error.message
      })

      .addCase(fetchListProductSalesOrder.pending, (state, action) => {
        state.loadingListProductSalesOrder = true
      })
      .addCase(fetchListProductSalesOrder.fulfilled, (state, action) => {
        state.listProductSalesOrder = action.payload.data
        state.loadingListProductSalesOrder = false
      })
      .addCase(fetchListProductSalesOrder.rejected, (state, action) => {
        state.listProductSalesOrder = []
        state.loadingListProductSalesOrder = false
        state.errorListProductSalesOrder = action.error.message
      })

      .addCase(fetchAllSalesOrderCustomer.pending, (state, action) => {
        state.loadingDataSalesOrderCustomer = true
      })
      .addCase(fetchAllSalesOrderCustomer.fulfilled, (state, action) => {
        state.dataSalesOrderCustomer = action.payload.data
        state.loadingDataSalesOrderCustomer = false
      })
      .addCase(fetchAllSalesOrderCustomer.rejected, (state, action) => {
        state.dataSalesOrderCustomer = []
        state.loadingDataSalesOrderCustomer = false
        state.errorDataSalesOrderCustomer = action.error.message
      })
  }
})

export default appMasterProductSlice.reducer
