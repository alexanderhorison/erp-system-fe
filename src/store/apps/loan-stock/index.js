import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'src/configs/axios'
import {
  swalSuccess,
  swalToastError
} from 'src/helpers/swalFunction'

const label = 'Loan Products'

// FETCH LOAN PRODUCTS
export const fetchLoanProducts = createAsyncThunk('appLoanStock/listLoanStock', async (params, { rejectWithValue }) => {
  try {
    const response = await axios({
      method: 'GET',
      url: '/sales-order/loan/'
    })
    return response.data
  } catch (error) {
    swalToastError({ label, error })
    return rejectWithValue([])
  }
})

// FETCH LOAN PRODUCTS
export const payLoanStock = createAsyncThunk(
  'appLoanStock/payLoanStock',
  async ({ data, modalTrigger }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'POST',
        url: '/sales-order/loan/create',
        data
      })
      swalSuccess({ label, name: 'Loan Stock', response })
      modalTrigger(false)
      dispatch(fetchLoanProducts())
      return
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

export const appMasterProductSlice = createSlice({
  name: 'appLoanStock',
  initialState: {
    dataListLoan: [],
    loadingListLoan: true,
    errorListLoan: false,
    paginationListLoan: {
      total: 0,
      page: 1,
      limit: 25,
      totalPage: 0
    }
  },
  reducers: {},
  extraReducers: builder => {
    builder
      // HISTORY LOAN
      .addCase(fetchLoanProducts.pending, (state, action) => {
        state.loadingListLoan = true
      })
      .addCase(fetchLoanProducts.fulfilled, (state, action) => {
        state.dataListLoan = action.payload.data
        state.loadingListLoan = false
      })
      .addCase(fetchLoanProducts.rejected, (state, action) => {
        state.loadingListLoan = false
        state.errorListLoan = action.error.message
        state.dataListLoan = []
      })
  }
})

export default appMasterProductSlice.reducer
