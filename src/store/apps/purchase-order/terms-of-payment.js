import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'src/configs/axios'
import { swalConfirmationAdd, swalConfirmationDelete, swalToastError } from 'src/helpers/swalFunction'

const label = 'Terms Of Payment'

// GET ALL TERMS OF PAYMENT
export const fetchAllTermsOfPaymentByCode = createAsyncThunk('termsOfPayment/fetchAllTermsOfPaymentByCode', async ({ purchaseOrderCode }, { rejectWithValue }) => {
  try {
    const response = await axios({
      method: 'GET',
      url: '/purchase-order/terms-of-payment/' + purchaseOrderCode
    })
    return response.data
  } catch (error) {
    swalToastError({ label, error })
    return rejectWithValue([])
  }
})

// GET DETAIL TERMS OF PAYMENT
export const fetchDetailTermsOfPayment = createAsyncThunk(
  'termsOfPayment/fetchDetailTermsOfPayment',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/purchase-order/terms-of-payment' + id
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

// CREATE TERMS OF PAYMENT
export const createTermsOfPayment = createAsyncThunk(
  'termsOfPayment/createTermsOfPayment',
  async ({ purchaseOrderCode, data }, { dispatch, rejectWithValue }) => {
    try {
      await swalConfirmationAdd({
        label: label,
        name: 'Terms Of Payment',
        title: 'Anda akan membuat Terms Of Payment?',
        axiosRequest: () => {
          return axios({
            method: 'POST',
            url: '/purchase-order/terms-of-payment/create',
            data
          })
        },
        dispatchRequest: () => {
          dispatch(fetchAllTermsOfPaymentByCode({ purchaseOrderCode: purchaseOrderCode }))
        }
      })
    } catch (error) {
      return rejectWithValue({})
    }
  }
)

// UPDATE TERMS OF PAYMENT
export const updateFormTermsOfPayment = createAsyncThunk(
  'termsOfPayment/updateFormTermsOfPayment',
  async ({ termsOfPaymentId, data, purchaseOrderCode }, { dispatch, rejectWithValue }) => {
    try {
      await swalConfirmationAdd({
        label: label,
        name: 'Terms Of Payment',
        title: 'Anda akan edit terms of payment?',
        axiosRequest: () => {
          return axios({
            method: 'PUT',
            url: '/purchase-order/terms-of-payment/' + termsOfPaymentId,
            data
          })
        },
        dispatchRequest: () => {
          dispatch(
            fetchAllTermsOfPaymentByCode({ purchaseOrderCode: purchaseOrderCode })
          )
        }
      })
    } catch (error) {
      return rejectWithValue({})
    }
  }
)

// DELETE TERMS OF PAYMENT
export const deleteTermsOfPayment = createAsyncThunk(
  'termsOfPayment/deleteTermsOfPayment',
  async ({ purchaseOrderCode, id }, { dispatch, rejectWithValue }) => {
    try {
      await swalConfirmationDelete({
        label: label,
        name: 'Terms Of Payment',
        title: 'Anda akan hapus terms of payment?',
        axiosRequest: () => {
          return axios({
            method: 'DELETE',
            url: '/purchase-order/terms-of-payment/' + id,
          })
        },
        dispatchRequest: () => {
          dispatch(
            fetchAllTermsOfPaymentByCode({ purchaseOrderCode: purchaseOrderCode })
          )
        }
      })
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

export const appMasterProductSlice = createSlice({
  name: 'termsOfPayment',
  initialState: {
    dataTermsOfPayment: [],
    loadingTermsOfPayment: true,
    errorTermsOfPayment: false,

    detailTermsOfPayment: {},
    loadingDetailTermsOfPayment: false,
    errorDetailTermsOfPayment: false,

    defaultValue: {
      title: '',
      reminderDate: 2,
      isSendEmail: true
    }
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchAllTermsOfPaymentByCode.pending, (state, action) => {
        state.loadingTermsOfPayment = true
      })
      .addCase(fetchAllTermsOfPaymentByCode.fulfilled, (state, action) => {
        state.dataTermsOfPayment = action.payload.data
        state.loadingTermsOfPayment = false
      })
      .addCase(fetchAllTermsOfPaymentByCode.rejected, (state, action) => {
        state.dataTermsOfPayment = []
        state.loadingTermsOfPayment = false
        state.errorTermsOfPayment = action.error.message
      })
      .addCase(fetchDetailTermsOfPayment.pending, (state, action) => {
        state.loadingDetailTermsOfPayment = true
      })
      .addCase(fetchDetailTermsOfPayment.fulfilled, (state, action) => {
        state.detailTermsOfPayment = action.payload.data
        state.loadingDetailTermsOfPayment = false
      })
      .addCase(fetchDetailTermsOfPayment.rejected, (state, action) => {
        state.dataTermsOfPayment = []
        state.loadingDetailTermsOfPayment = false
        state.errorDetailTermsOfPayment = action.error.message
      })
  }
})

export default appMasterProductSlice.reducer
