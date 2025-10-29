import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'src/configs/axios'
import { swalConfirmationAdd, swalSuccess, swalToastError } from 'src/helpers/swalFunction'

const label = 'Purchase Order'

// GET ALL PURCHASE ORDER
export const fetchAllPurchaseOrder = createAsyncThunk(
  'purchaseOrder/fetchAllPurchaseOrder',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/purchase-order/',
        params
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

// CREATE PURCHASE ORDER
export const createPurchaseOrder = createAsyncThunk(
  'purchaseOrder/createPurchaseOrder',
  async ({ data, router }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'POST',
        url: '/purchase-order/create',
        data
      })
      swalSuccess({ label, name: 'Purchase Order', response })
      router.push(`/purchase-order`)
      return
    } catch (error) {
      return rejectWithValue({})
    }
  }
)

// GET DETAIL PURCHASE ORDER
export const fetchDetailPurchaseOrder = createAsyncThunk(
  'purchaseOrder/fetchDetailPurchaseOrder',
  async (code, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/purchase-order/' + code
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

// UPDATE FORM PURCHASE ORDER
export const updateFormPurchaseOrder = createAsyncThunk(
  'purchaseOrder/updateFormPurchaseOrder',
  async ({ data, code, router }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'PUT',
        url: '/purchase-order/' + code,
        data
      })
      swalSuccess({ label, name: 'Purchase Order', response })
      router.push(`/purchase-order`)
      return
    } catch (error) {
      return rejectWithValue({})
    }
  }
)

export const sendEmail = createAsyncThunk('purchaseOrder/sendEmail', async (formData, { rejectWithValue }) => {
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
    return response.data
  } catch (error) {
    swalToastError({ label, error })
    return rejectWithValue([])
  }
})

// TERIMA / TOLAK PURCHASE ORDER
export const updatePurchaseOrder = createAsyncThunk(
  'purchaseOrder/updatePurchaseOrder',
  async ({ code, type, router }, { dispatch, rejectWithValue }) => {
    try {
      await swalConfirmationAdd({
        label,
        name: 'Surat',
        title: type == 'approve' ? 'Anda akan menerima purchase order?' : 'Anda akan tolak purchase order?',
        axiosRequest: () => {
          return axios({
            method: 'POST',
            url: `/purchase-order/${type}/${code}`
          })
        },
        dispatchRequest: () => {
          router.push('/purchase-order')
        }
      })
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue({})
    }
  }
)

// GET LIST MASTER PRODUCT PURCHASE ORDER
// export const fetchListProductPurchaseOrderOrder = createAsyncThunk(
//   'appProductWarehouse/fetchListProductPurchaseOrderOrder',
//   async (id, { rejectWithValue }) => {
//     try {
//       const response = await axios({
//         method: 'GET',
//         url: '/product-warehouse/warehouse/' + id + '/list-product-purchase-order'
//       })
//       return response.data
//     } catch (error) {
//       swalToastError({ label, error })
//       return error
//     }
//   }
// )

// GET ALL PURCHASE ORDER VENDOR
export const fetchAllPurchaseOrderVendor = createAsyncThunk(
  'purchaseOrder/fetchAllPurchaseOrderVendor',
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/purchase-order/vendor/' + id
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

export const appMasterProductSlice = createSlice({
  name: 'purchaseOrder',
  initialState: {
    dataPurchaseOrder: [],
    paginationPurchaseOrder: {
      total: 0,
      page: 1,
      limit: 25,
      totalPage: 0
    },
    loadingDataPurchaseOrder: true,
    errorDataPurchaseOrder: false,

    detailPurchaseOrder: {},
    loadingDetailPurchaseOrder: false,
    errorDetailPurchaseOrder: false,

    loadingUpdatePurchaseOrder: false,
    errorUpdatePurchaseOrder: false,

    dataPurchaseOrderVendor: [],
    loadingDataPurchaseOrderVendor: true,
    errorDataPurchaseOrderVendor: false,

    loadingCreatePurchaseOrder: false
  },
  reducers: {},
  extraReducers: builder => {
    builder
     .addCase(createPurchaseOrder.pending, (state, action) => {
        state.loadingCreatePurchaseOrder = true
      })
      .addCase(createPurchaseOrder.fulfilled, (state, action) => {
        state.loadingCreatePurchaseOrder = false
      })
      .addCase(createPurchaseOrder.rejected, (state, action) => {
        state.loadingCreatePurchaseOrder = false
      })

      .addCase(fetchAllPurchaseOrder.pending, (state, action) => {
        state.loadingDataPurchaseOrder = true
      })
      .addCase(fetchAllPurchaseOrder.fulfilled, (state, action) => {
        state.dataPurchaseOrder = action.payload.data
        state.paginationPurchaseOrder = action.payload.pagination || {
          total: action.payload.data?.length || 0,
          page: 1,
          limit: 25,
          totalPage: 1
        }
        state.loadingDataPurchaseOrder = false
      })
      .addCase(fetchAllPurchaseOrder.rejected, (state, action) => {
        state.dataPurchaseOrder = []
        state.paginationPurchaseOrder = {
          total: 0,
          page: 1,
          limit: 25,
          totalPage: 0
        }
        state.loadingDataPurchaseOrder = false
        state.errorDataPurchaseOrder = action.error.message
      })

      .addCase(fetchDetailPurchaseOrder.pending, (state, action) => {
        state.loadingDetailPurchaseOrder = true
      })
      .addCase(fetchDetailPurchaseOrder.fulfilled, (state, action) => {
        state.detailPurchaseOrder = action.payload.data
        state.loadingDetailPurchaseOrder = false
      })
      .addCase(fetchDetailPurchaseOrder.rejected, (state, action) => {
        state.detailPurchaseOrder = {}
        state.loadingDetailPurchaseOrder = false
        state.errorDetailPurchaseOrder = action.error.message
      })

      .addCase(updatePurchaseOrder.pending, (state, action) => {
        state.loadingUpdatePurchaseOrder = true
      })
      .addCase(updatePurchaseOrder.fulfilled, (state, action) => {
        state.loadingUpdatePurchaseOrder = false
      })
      .addCase(updatePurchaseOrder.rejected, (state, action) => {
        state.loadingUpdatePurchaseOrder = false
        state.errorUpdatePurchaseOrder = action.error.message
      })
      .addCase(fetchAllPurchaseOrderVendor.pending, (state, action) => {
        state.loadingDataPurchaseOrderVendor = true
      })
      .addCase(fetchAllPurchaseOrderVendor.fulfilled, (state, action) => {
        state.dataPurchaseOrderVendor = action.payload.data
        state.loadingDataPurchaseOrderVendor = false
      })
      .addCase(fetchAllPurchaseOrderVendor.rejected, (state, action) => {
        state.dataPurchaseOrderVendor = []
        state.loadingDataPurchaseOrderVendor = false
        state.errorDataPurchaseOrderVendor = action.error.message
      })
  }
})

export default appMasterProductSlice.reducer
