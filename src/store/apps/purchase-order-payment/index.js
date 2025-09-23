import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'src/configs/axios'
import { swalConfirmationAdd, swalSuccess, swalToastError } from 'src/helpers/swalFunction'
import { fetchDetailPurchaseOrder } from '../purchase-order'

const label = 'Purchase Order Payment'

// GET ALL PURCHASE ORDER PAYMENT
export const fetchAllPurchaseOrderPayment = createAsyncThunk(
  'purchaseOrderPayment/fetchAllPurchaseOrderPayment',
  async (purchaseOrderId, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: `/purchase-order/payment/${purchaseOrderId}`
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

// CREATE PURCHASE ORDER PAYMENT
export const createPurchaseOrderPayment = createAsyncThunk(
  'purchaseOrderPayment/createPurchaseOrderPayment',
  async ({ data, purchaseOrderCode }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'POST',
        url: '/purchase-order/payment/create',
        data: data
      })
      swalSuccess({ label, name: 'Purchase Order Payment', response })
      dispatch(fetchDetailPurchaseOrder(purchaseOrderCode))
      return
    } catch (error) {
      return rejectWithValue({})
    }
  }
)

export const resetPurchaseOrderPayments = createAsyncThunk(async () => {
  return
})

export const appMasterProductSlice = createSlice({
  name: 'purchaseOrderPayment',
  initialState: {
    dataPurchaseOrderPayment: [],
    loadingDataPurchaseOrderPayment: true,
    errorDataPurchaseOrderPayment: false,

    defaultValue: {
      typePayment: '',
      amount: 0,
      notes: '',
      purchaseOrderId: ''
    },
    dataTypePayment: [
      { id: 1, value: 'TRANSFER', name: 'TRANSFER' },
      { id: 2, value: 'CASH', name: 'CASH' },
      { id: 3, value: 'GIRO', name: 'GIRO' }
    ]
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchAllPurchaseOrderPayment.pending, (state, action) => {
        state.loadingDataPurchaseOrderPayment = true
      })
      .addCase(fetchAllPurchaseOrderPayment.fulfilled, (state, action) => {
        state.dataPurchaseOrderPayment = action.payload.data
        state.loadingDataPurchaseOrderPayment = false
      })
      .addCase(fetchAllPurchaseOrderPayment.rejected, (state, action) => {
        state.dataPurchaseOrderPayment = []
        state.loadingDataPurchaseOrderPayment = false
        state.errorDataPurchaseOrderPayment = action.error.message
      })
      .addCase(resetPurchaseOrderPayments.fulfilled, state => {
        state.dataPurchaseOrderPayment = []
      })
  }
})

export default appMasterProductSlice.reducer
