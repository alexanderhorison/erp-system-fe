import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'src/configs/axios'
import { swalConfirmationAdd, swalSuccess, swalToastError } from 'src/helpers/swalFunction'

const label = 'PRODUCT REQUEST ORDER'

// GET ALL PRODUCT REQUEST ORDER
export const fetchAllRequestOrder = createAsyncThunk(
  'productRequestOrder/fetchAllProductRequestOrder',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/product-request-order/all',
        params
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

// CREATE PRODUCT REQUEST ORDER
export const createRequestOrder = createAsyncThunk(
  'productRequestOrder/createRequestOrder',
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'POST',
        url: '/product-request-order/create',
        data
      })
      swalSuccess({ label, name: 'Product Request Order', response })
      dispatch(fetchAllRequestOrder())
      return
    } catch (error) {
      return rejectWithValue({})
    }
  }
)

// GET DETAIL PRODUCT REQUEST ORDER
export const fetchDetailRequestOrder = createAsyncThunk(
  'productRequestOrder/fetchDetailRequestOrder',
  async (code, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/product-request-order/' + code
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

// UPDATE FORM PRODUCT REQUEST ORDER
export const updateFormRequestOrder = createAsyncThunk(
  'productRequestOrder/updateFormRequestOrder',
  async ({ data, code, router }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'PUT',
        url: '/product-request-order/' + code,
        data
      })
      swalSuccess({ label, name: 'Product Request Order', response })
      dispatch(fetchAllRequestOrder())
      return
    } catch (error) {
      return rejectWithValue({})
    }
  }
)

// TERIMA / TOLAK PRODUCT REQUEST ORDER
export const updateRequestOrder = createAsyncThunk(
  'productRequestOrder/updateRequestOrder',
  async ({ code, type }, { dispatch, rejectWithValue }) => {
    try {
      await swalConfirmationAdd({
        label,
        name: 'Product Request',
        title: type == 'approve' ? 'Anda akan menerima Product Request?' : 'Anda akan tolak Product Request?',
        axiosRequest: () => {
          return axios({
            method: 'POST',
            // TYPE (approve/reject)
            // CODE (PRODUCT REQUEST ORDER code)
            url: `/product-request-order/${type}/${code}`
          })
        },
        dispatchRequest: () => {
          return dispatch(fetchAllRequestOrder())
        }
      })
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue({})
    }
  }
)

// PROCESS PRODUCT REQUEST ORDER
export const processRequestOrder = createAsyncThunk(
  'productRequestOrder/processRequestOrder',
  async ({ data, router }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'POST',
        url: '/product-request-order/process-request',
        data
      })
      dispatch(fetchAllRequestOrder())
      router.push(`/product-request`)
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

// GET DETAIL PRODUCT REQUEST ORDER
export const fetchDetailProcessRequestOrder = createAsyncThunk(
  'productRequestOrder/fetchDetailProcessRequestOrder',
  async (code, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/product-request-order/process-request/' + code
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

export const appMasterProductSlice = createSlice({
  name: 'productRequestOrder',
  initialState: {
    dataRequestOrder: [],
    loadingDataRequestOrder: true,
    errorDataRequestOrder: false,

    detailRequestOrder: {},
    loadingDetailRequestOrder: false,
    errorDetailRequestOrder: false,

    loadingUpdateRequestOrder: false,
    errorUpdateRequestOrder: false,

    loadingProcessRequestOrder: false,
    errorProcessRequestOrder: false,

    listProductRequestOrder: [],
    loadingListProductRequestOrder: false,
    errorListProductRequestOrder: false,

    dataRequestOrderCustomer: [],
    loadingDataRequestOrderCustomer: true,
    errorDataRequestOrderCustomer: false,

    detailProcessRequestOrder: {},
    loadingDetailProcessRequestOrder: false,
    errorDetailProcessRequestOrder: false
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchAllRequestOrder.pending, (state, action) => {
        state.loadingDataRequestOrder = true
      })
      .addCase(fetchAllRequestOrder.fulfilled, (state, action) => {
        state.dataRequestOrder = action.payload.data
        state.loadingDataRequestOrder = false
      })
      .addCase(fetchAllRequestOrder.rejected, (state, action) => {
        state.dataRequestOrder = []
        state.loadingDataRequestOrder = false
        state.errorDataRequestOrder = action.error.message
      })

      .addCase(fetchDetailRequestOrder.pending, (state, action) => {
        state.loadingDetailRequestOrder = true
      })
      .addCase(fetchDetailRequestOrder.fulfilled, (state, action) => {
        state.detailRequestOrder = action.payload.data
        state.loadingDetailRequestOrder = false
      })
      .addCase(fetchDetailRequestOrder.rejected, (state, action) => {
        state.detailRequestOrder = {}
        state.loadingDetailRequestOrder = false
        state.errorDetailRequestOrder = action.error.message
      })

      .addCase(updateRequestOrder.pending, (state, action) => {
        state.loadingUpdateRequestOrder = true
      })
      .addCase(updateRequestOrder.fulfilled, (state, action) => {
        state.loadingUpdateRequestOrder = false
      })
      .addCase(updateRequestOrder.rejected, (state, action) => {
        state.loadingUpdateRequestOrder = false
        state.errorUpdateRequestOrder = action.error.message
      })

      .addCase(processRequestOrder.pending, (state, action) => {
        state.loadingProcessRequestOrder = true
      })
      .addCase(processRequestOrder.fulfilled, (state, action) => {
        state.loadingProcessRequestOrder = false
      })
      .addCase(processRequestOrder.rejected, (state, action) => {
        state.loadingProcessRequestOrder = false
        state.errorProcessRequestOrder = action.error.message
      })

      .addCase(fetchDetailProcessRequestOrder.pending, (state, action) => {
        state.loadingDetailProcessRequestOrder = true
      })
      .addCase(fetchDetailProcessRequestOrder.fulfilled, (state, action) => {
        state.detailProcessRequestOrder = action.payload.data
        state.loadingDetailProcessRequestOrder = false
      })
      .addCase(fetchDetailProcessRequestOrder.rejected, (state, action) => {
        state.detailProcessRequestOrder = {}
        state.loadingDetailProcessRequestOrder = false
        state.errorDetailProcessRequestOrder = action.error.message
      })
  }
})

export default appMasterProductSlice.reducer
