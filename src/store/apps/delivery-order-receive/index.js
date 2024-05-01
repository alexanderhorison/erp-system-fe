import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { useRouter } from 'next/router'
import axios from 'src/configs/axios'
import { swalSuccess, swalToastError } from 'src/helpers/swalFunction'

const label = 'Penerimaan Surat Jalan'

export const updateDeliveryOrderReceive = createAsyncThunk(
  'deliveryOrderReceive/updateDeliveryOrderReceive',
  async ({ deliveryOrderId }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'PUT',
        url: '/delivery-order-receive/' + deliveryOrderId
      })
      swalSuccess({ label, name: 'Penerimaan Surat Jalan', response })
      const router = useRouter()
      router.push('/delivery-order-receive')
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
