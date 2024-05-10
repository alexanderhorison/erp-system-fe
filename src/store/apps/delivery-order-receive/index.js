import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'src/configs/axios'
import { swalConfirmationAdd, swalSuccess, swalToastError } from 'src/helpers/swalFunction'

const label = 'Penerimaan Surat Jalan'

export const updateDeliveryOrderReceive = createAsyncThunk(
  'deliveryOrderReceive/updateDeliveryOrderReceive',
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
          router.push('/delivery-order-receive')
        }
      })
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue({})
    }
  }
)

export const DeliveryProductSlice = createSlice({
  name: 'deliveryOrderReceive',
  initialState: {
    loadingUpdateDeliveryOrder: true,
    errorUpdateDeliveryOrder: false
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(updateDeliveryOrderReceive.pending, (state, action) => {
        state.loadingUpdateDeliveryOrder = true
      })
      .addCase(updateDeliveryOrderReceive.fulfilled, (state, action) => {
        state.loadingUpdateDeliveryOrder = false
      })
      .addCase(updateDeliveryOrderReceive.rejected, (state, action) => {
        state.loadingUpdateDeliveryOrder = false
        state.errorUpdateDeliveryOrder = action.error.message
      })
  }
})

export default DeliveryProductSlice.reducer
