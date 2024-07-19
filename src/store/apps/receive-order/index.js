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
  async (deliveryOrderId, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/delivery-order/' + deliveryOrderId,
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
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
  }
})

export default ReceiveOrderSlice.reducer
