import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'src/configs/axios'
import { swalConfirmationAdd, swalToastError } from 'src/helpers/swalFunction'
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
  async ({ data, setOpen, setFavorite, isFavorite }, { dispatch, rejectWithValue }) => {
    try {
      await swalConfirmationAdd({
        label: 'Favorite',
        name: 'Favorite',
        title: `${isFavorite ? 'Remove produk dari favorit?' : 'Jadikan produk favorit?'}`,
        axiosRequest: () => {
          if (isFavorite) {
            setFavorite(false)
          } else {
            setFavorite(true)
          }
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
            url: '/master/customer/create-pos',
            data
          })
        },
        dispatchRequest: () => {
          setOpen(false)
          dispatch(fetchMasterDataCustomer())
        }
      })
      const customer = response?.data?.data
      if (customer) {
        setSelectedCustomerPos({
          id: customer.id,
          name: customer.name
        })
        localStorage.setItem('selectedCustomerPos', JSON.stringify({ id: customer.id, name: customer.name }))
      }
    } catch (error) {
      swalError({ error, label })
      return rejectWithValue({})
    }
  }
)

// GET ALL CUSTOMER POS
export const fetchCustomerPos = createAsyncThunk(
  'appProductPos/fetchCustomerPos',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/master/customer/all-pos?isPosCustomer=true'
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

export const fetchListPaymentTypePos = createAsyncThunk(
  'appProductPos/fetchListPaymentType',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/point-of-sale/payment-type'
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
        dispatchRequest: ({ data }) => {
          onComplete(data?.data)
        }
      })
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

// GET ALL POINT OF SALE BY WAREHOUSEID
export const fetchAllPointOfSaleByWarehouseId = createAsyncThunk(
  'appProductPos/fetchAllPointOfSaleByWarehouseId',
  async (warehouseId, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/point-of-sale/get-all-point-of-sale/' + warehouseId
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

// GET DETAIL PURCHASE ORDER
export const fetchDetailPointOfSale = createAsyncThunk(
  'appProductPos/fetchDetailPointOfSale',
  async (code, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/point-of-sale/' + code
      })
      return response.data
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
    errorListPaymentType: false,

    listCustomerPos: [],
    loadingListCustomerPos: true,
    errorListCustomerPos: false,

    dataPointOfSale: [],
    loadingDataPointOfSale: true,
    errorDataPointOfSale: false,

    detailPointOfSale: {},
    loadingDetailPointOfSale: true,
    errorDetailPointOfSale: false
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

      // CUSTOMER
      .addCase(fetchCustomerPos.pending, (state, action) => {
        state.loadingListCustomerPos = true
      })
      .addCase(fetchCustomerPos.fulfilled, (state, action) => {
        state.listCustomerPos = action.payload.data
        state.loadingListCustomerPos = false
      })
      .addCase(fetchCustomerPos.rejected, (state, action) => {
        state.loadingListCustomerPos = false
        state.errorListCustomerPos = action.error.message
        state.listCustomerPos = []
      })

      // List Point Of Sale
      .addCase(fetchAllPointOfSaleByWarehouseId.pending, (state, action) => {
        state.loadingDataPointOfSale = true
      })
      .addCase(fetchAllPointOfSaleByWarehouseId.fulfilled, (state, action) => {
        state.dataPointOfSale = action.payload.data
        state.loadingDataPointOfSale = false
      })
      .addCase(fetchAllPointOfSaleByWarehouseId.rejected, (state, action) => {
        state.dataPointOfSale = []
        state.loadingDataPointOfSale = false
        state.errorDataPointOfSale = action.error.message
      })

      // fetch detail point of sale
      .addCase(fetchDetailPointOfSale.pending, (state, action) => {
        state.loadingDetailPointOfSale = true
      })
      .addCase(fetchDetailPointOfSale.fulfilled, (state, action) => {
        state.detailPointOfSale = action.payload.data
        state.loadingDetailPointOfSale = false
      })
      .addCase(fetchDetailPointOfSale.rejected, (state, action) => {
        state.detailPointOfSale = {}
        state.loadingDetailPointOfSale = false
        state.errorDetailPointOfSale = action.error.message
      })
  }
})

export default appPosSlice.reducer
