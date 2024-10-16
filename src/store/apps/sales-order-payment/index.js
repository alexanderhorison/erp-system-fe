import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'src/configs/axios'
import { swalConfirmationAdd, swalToastError } from 'src/helpers/swalFunction'
import { fetchDetailSalesOrder } from '../sales-order'

const label = 'Sales Order Payment'

// GET ALL SALES ORDER PAYMENT
export const fetchAllSalesOrderPayment = createAsyncThunk(
  'salesOrderPayment/fetchAllSalesOrderPayment',
  async (salesOrderId, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: `/sales-order/payment/${salesOrderId}`
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

// CREATE SALES ORDER PAYMENT
export const createSalesOrderPayment = createAsyncThunk(
  'salesOrderPayment/createSalesOrderPayment',
  async ({ data, salesOrderCode }, { dispatch, rejectWithValue }) => {
    try {
      await swalConfirmationAdd({
        label: label,
        name: 'Surat',
        title: 'Anda akan membuat pembayaran sales order?',
        axiosRequest: () => {
          return axios({
            method: 'POST',
            url: '/sales-order/payment/create',
            data: data
          })
        },
        dispatchRequest: () => {
          dispatch(fetchDetailSalesOrder(salesOrderCode))
        }
      })
    } catch (error) {
      return rejectWithValue({})
    }
  }
)

export const resetSalesOrderPayments = createAsyncThunk(async () => {
  return
})

export const appMasterProductSlice = createSlice({
  name: 'salesOrderPayment',
  initialState: {
    dataSalesOrderPayment: [],
    loadingDataSalesOrderPayment: true,
    errorDataSalesOrderPayment: false,

    defaultValue: {
      typePayment: '',
      amount: 0,
      notes: '',
      salesOrderId: ''
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
      .addCase(fetchAllSalesOrderPayment.pending, (state, action) => {
        state.loadingDataSalesOrderPayment = true
      })
      .addCase(fetchAllSalesOrderPayment.fulfilled, (state, action) => {
        state.dataSalesOrderPayment = action.payload.data
        state.loadingDataSalesOrderPayment = false
      })
      .addCase(fetchAllSalesOrderPayment.rejected, (state, action) => {
        state.dataSalesOrderPayment = []
        state.loadingDataSalesOrderPayment = false
        state.errorDataSalesOrderPayment = action.error.message
      })
      .addCase(resetSalesOrderPayments.fulfilled, state => {
        state.dataSalesOrderPayment = []
      })
  }
})

export default appMasterProductSlice.reducer
