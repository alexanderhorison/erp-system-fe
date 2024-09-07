import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'src/configs/axios'
import { swalConfirmationAdd, swalToastError } from 'src/helpers/swalFunction'

const label = 'Surat Outstanding Produk'

// GET ALL DATA RECEIPT ORDER OUTSTANDING
export const fetchAllReceiptOrderOutstanding = createAsyncThunk(
  'deliveryOrderReceiptOutstanding/fetchAllReceiptOrderOutstanding',
  async (filter, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/delivery-order-receive/outstanding/all',
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

// GET DETAIL RECEIPT ORDER OUTSTANDING
export const fetchDetailReceiptOrderOutstanding = createAsyncThunk(
  'deliveryOrderReceiptOutstanding/fetchDetailReceiptOrderOutstanding',
  async ({ code }, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/delivery-order-receive/outstanding/' + code,
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

// SAVE OUTSTANDING
export const saveToDraftOutstandingProduct = createAsyncThunk(
  'appStockOpname/updateStatusStockOpname',
  async ({ data, code, router }, { dispatch, rejectWithValue }) => {
    try {
      const response = await swalConfirmationAdd({
        label,
        name: 'Surat Outstanding Produk',
        title: `Anda akan simpan surat outstanding?`,
        axiosRequest: () => {
          return axios({
            method: 'PUT',
            url: `/delivery-order-receive/outstanding/draft`,
            data
          })
        },
        dispatchRequest: () => {
          // router.push('/receipt-order-outstanding')
          // dispatch(fetchAllReceiptOrderOutstanding())
        }
      })
    } catch (error) {
      swalError({ error, label })
      return rejectWithValue({})
    }
  }
)

// APPROVE OUTSTANDING
export const approveOutstandingProduct = createAsyncThunk(
  'appStockOpname/updateStatusStockOpname',
  async ({ data, code, router }, { dispatch, rejectWithValue }) => {
    try {
      const response = await swalConfirmationAdd({
        label,
        name: 'Surat Outstanding Produk',
        title: `Anda akan simpan surat outstanding?`,
        axiosRequest: () => {
          return axios({
            method: 'POST',
            url: `/delivery-order-receive/outstanding/approve/` + code,
            data
          })
        },
        dispatchRequest: () => {
          // router.push('/receipt-order-outstanding')
          // dispatch(fetchAllReceiptOrderOutstanding())
        }
      })
    } catch (error) {
      swalError({ error, label })
      return rejectWithValue({})
    }
  }
)


export const ReceiptOrderOutstandingSlice = createSlice({
  name: 'deliveryOrderReceiptOutstanding',
  initialState: {
    data: [],
    loading: false,
    error: false,

    detail: {},
    loadingDetail: false,
    errorDetail: false,

  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchAllReceiptOrderOutstanding.pending, (state, action) => {
        state.loading = true
      })
      .addCase(fetchAllReceiptOrderOutstanding.fulfilled, (state, action) => {
        state.data = action.payload.data
        state.loading = false
      })
      .addCase(fetchAllReceiptOrderOutstanding.rejected, (state, action) => {
        state.loading = false
        state.errorUpdateReceiveOrder = action.error.message
      })

      .addCase(fetchDetailReceiptOrderOutstanding.pending, (state, action) => {
        state.loadingDetail = true
      })
      .addCase(fetchDetailReceiptOrderOutstanding.fulfilled, (state, action) => {
        state.detail = action.payload.data
        state.loadingDetail = false
      })
      .addCase(fetchDetailReceiptOrderOutstanding.rejected, (state, action) => {
        state.loadingDetail = false
        state.errorDetail = action.error.message
      })
  }
})

export default ReceiptOrderOutstandingSlice.reducer
