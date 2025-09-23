import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'src/configs/axios'
import { swalConfirmationAdd, swalSuccess, swalToastError } from 'src/helpers/swalFunction'

const label = 'Penerimaan Surat Jalan'

export const updateReceiveOrder = createAsyncThunk(
  'deliveryOrderReceive/updateReceiveOrder',
  async ({ deliveryOrderId, router }, { dispatch, rejectWithValue }) => {
    try {
      const response = await swalConfirmationAdd({
        label,
        name: 'Surat',
        title: 'Anda akan menerima surat jalan?',
        axiosRequest: () => {
          return axios({
            method: 'PUT',
            url: '/delivery-order-receive/' + deliveryOrderId
          })
        },
        dispatchRequest: () => {
          router.push('/receive-order')
        }
      })
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue({})
    }
  }
)

export const fetchDetailReceiveOrder = createAsyncThunk(
  'deliveryOrderReceive/fetchDetailDeliveryOrderReceive',
  async (deliveryOrderReceiveId, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/delivery-order-receive/' + deliveryOrderReceiveId
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

export const fetchAllReceiveOrder = createAsyncThunk(
  'deliveryOrderReceive/fetchAllReceiveOrder',
  async (warehouseId, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/delivery-order-receive/all'
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

// CREATE DELIVERY ORDER RECEIVE
export const createDeliveryOrderReceive = createAsyncThunk(
  'deliveryOrderReceive/createDeliveryOrderReceive',
  async ({ data, router }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'POST',
        url: '/delivery-order-receive/create',
        data
      })
      swalSuccess({ label, name: 'Penerimaan Surat Jalan', response })
      router.push(`/receive-order/`)
      return
    } catch (error) {
      return rejectWithValue({})
    }
  }
)

export const ReceiveOrderSlice = createSlice({
  name: 'deliveryOrderReceive',
  initialState: {
    loadingUpdateReceiveOrder: true,
    errorUpdateReceiveOrder: false,

    detailReceiveOrder: {},
    loadingDetailReceiveOrder: true,
    errorDetailReceiveOrder: false,

    loadingDataListOrderReceive: false,
    dataListOrderReceive: [],
    errorDataListOrderReceive: false
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(updateReceiveOrder.pending, (state, action) => {
        state.loadingUpdateReceiveOrder = true
      })
      .addCase(updateReceiveOrder.fulfilled, (state, action) => {
        state.loadingUpdateReceiveOrder = false
      })
      .addCase(updateReceiveOrder.rejected, (state, action) => {
        state.loadingUpdateReceiveOrder = false
        state.errorUpdateReceiveOrder = action.error.message
      })

      .addCase(fetchDetailReceiveOrder.pending, (state, action) => {
        state.loadingDetailReceiveOrder = true
      })
      .addCase(fetchDetailReceiveOrder.fulfilled, (state, action) => {
        state.detailReceiveOrder = action.payload.data
        state.loadingDetailReceiveOrder = false
      })
      .addCase(fetchDetailReceiveOrder.rejected, (state, action) => {
        state.detailReceiveOrder = {}
        state.loadingDetailReceiveOrder = false
        state.errorDetailReceiveOrder = action.error.message
      })

      .addCase(fetchAllReceiveOrder.pending, (state, action) => {
        state.loadingDataListOrderReceive = true
      })
      .addCase(fetchAllReceiveOrder.fulfilled, (state, action) => {
        state.dataListOrderReceive = action.payload.data
        state.loadingDataListOrderReceive = false
      })
      .addCase(fetchAllReceiveOrder.rejected, (state, action) => {
        state.dataListOrderReceive = []
        state.loadingDataListOrderReceive = false
        state.errorDataListOrderReceive = action.error.message
      })
  }
})

export default ReceiveOrderSlice.reducer
