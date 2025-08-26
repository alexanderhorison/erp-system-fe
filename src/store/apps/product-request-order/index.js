import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'src/configs/axios'
import { swalConfirmationAdd, swalToastError } from 'src/helpers/swalFunction'

const label = 'PRODUCT REQUEST ORDER'

// GET ALL PRODUCT REQUEST ORDER
export const fetchAllRequestOrder = createAsyncThunk('productRequestOrder/fetchAllProductRequestOrder', async (params, { rejectWithValue }) => {
  try {
    const response = await axios({
      method: 'GET',
      url: '/product-request-order/all',
      params,
    })
    return response.data
  } catch (error) {
    swalToastError({ label, error })
    return rejectWithValue([])
  }
})

// CREATE PRODUCT REQUEST ORDER
export const createRequestOrder = createAsyncThunk(
  'productRequestOrder/createRequestOrder',
  async (data, { dispatch, rejectWithValue }) => {
    try {
      await swalConfirmationAdd({
        label: label,
        name: 'Surat',
        title: 'Anda akan membuat surat Product Request?',
        axiosRequest: () => {
          return axios({
            method: 'POST',
            url: '/product-request-order/create',
            data
          })
        },
        dispatchRequest: () => {
          return dispatch(fetchAllRequestOrder())
        }
      })
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
      await swalConfirmationAdd({
        label: label,
        name: 'Product Request',
        title: 'Anda akan edit Product Request?',
        axiosRequest: () => {
          return axios({
            method: 'PUT',
            url: '/product-request-order/' + code,
            data
          })
        },
        dispatchRequest: () => {
          return dispatch(fetchAllRequestOrder())
        }
      })
    } catch (error) {
      return rejectWithValue({})
    }
  }
)

// TERIMA / TOLAK PRODUCT REQUEST ORDER
export const updateRequestOrder = createAsyncThunk(
  'productRequestOrder/updateRequestOrder',
  async ({ code, type, router }, { dispatch, rejectWithValue }) => {
    try {
      await swalConfirmationAdd({
        label,
        name: 'Surat',
        title: type == 'approve' ? 'Anda akan menerima Product Request?' : 'Anda akan tolak Product Request?',
        axiosRequest: () => {
          return axios({
            method: 'POST',
            // TYPE (approve/reject)
            // CODE (PRODUCT REQUEST ORDER code)
            url: `/product-request-order/${type}/${code}`
          })
        },
      })
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue({})
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

    listProductRequestOrder: [],
    loadingListProductRequestOrder: false,
    errorListProductRequestOrder: false,

    dataRequestOrderCustomer: [],
    loadingDataRequestOrderCustomer: true,
    errorDataRequestOrderCustomer: false
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
  }
})

export default appMasterProductSlice.reducer
