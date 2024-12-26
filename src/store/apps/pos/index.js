import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'src/configs/axios'
import {
  swalConfirmationAdd,
  swalToastError
} from 'src/helpers/swalFunction'
import { fetchMasterDataCustomer } from '../master/customer'
import { swalConfirmationChargePos } from 'src/helpers/swalFunctionPos'

const label = 'produk'
// GET ALL WAREHOUSE
export const fetchListProductPos = createAsyncThunk(
  'appProductPos/fetchListProductPos',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/point-of-sale/find-product-by-warehouseid',
        params: params
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

export const fetchDetailProductPos = createAsyncThunk(
  'appProductPos/fetchDetailProductPos',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/point-of-sale/get-all-product-by-productid',
        params: params
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

// UPDATE PRODUCT TO FAV
export const updateFavoriteProductPos = createAsyncThunk(
  'appProductPos/updateFavoriteProductPos',
  async ({ data, setOpen }, { dispatch, rejectWithValue }) => {
    try {
      await swalConfirmationAdd({
        label: 'Favorite',
        name: 'Favorite',
        title: 'Jadikan produk favorit?',
        axiosRequest: () => {
          return axios({
            method: 'POST',
            url: '/point-of-sale/add-favorite',
            data
          })
        },
        dispatchRequest: () => {
          // setOpen(false)
          // dispatch(fetchMasterDataVendor())
        }
      })
    } catch (error) {
      swalError({ error, label })
      return rejectWithValue({})
    }
  }
)

// ADD CUSTOMER AT POS
export const addMasterDataCustomerPos = createAsyncThunk(
  'appProductPos/addMasterDataCustomerPos',
  async ({ data, setOpen, setSelectedCustomerPos }, { dispatch, rejectWithValue }) => {
    try {
      const response = await swalConfirmationAdd({
        label: 'Customer',
        name: 'Customer',
        title: 'Anda akan menambahkan customer?',
        axiosRequest: () => {
          return axios({
            method: 'POST',
            url: '/master/customer/create',
            data
          })
        },
        dispatchRequest: () => {
          setOpen(false)
          dispatch(fetchMasterDataCustomer())
        }
      })
      const customer = response?.data?.data;
      if (customer) {
        setSelectedCustomerPos({
          id: customer.id,
          name: customer.name,
        });
        localStorage.setItem('selectedCustomerPos', JSON.stringify({ id: customer.id, name: customer.name }))
      }
    } catch (error) {
      swalError({ error, label })
      return rejectWithValue({})
    }
  }
)

export const fetchListPaymentTypePos = createAsyncThunk(
  'appProductPos/fetchListPaymentType',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/point-of-sale/payment-type',
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

// CHARGE PAYMENT
export const chargePos = createAsyncThunk(
  'appProductPos/chargePos',
  async ({ data, selectedPayment, subTotalPrice, onComplete }, { rejectWithValue }) => {
    try {
      await swalConfirmationChargePos({
        title: `Pembayaran menggunakan ${selectedPayment?.label}?`,
        text: `Sebesar Rp.${subTotalPrice}`,
        width: 500,
        axiosRequest: () => {
          return axios({
            method: 'POST',
            url: '/point-of-sale/create-point-of-sale',
            data
          })
        },
        dispatchRequest: () => {
          onComplete()
        }
      })
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

export const appPosSlice = createSlice({
  name: 'appProductPos',
  initialState: {
    listProductPos: [],
    loadingListProductPos: true,
    errorListProductPos: false,

    detailProductPos: [],
    loadingDetailProductPos: true,
    errorDetailProductPos: false,

    listPaymentType: [],
    loadingListPaymentType: true,
    errorListPaymentType: false
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchListProductPos.pending, (state, action) => {
        state.loadingListProductPos = true
      })
      .addCase(fetchListProductPos.fulfilled, (state, action) => {
        state.listProductPos = action.payload.data
        state.loadingListProductPos = false
      })
      .addCase(fetchListProductPos.rejected, (state, action) => {
        state.loadingListProductPos = false
        state.errorListProductPos = action.error.message
        state.listProductPos = []
      })
      // DETAIL
      .addCase(fetchDetailProductPos.pending, (state, action) => {
        state.loadingDetailProductPos = true
      })
      .addCase(fetchDetailProductPos.fulfilled, (state, action) => {
        state.detailProductPos = action.payload.data
        state.loadingDetailProductPos = false
      })
      .addCase(fetchDetailProductPos.rejected, (state, action) => {
        state.loadingDetailProductPos = false
        state.errorDetailProductPos = action.error.message
        state.detailProductPos = []
      })
      // PAYMENT TYPE
      .addCase(fetchListPaymentTypePos.pending, (state, action) => {
        state.loadingListPaymentType = true
      })
      .addCase(fetchListPaymentTypePos.fulfilled, (state, action) => {
        state.listPaymentType = action.payload.data
        state.loadingListPaymentType = false
      })
      .addCase(fetchListPaymentTypePos.rejected, (state, action) => {
        state.loadingListPaymentType = false
        state.errorListPaymentType = action.error.message
        state.listPaymentType = []
      })
  }
})

export default appPosSlice.reducer
